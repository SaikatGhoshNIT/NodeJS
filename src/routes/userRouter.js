const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest');


// Get all the pending connection requests for the logged in user
userRouter.get('/user/requests/recived', userAuth, async(req, res) =>{
    try{
        const logedInUserId = req.user._id;

        if(!logedInUserId) {
            return res.status(400).send("User not authenticated");
        }

        const allConnectRequest = await ConnectionRequest.find({
            toUserId: logedInUserId,
            status: 'interested',
        }).populate('fromUserId', ["firstName", "lastName", "age", "gender", "skills"]) // Populate the fromUserId field with firstName and lastName from User model with the held of ref connectionRequest

        if(!allConnectRequest || allConnectRequest.length === 0) {
            return res.status(404).send("No connection requests found");
        }
    

        res.status(200).json({
            message: "Connection requests fetched successfully",
            connectionRequests: allConnectRequest
        })

    }
    catch(error) {
        console.error("Error fetching connection requests:", error);
        res.status(400).send("Error fetching connection requests");
    }
})


// Get all the sent connection update requests by the logged in user
userRouter.get('/user/requests/sent', userAuth, async(req, res) =>{
    try{

    }
    catch(error) {
        console.error("Error fetching sent connection requests:", error);
        res.status(400).send("Error fetching sent connection requests");
    }
})


module.exports = userRouter;