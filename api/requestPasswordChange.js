const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")
const passwordChanges = require("../passwordChanges")

const router = express.Router()

/*
REQUEST:
id (number): your id
cookie (string): your cookie
newPassword (string): your new password

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true


ERROR CODES:
1000 - Invalid id type
1001 - Invalid cookie type
1002 - Invalid newPassword type

1010 - Error searching for user
1011 - No user found
1012 - Invalid cookie
1013 - Email must be confirmed
1014 - Error creating password change
1015 - Invalid password
*/
router.post("/requestPasswordChange", bodyParser.json(), async (req, res) => {
    const {id, cookie, newPassword} = req.body

    if (typeof(id) != "number") {
        res.json({success:false, errorCode:1000, errorMessage:`Param 'id' must be a number (got '${typeof(id)}' instead)`})
        return
    }

    if (typeof(cookie) != "string") {
        res.json({success:false, errorCode:1001, errorMessage:`Param 'cookie' must be a string (got '${typeof(cookie)}' instead)`})
        return
    }

    if (typeof(newPassword) != "string") {
        res.json({success:false, errorCode:1002, errorMessage:`Param 'newPassword' must be a string (got '${typeof(newPassword)}' instead)`})
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

    if (!user.email_confirmed) {
        res.json({success:false, errorCode:1013, errorMessage:"Your email must be confirmed"})
        return
    }


    if (!userManager.isValidPassword(newPassword)) {
        res.json({success:false, errorCode:1015, errorMessage:"Invalid password"})
        return
    }


    {
        let e = passwordChanges.newRequest(id, newPassword)
        if (e) {
            res.json({success:false, errorCode:1014, errorMessage:"An error occurred when creating the password change request"})
            return
        }
    }

    res.json({success:true})
}, requestErrorHandler)

module.exports = router