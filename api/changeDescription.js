const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")

const router = express.Router()

/*
REQUEST:
id (number): your id
cookie (string): your cookie
newDescription (string): your new description

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true


ERROR CODES:
1000 - Invalid id type
1001 - Invalid cookie type
1002 - Invalid newDescription type

1010 - Error searching for user
1011 - No user found
1012 - Invalid cookie

1013 - Invalid description
1014 - Error changing description
*/
router.post("/changeDescription", bodyParser.json(), async (req, res) => {
    const {id, cookie, newDescription} = req.body

    if (typeof(id) != "number") {
        res.json({success:false, errorCode:1000, errorMessage:`Param 'id' must be a number (got '${typeof(id)}' instead)`})
        return
    }

    if (typeof(cookie) != "string") {
        res.json({success:false, errorCode:1001, errorMessage:`Param 'cookie' must be a string (got '${typeof(cookie)}' instead)`})
        return
    }

    if (typeof(newDescription) != "string") {
        res.json({success:false, errorCode:1002, errorMessage:`Param 'newDescription' must be a string (got '${typeof(newDescription)}' instead)`})
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

    if (!userManager.isValidDescription(newDescription)) {
        res.json({success:false, errorCode:1013, errorMessage:"Invalid description (greater than 200 characters)"})
        return
    }

    {
        let e = await userManager.changeDescription(id, newDescription)
        if (e) {
            res.json({success:false, errorCode:1014, errorMessage:"An error occurred when changing the description"})
            return
        }
    }

    res.json({success:true})
}, requestErrorHandler)

module.exports = router