const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sequelize = require('./util/database');
const User = require('./models/users');

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.post('/user/signup-user', async(req,res) => {
    try {
    const username = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const data = await User.create( {username: username, email: email, password: password} )
    res.status(201).json({newUserDetail: data});
    } catch(err) {
        console.log(`error has been occur i.e${err}`);
        res.status(403).json(`error occured${err}`);
    }
})

sequelize.sync().then(result => {
    // console.log(result);
}).catch(err => {
    console.log(err);
})

app.listen(3000);