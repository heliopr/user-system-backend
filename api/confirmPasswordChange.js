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
code (string): the confirmation code

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true


ERROR CODES:
1000 - Invalid id type
1001 - Invalid cookie type
1002 - Invalid code type

1010 - Error searching for user
1011 - No user found
1012 - Invalid cookie
1013 - Email must be confirmed

1014 - Error searching for password change
1015 - No password change found
1016 - Invalid code
*/
router.post("/confirmPasswordChange", bodyParser.json(), async (req, res) => {
    const {id, cookie, code} = req.body

    if (typeof(id) != "number") {
        res.json({success:false, errorCode:1000, errorMessage:`Param 'id' must be a number (got '${typeof(id)}' instead)`})
        return
    }

    if (typeof(cookie) != "string") {
        res.json({success:false, errorCode:1001, errorMessage:`Param 'cookie' must be a string (got '${typeof(cookie)}' instead)`})
        return
    }

    if (typeof(code) != "string") {
        res.json({success:false, errorCode:1002, errorMessage:`Param 'code' must be a string (got '${typeof(code)}' instead)`})
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


    {
        let [exists, e] = await passwordChanges.exists(id)
        if (e) {
            res.json({success:false, errorCode:1014, errorMessage:"An error occurred when searching for password change"})
            return
        }
        else if (!exists) {
            res.json({success:false, errorCode:1015, errorMessage:"No password change found"})
            return
        }
    }

    let passwordChange
    {
        let [p, e] = await passwordChanges.get(id)
        if (e || !p) {
            res.json({success:false, errorCode:1014, errorMessage:"An error occurred when searching for password change"})
            return
        }
        passwordChange = p
    }

    if (passwordChange.code !== code) {
        res.json({success:false, errorCode:1016, errorMessage:"Invalid code"})
        return
    }

    
    {
        let e = await passwordChanges.deleteRequest(id)
        if (e) {
            res.json({success:false, errorCode:1017, errorMessage:"An error occurred when changing password"})
            return
        }
    }

    {
        let e = await userManager.changePassword(id, passwordChange.new_password)
        if (e) {
            res.json({success:false, errorCode:1017, errorMessage:"An error occurred when changing password"})
            return
        }
    }


    res.json({success:true})
}, requestErrorHandler)

module.exports = router