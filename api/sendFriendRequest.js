const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")
const friendRequests = require("../friendRequests")

const router = express.Router()

/*
REQUEST:
sender (number): your id
target (number): the target's id
cookie (string): your cookie

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true


ERROR CODES:
1000 - Invalid id type
1001 - Invalid target type
1002 - Invalid cookie type

1010 - Error searching for sender
1011 - Invalid sender id (user does not exist)
1012 - Invalid cookie

1013 - Error searching for target user
1014 - Invalid target id (user does not exist)

1015 - Error checking for existing friendship
1016 - Users are friends already

1017 - Error checking for existing friend requests
1018 - There already is a pending friend request between you two

1019 - Sender email is not confirmed
1020 - Target email is not confirmed

1021 - You can't send friend request to yourself
*/
router.post("/sendFriendRequest", bodyParser.json(), async (req, res) => {
    const {cookie} = req.body
    let {sender, target} = req.body
    if (typeof(sender) != "number") {
        res.json({success:false, errorCode:1000, errorMessage: `Param 'sender' must be a number (got '${typeof(sender)}' instead)`})
        return
    }
    sender = parseInt(sender)

    if (typeof(target) != "number") {
        res.json({success:false, errorCode:1001, errorMessage: `Param 'target' must be a number (got '${typeof(target)}' instead)`})
        return
    }
    target = parseInt(target)

    if (typeof(cookie) != "string") {
        res.json({success:false, errorCode:1002, errorMessage:`Param 'cookie' must be a string (got '${typeof(cookie)}' instead)`})
        return
    }

    if (sender == target) {
        res.json({success:false, errorCode:1021, errorMessage:"You can't send friend requests to yourself"})
        return
    }


    let userSender
    {
        let [u,e] = await userManager.getUserById(sender)
        if (e) {
            res.json({success:false, errorCode:1010, errorMessage:"An error occurred when trying to search for sender user"})
            return
        }
        else if (!u) {
            res.json({success:false, errorCode:1011, errorMessage:"Invalid sender ID, no user could be found"})
            return
        }
        userSender = u
    }

    if (!userSender.email_confirmed) {
        res.json({success:false, errorCode:1019, errorMessage:"You must have a confirmed email in order to send friend requests"})
        return
    }

    if (cookie !== userSender.cookie) {
        res.json({success:false, errorCode:1012, errorMessage:"Invalid cookie"})
        return
    }


    let userTarget
    {
        let [u,e] = await userManager.getUserById(target)
        if (e) {
            res.json({success:false, errorCode:1013, errorMessage:"An err0r occurred when trying to search for target user"})
            return
        }
        else if (!u) {
            res.json({success:false, errorCode:1014, errorMessage:"Invalid target ID, no user could be found"})
            return
        }
        userTarget = u
    }

    if (!userTarget.email_confirmed) {
        res.json({success:false, errorCode:1020, errorMessage:"Target must have a confirmed email"})
        return
    }


    {
        let [areFriends, e] = await userManager.areFriends(sender, target)
        if (e) {
            res.json({success:false, errorCode:1015, errorMessage:"An error occurred when checking if users are friends already"})
            return
        }
        else if (areFriends) {
            res.json({success:false, errorCode:1016, errorMessage:"Users are friends already"})
            return
        }
    }

    
    {
        let [exists, e] = await friendRequests.exists(sender, target)
        if (e) {
            res.json({success:false, errorCode:1017, errorMessage:"An error occurred when searching for existing friend request"})
            return
        }
        else if (exists) {
            res.json({success:false, errorCode:1018, errorMessage:"There already is a friend request between you two"})
            return
        }
    }



    let e = await friendRequests.createRequest(sender, target)
    if (e) {
        res.json({success:false, errorCode:1021, errorMessage:"An error occurred when trying to create the friend request"})
        return
    }

    res.json({success:true})
}, requestErrorHandler)

module.exports = router