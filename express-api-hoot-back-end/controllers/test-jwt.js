const router = require('express').Router()
const jwt = require('jsonwebtoken')

router.get('/sign-token', (req, res) => {
    // Simulate Signing in 
    // We get username and pw
    // we verify user exist and the password matches
    // Create A Token for that user
    const user = {
        _id: "09ui320u02uemovkfmadoifj",
        username: "heidelberger",
        // password: 'super_secret_password'
    }

    const token = jwt.sign({ user }, process.env.SECRET_KEY)

    res.json({token, message: 'Success'})
})

router.post('/verify-token', (req, res) => {
    // console.log(req.headers.authorization.split(' ')[1])
    try {
        const token = req.headers.authorization.split(' ')[1]
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        res.json({decoded})
        
    } catch (error) {
        res.status(401).json({err: "Invalid Token"})
    }

})
module.exports = router