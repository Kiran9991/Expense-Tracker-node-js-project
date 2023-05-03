const Expense = require('../models/expense');
const User = require('../models/users');
const FileDownload = require('../models/filesdownloaded');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');
const ITEMS_PER_PAGE = 4;

const addExpense = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const{amount, description, category} = req.body;

        if(amount == undefined || amount.length === 0) {
            return res.status(400).json({success: false, message: 'Parameters missing'})
        }

        const expense = await Expense.create({ amount, description, category, userId: req.user.id}, {transaction: t})
        const totalExpense = Number(req.user.totalExpenses) + Number(amount)
        await User.update({
            totalExpenses: totalExpense
        },{
            where: {id: req.user.id},
            transaction: t
        })
            await t.commit();
            res.status(200).json({newExpenseDetail: expense})
           
    } catch(err) {
        await t.rollback();
        console.log(`posting data is not working`);
        res.status(500).json(err);
    }
}

const getExpenses = async(req, res) => {
    try {
        const page = +req.query.page || 1;
        let totalItems;
        const total = await Expense.count()  
        totalItems = total;           
        const expenses = await Expense.findAll({
            offset: (page-1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
        })
        res.status(200).json({
            allExpensesDetails: expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
    } catch(error) {
        console.log('Get expenses is failing', JSON.stringify(error))
        res.status(500).json({error: error})
    }
}

const deleteExpense = async (req, res) => {
    // const t = await sequelize.transaction();
    try {
        if(!req.params.id === 'undefined') {
            console.log("ID is missing")
            return res.status(400).json({err: 'ID is missing'})
        }
        const expenseId = req.params.id;
        const expense = await Expense.findOne({
            where: {
                id:expenseId,
                userId: req.user.id
            }
        })
        const totalExpenses = await Expense.sum('amount', {
            where: {userId: req.user.id}
        })
        const updatedTotalExpenses = totalExpenses - expense.amount
        const noOfRows = await Expense.destroy({where: {id: expenseId, userId: req.user.id}});
        await User.update({
            totalExpenses: updatedTotalExpenses
        },{
            where: {id: req.user.id},
            // transaction: t
        })
        if(noOfRows === 0) {
            return res.status(404).json({message: `Expense doesn't belongs to user`})
        }
        res.sendStatus(200);
    } catch(err) {
        console.log(err)
        res.status(500).json(err);
    }
}

const downloadExpense = async(req, res) => {
    try {

    const expenses = await UserServices.getExpenses(req);
    // console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;

    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({ fileURL, filename, success: true})
    } catch(err) {
        console.log(err);
        res.status(500).json({fileURL: '', success: false, err: err})
    }
}

const filesDownloaded = async(req, res) => {
    try {
        const{fileURL, filename} = req.body;
        const filedownload = await FileDownload.create({fileURL, filename, userId: req.user.id})
        res.status(201).json({filedownload, success: true})
    } catch(err) {
        console.log(err);
        res.status(501).json({success: false, err:err})
    }
}

const listOfFilesDownloaded = async(req, res) => {
    try{
        const fileList = await FileDownload.findAll()
        res.status(204).json({fileList, success: true});
    } catch(err) {
        console.log(err);
        res.status(503).json({success: false, err: err})
    }
}

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    downloadExpense,
    // filesDownloaded,
    // listOfFilesDownloaded
}