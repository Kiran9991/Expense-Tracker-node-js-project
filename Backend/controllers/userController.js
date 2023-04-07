const User = require('../models/users');

function isStringInvalid(string) {
    if(string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

const signUp = async(req,res) => {
    try {
    // const username = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;

    const {name, email, password} = req.body;

    if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
        return res.status(400).json({err: "Bad parameters. Something is missing"})
    }

    await User.create({ name, email, password})
    res.status(201).json({message: 'Successfully created new user'});
    } catch(err) {
        res.status(500).json(err);
    }
}

module.exports = {
    signUp
}