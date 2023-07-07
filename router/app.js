const express = require('express');
const router = express.Router();



router.get('/', (req, res) => {
    res.send('hello world')
})

// define registration route
router.post('/', (req, res) => {
    const {username, password} = req.body;
    res.send('register')
})

// define login route with bcrypt encryption
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    res.send('login successfully')
})

// define logout route
router.post('/logout', (req, res) => {
    res.send('logout')
})

// define reset password route
router.post('/reset-password', (req, res) => {
    const {old_password, new_password} = req.body;
    res.send('reset password')
})

module.exports = router;