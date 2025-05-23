const UserLoginCon = require('../Schema/UserSchema')

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const login = ((req, res) => {
    let email = req.body.email;
    UserLoginCon.findOne({ userEmail: email })
        .then((result) => {
            console.log(result);
            if (!result) {
                res.json({ err: "email is wrong" })

            }
            let ismatching = bcrypt.compareSync(req.body.password, result.passsword)
            if (ismatching === true) {
                console.log(true);

                let token = jwt.sign({
                    _id: result._id,
                    userEmail: result.email
                }, process.env.JWT_KEY)
                res.json({ token, status: 200 })

            } else {
                res.json({ err: "password is wrong" })

            }

        })
        .catch((err) => {
            res.json({
                err: err
            })
        })
})


module.exports = { login }