const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")

const router = express.Router()

/*
REQUEST:
username (string): the username
password (string): the user's password

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true
id (number)
cookie (string)


ERROR CODES:
1000 - Invalid username type
1001 - Invalid password type

1010 - Error when searching for user
1011 - User not found
1012 - Invalid password
*/
router.get("/getCookie", bodyParser.urlencoded({extended:true}), async (req, res) => {
    const {username, password} = req.query
    if (typeof(username) != "string") {
        res.json({success: false, errorCode: 1000, errorMessage: `Param 'username' must be a string (got '${typeof(username)}' instead)`})
        return
    }

    if (typeof(password) != "string") {
        res.json({success: false, errorCode: 1001, errorMessage: `Param 'password' must be a string (got '${typeof(password)}' instead)`})
        return
    }


    let user
    {
        let [u,e] = await userManager.getUserByUsername(username)
        if (e) {
            res.json({success:false, errorCode:1010, errorMessage:"An error occurred when trying to search for user"})
            return
        }
        else if (!u) {
            res.json({success:false, errorCode:1011, errorMessage:"User was not found"})
            return
        }
        user = u
    }

    if (user.password !== password) {
        res.json({success:false, errorCode:1012, errorMessage:"Invalid password"})
        return
    }

    res.json({success:true, id: user.id, cookie: user.cookie})
}, requestErrorHandler)

module.exports = router