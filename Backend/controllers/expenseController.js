const Expense = require('../models/expense');

const addExpense = async(req, res) => {
    try {
        const{amount, description, category} = req.body;

        const data = await Expense.create({amount, description, category, userId: req.user.id});
        res.status(201).json({newExpenseDetail: data, success: true});
    } catch(err) {
        res.status(500).json(err);
    }
}

const getExpenses = async(req, res) => {
    try {
        const expenses = Expense.findAll({ where : { userId: req.user.id}});
        res.status(200).json({newExpenses: expenses, success: true})
    } catch(error) {
        console.log('Get expenses is failing', JSON.stringify(error))
        res.status(500).json({success: false, error: error})
    }
}

const deleteExpense = async (req, res) => {
    try {
        if(!req.params.id === 'undefined') {
            console.log("ID is missing")
            return res.status(400).json({err: 'ID is missing'})
        }
        const expenseId = req.params.id;
        await Expense.destroy({where: {id: expenseId, userId: req.user.id}});
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