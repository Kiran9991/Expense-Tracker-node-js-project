const User = require('../models/users');
const Expense = require('../models/expense');

const userLeaderBoard = async(req, res) => {
    try {
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {}
        expenses.forEach((expense) => {

            if(userAggregatedExpenses[expense.userId]) {
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.amount;
            }else {
                userAggregatedExpenses[expense.userId] = expense.amount;
            }
        })
        var userLeaderBoardDetails = [];
        users.forEach((user) => {
            userLeaderBoardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id]})
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b) => b.total_cost - a.total_cost);
        res.status(200).json(userLeaderBoardDetails)
    }catch(error) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    userLeaderBoard
}