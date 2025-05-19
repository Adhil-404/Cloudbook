const UserController = require('../Schema/UserSchema')

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const UserRegistration = ((req, res) => {
    let password = req.body.password
    let hash = bcrypt.hashSync(password, 10)
    let user = new UserController({
        userName: req.body.fullName,
        userEmail: req.body.email,
        contact: req.body.phone,
        age: req.body.dob,
       
        password: hash
    })
    user.save()
        .then((result) => {
            console.log(result);

            res.json({
                msg: "Registered Successfully",
                status: 200,
                data: result
            })

        })
        .catch((err) => {
            if (err.code === 11000) {
                res.json({ msg: "Email alredy exists" })

            } else {
                res.json({ err: err })

            }
        })
})


module.exports = { UserRegistration }