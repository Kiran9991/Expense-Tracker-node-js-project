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

const signupDetails = async(req, res) => {
    try {
        const data = await User.findAll();
        res.status(201).json({userDetail: data})
    } catch(error) {
        console.log('Get users is failing', JSON.stringify(error))
        res.status(500).json({error: error})
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findAll({ where: { email }})
            if(user.length > 0) {
                if(user[0].password === password) {
                    res.status(200).json({success: true, message: 'User login sucessful'})
                } else {
                    return res.status(401).json({success: false, message: 'User not authorized'})
                }
            } else {
                return res.status(404).json({success: false, message: 'User not found'})
            }
    } catch (err) {
        res.status(500).json({message: err, success: false});
    }
}

module.exports = {
    signUp,
    signupDetails,
    login
}