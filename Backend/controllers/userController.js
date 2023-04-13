const User = require('../models/users');
const bcrypt = require('bcrypt');

function isStringInvalid(string) {
    if(string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

const signUp = async(req,res) => {
    try {

    const {name, email, password} = req.body;

    if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
        return res.status(400).json({err: "Bad parameters. Something is missing"})
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async(err, hash) => {
        console.log(err);
        await User.create({ name, email, password: hash})
        res.status(201).json({message: 'Successfully created new user'});
    })
    } catch(err) {
        res.status(500).json(err);
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({message: "EmailId and password is missing"})
        }

        const user = await User.findAll({ where: { email }})
            if(user.length > 0) {
                if(user[0].password === password) {
                    res.status(200).json({success: true, message: 'User logged in sucessful'})
                } else {
                    return res.status(400).json({success: false, message: 'Password is incorrect'})
                }
            } else {
                return res.status(404).json({success: false, message: `User Doesn't exist`})
            }
    } catch (err) {
        res.status(500).json({message: err, success: false});
    }
}

module.exports = {
    signUp,
    login
}