const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")
const emailConfirmations = require("../emailConfirmations")

const router = express.Router()

/*
REQUEST:
username (string): ...
password (string): ...
email (string): ...

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true
id (number): the user id
cookie (string): the cookie


ERROR CODES:
1000 - Invalid argument type 'username'
1001 - Invalid argument type 'password'
1002 - Invalid argument type 'email'

1010 - Invalid username length
1011 - Invalid username characters

1012 - Invalid password length
1013 - Invalid password characters

1014 - Invalid email

1015 - Error creating user
1016 - Error trying to find user
1017 - Error creating confirmation

1018 - Error checking for unique username
1019 - Username is taken

1020 - Error checking for unique email
1021 - Email is taken
*/
router.post("/registerUser", bodyParser.json(), async (req, res) => {
    const username = req.body["username"]
    //console.log(req.body)
    if (typeof(username) != "string") {
        res.json({success: false, errorCode: 1000, errorMessage: `Field 'username' must be a string (got '${typeof(username)}' instead)`})
        return
    }

    const password = req.body["password"]
    if (typeof(password) != "string") {
        res.json({success: false, errorCode: 1001, errorMessage: `Field 'password' must be a string (got '${typeof(password)}' instead)`})
        return
    }

    const email = req.body["email"]
    if (typeof(email) != "string") {
        res.json({success: false, errorCode: 1002, errorMessage: `Field 'email' must be a string (got '${typeof(email)}' instead)`})
        return
    }


    if (username.length < 5 || username.length > 32) {
        res.json({success: false, errorCode: 1010, errorMessage: "Username must be at least 5 and at most 32 characters long"})
        return
    }

    if (!await userManager.isValidUsername(username)) {
        res.json({success: false, errorCode: 1011, errorMessage: "Username must contain only letters, numbers and underscore. At least one letter is required"})
        return
    }


    if (password.length < 6 || password.length > 32) {
        res.json({success: false, errorCode: 1012, errorMessage: "Password must be at least 6 and at most 32 characters long"})
        return
    }

    if (!await userManager.isValidPassword(password)) {
        res.json({success: false, errorCode: 1013, errorMessage: "Password must contain only letters, numbers and any of the following characters: _, #, ?, !, @, $, %, &, *, -"})
        return
    }


    if (!await userManager.isValidEmail(email)) {
        res.json({success: false, errorCode: 1014, errorMessage: "Invalid email"})
        return
    }



    {
        let [u, e] = await userManager.getUserByUsername(username)
        if (e) {
            res.json({success: false, errorCode: 1018, errorMessage: "An error occurred when trying to check unique username"})
            return
        }
        else if (u) {
            res.json({success: false, errorCode: 1019, errorMessage: "Username has already been taken"})
            return
        }
    }

    {
        let [u, e] = await userManager.getUser("email", email)
        if (e) {
            res.json({success: false, errorCode: 1020, errorMessage: "An error occurred when trying to check unique email"})
            return
        }
        else if (u) {
            res.json({success: false, errorCode: 1021, errorMessage: "Email has already been taken"})
            return
        }
    }

    {
        let e = await userManager.createUser(username, password, email)
        if (e) {
            res.json({success: false, errorCode: 1015, errorMessage: "An error occurred when trying to create user in the database"})
            return
        }
    }

    let user
    {
        let [u, e] = await userManager.getUserByUsername(username)
        if (!u || e) {
            res.json({success: false, errorCode: 1016, errorMessage: "User was created, but an error occurred when trying to get user information in the database (try getting it through /api/getUser)"})
            return
        }
        user = u
    }

    {
        let [code, e] = await emailConfirmations.newConfirmation(email)
        if (!code || e) {
            res.json({success: false, errorCode: 1017, errorMessage: "User was created, but an error occurred when trying to register the email confirmation"})
            return
        }
    }

    res.json({success: true, id: user.id, cookie: user.cookie})
}, requestErrorHandler)

module.exports = router