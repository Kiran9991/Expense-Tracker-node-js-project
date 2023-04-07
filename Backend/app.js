const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sequelize = require('./util/database');
const User = require('./models/users');
const userRoutes = require('./Routes/userRoutes');

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);

sequelize.sync().then(result => {
    // console.log(result);
}).catch(err => {
    console.log(err);
})

app.listen(3000);