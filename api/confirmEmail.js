const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")
const emailConfirmations = require("../emailConfirmations")
const passwordChanges = require("../passwordChanges")

const router = express.Router()

/*
REQUEST:
email (string): the email to confirm
code (string): the confirmation code

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true

ERROR CODES:
1000 - Invalid email type
1001 - Invalid code type

1010 - Invalid email
1011 - Error searching for email owner
1012 - Email is not registered
1013 - Email is already confirmed
1014 - Error occurred in the database
1015 - Wrong code
*/
router.post("/confirmEmail", bodyParser.json(), async (req, res) => {
    const email = req.body["email"]
    if (typeof(email) != "string") {
        res.json({success:false, errorCode:1000, errorMessage:`Field 'email' must be a string (got '${typeof(email)}' instead)`})
        return
    }

    const code = req.body["code"]
    if (typeof(code) != "string") {
        res.json({success:false, errorCode:1001, errorMessage:`Field 'code' must be a string (got '${typeof(code)}' instead)`})
        return
    }


    if (!userManager.isValidEmail(email)) {
        res.json({success:false, errorCode:1010, errorMessage:"Invalid email"})
        return
    }


    {
        let [u, e] = await userManager.getUser("email", email)
        if (e) {
            res.json({success:false, errorCode:1011, errorMessage:"An error occurred when trying to find owner of this email"})
            return
        }
        
        if (!u) {
            res.json({success:false, errorCode:1012, errorMessage:"Email not found"})
            return
        }

        if (u.email_confirmed) {
            res.json({success:false, errorCode:1013, errorMessage:"This email has already been confirmed"})
            return
        }
    }

    {
        let [f, e] = await emailConfirmations.isInDatabase(email)
        if (e) {
            res.json({success:false, errorCode:1014, errorMessage:"An error occurred in the database"})
            return
        }
        else if (!f) {
            res.json({success:false, errorCode:1013, errorMessage:"This email has already been confirmed"})
            return
        }
    }


    {
        let [c, e] = await emailConfirmations.checkCode(email, code)
        if (e) {
            res.json({success:false, errorCode:1014, errorMessage:"An error occurred in the database"})
            return
        }
        else if (!c) {
            res.json({success:false, errorCode:1015, errorMessage:"Wrong code"})
            return
        }
    }

    
    let e = await emailConfirmations.confirmEmail(email)
    if (e) {
        res.json({success:false, errorCode:1014, errorMessage:"An error occurred in the database"})
        return
    }

    {
        await passwordChanges.deleteRequest(id)
    }

    res.json({success:true})
}, requestErrorHandler)

module.exports = router