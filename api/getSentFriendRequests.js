const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")
const friendRequests = require("../friendRequests")

const router = express.Router()

/*
REQUEST:
id (number): your id
cookie (string): your cookie

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true
sent (list of numbers): a list of user ids that you've sent requests and are pending

ERROR CODES:
1000 - Invalid id type
1001 - Invalid cookie type

1010 - Error searching for user
1011 - User was not found
1012 - Email must be confirmed
1013 - Invalid cookie
*/
router.get("/getSentFriendRequests", bodyParser.urlencoded({extended:true}), async (req, res) => {
    let id = req.query["id"]
    const cookie = req.query["cookie"]

    if (isNaN(id)) {
        res.json({success:false, errorCode:1000, errorMessage:"Param 'id' must be a number (got NaN instead)"})
        return
    }
    id = parseInt(id)

    if (typeof(cookie) != "string") {
        res.json({success:false, errorCode:1001, errorMessage:`Param 'cookie' must be a string (got '${typeof(cookie)}' instead)`})
        return
    }


    let user
    {
        let [u,e] = await userManager.getUserById(id)
        if (e) {
            res.json({success:false, errorCode:1010, errorMessage:"An error occurred when searching for user"})
            return
        }
        else if (!u) {
            res.json({success:false, errorCode:1011, errorMessage:"No user with this ID was found"})
            return
        }
        user = u
    }

    if (!user.email_confirmed) {
        res.json({success:false, errorCode:1012, errorMessage:"Your email must be confirmed"})
        return
    }

    if (cookie !== user.cookie) {
        res.json({success:false, errorCode:1013, errorMessage:"Invalid cookie"})
        return
    }


    let [sent, e] = await friendRequests.getSentRequests(id)
    if (e || !sent) {
        res.json({success:false, errorCode:1014, errorMessage:"An error occurred when trying to get sent requests"})
        return
    }

    res.json({success:true, sent:sent})
}, requestErrorHandler)

module.exports = router