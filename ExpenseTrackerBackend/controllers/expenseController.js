const Expense = require('../models/expense');
const User = require('../models/users');
const sequelize = require('../util/database');
// const jwt = require('jsonwebtoken');

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
        const expenses = await req.user.getExpenses();
        res.status(200).json({allExpensesDetails: expenses})
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


module.exports = {
    addExpense,
    getExpenses,
    deleteExpense
}