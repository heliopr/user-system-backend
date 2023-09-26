const express = require("express")
const bodyParser = require("body-parser")
const requestErrorHandler = require("../util/requestErrorHandler")
const userManager = require("../userManager")

const router = express.Router()

/*
REQUEST:
id (number): the user id

RESPONSE:
success (boolean): true or false
errorCode (number): undefined if success == true
errorMessage (string): undefined if success == true
friends (list of numbers): each element is an user id


ERROR CODES:
1000 - Invalid id type

1010 - Error searching for user
1011 - User does not exist


*/
router.get("/getFriends", bodyParser.urlencoded({extended:true}), async (req, res) => {
    const id = req.query.id
    if (typeof(id) != "number") {
        res.json({success: false, errorCode: 1000, errorMessage: `Param 'id' must be a number (got '${typeof(id)}' instead)`})
        return
    }


    {
        let [u, e] = await userManager.getUserById(id)
        if (e) {
            res.json({success:false, errorCode:1010, errorMessage:"An error occurred when trying to search for user"})
            return
        }
        else if (!u) {
            res.json({success:false, errorCode:1011, errorMessage:"User does not exist"})
            return
        }
    }

    
}, requestErrorHandler)

module.exports = router