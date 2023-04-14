const Expense = require('../models/expense');
// const jwt = require('jsonwebtoken');

const addExpense = async(req, res) => {
    try {
        const{amount, description, category} = req.body;

        const data = await req.user.createExpense({amount, description, category});
        res.status(201).json({newExpenseDetail: data});
    } catch(err) {
        console.log(`posting data is not`);
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