// import a dotenv to this file
require('dotenv').config();
const express =  require('express');
const routes = require('./router/app');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/kotcha', routes)


app.listen(process.env.PORT || 3000, () =>{
    console.log('Server is running on port 3000');
})
