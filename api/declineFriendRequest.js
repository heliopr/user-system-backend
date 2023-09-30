const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")
const friendRequests = require("../friendRequests")

const router = express.Router()

/*
REQUEST:
id (number): your id
sender (number): the sender's id
cookie (string): your cookie

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true


ERROR CODES:
1000 - Invalid id type
1001 - Invalid sender type
1002 - Invalid cookie type

1010 - Error searching for user
1011 - User does not exist
1012 - Email needs to be confirmed 
1013 - Invalid cookie

1014 - Error searching for friend request
1015 - Request not found
1016 - Error deleting the request
*/
router.post("/declineFriendRequest", bodyParser.json(), async (req, res) => {
    const {cookie} = req.body
    let {sender, id} = req.body
    if (typeof(id) != "number") {
        res.json({success:false, errorCode:1000, errorMessage: `Param 'id' must be a number (got '${typeof(id)}' instead)`})
        return
    }
    //id = parseInt(id)

    if (typeof(sender) != "number") {
        res.json({success:false, errorCode:1001, errorMessage: `Param 'sender' must be a number (got '${typeof(sender)}' instead)`})
        return
    }
    //sender = parseInt(sender)

    if (typeof(cookie) != "string") {
        res.json({success:false, errorCode:1002, errorMessage:`Param 'cookie' must be a string (got '${typeof(cookie)}' instead)`})
        return
    }


    let user
    {
        let [u,e] = await userManager.getUserById(id)
        if (e) {
            res.json({success:false, errorCode:1010, errorMessage:"An error occurred when trying to search for user"})
            return
        }
        else if (!u) {
            res.json({success:false, errorCode:1011, errorMessage:"Invalid user id, no user could be found"})
            return
        }
        user = u
    }

    if (!user.email_confirmed) {
        res.json({success:false, errorCode:1012, errorMessage:"Your email must be confirmed first"})
        return
    }

    if (cookie !== user.cookie) {
        res.json({success:false, errorCode:1013, errorMessage:"Invalid cookie"})
        return
    }


    {
        let [exists, e] = await friendRequests.existsExactRequest(sender, id)
        if (e) {
            res.json({success:false, errorCode:1014, errorMessage:"An error occurred when trying to search for friend request"})
            return
        }
        else if (!exists) {
            res.json({success:false, errorCode:1015, errorMessage:"This user has not sent you a friend request"})
            return
        }
    }

    let e = await friendRequests.declineRequest(sender, id)
    if (e) {
        res.json({success:false, errorCode:1016, errorMessage:"An error occurred when trying to delete the request"})
        return
    }

    res.json({success:true})
}, requestErrorHandler)

module.exports = router