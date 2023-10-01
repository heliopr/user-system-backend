const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")
const emailConfirmations = require("../emailConfirmations")

const router = express.Router()

/*
REQUEST:
id (number): your id
cookie (string): your cookie
newEmail (string): your new email address

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true


ERROR CODES:
1000 - Invalid id type
1001 - Invalid cookie type
1002 - Invalid newEmail type

1010 - Error searching for user
1011 - No user found
1012 - Invalid cookie

1013 - Invalid email
1014 - New email must be different than your current one
1015 - Error changing email
*/
router.post("/changeEmail", bodyParser.json(), async (req, res) => {
    const {id, cookie, newEmail} = req.body

    if (typeof(id) != "number") {
        res.json({success:false, errorCode:1000, errorMessage:`Param 'id' must be a number (got '${typeof(id)}' instead)`})
        return
    }

    if (typeof(cookie) != "string") {
        res.json({success:false, errorCode:1001, errorMessage:`Param 'cookie' must be a string (got '${typeof(cookie)}' instead)`})
        return
    }

    if (typeof(newEmail) != "string") {
        res.json({success:false, errorCode:1002, errorMessage:`Param 'newEmail' must be a string (got '${typeof(newEmail)}' instead)`})
        return
    }


    let user
    {
        let [u, e] = await userManager.getUserById(id)
        if (e) {
            res.json({success:false, errorCode:1010, errorMessage:"An error occurred when trying to search user"})
            return
        }
        else if (!u) {
            res.json({success:false, errorCode:1011, errorMessage:"User not found"})
            return
        }
        user = u
    }

    if (cookie !== user.cookie) {
        res.json({success:false, errorCode:1012, errorMessage:"Invalid cookie"})
        return
    }

    if (!userManager.isValidEmail(newEmail)) {
        res.json({success:false, errorCode:1013, errorMessage:"Invalid email"})
        return
    }

    if (newEmail === user.email) {
        res.json({success:false, errorCode:1014, errorMessage:"Your new email must be different than your current one"})
        return
    }


    let error
    {
        error = await emailConfirmations.deleteConfirmation(user.email)
        if (!error) {
            error = await userManager.changeEmail(id, newEmail)
            if (!error) {
                let [c,e] = await emailConfirmations.newConfirmation(newEmail)
                error = e
            }
        }
    }

    if (error) {
        res.json({success:false, errorCode:1015, errorMessage:"An error occurred when trying to change your email"})
    }

    res.json({success:true})
}, requestErrorHandler)

module.exports = router