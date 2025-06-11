const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const USER_SAVED_DATA = "firstName lastName age gender skills";

// Get all the pending connection requests for the logged in user
userRouter.get("/user/requests/recived", userAuth, async (req, res) => {
  try {
    const logedInUserId = req.user._id;

    if (!logedInUserId) {
      return res.status(400).send("User not authenticated");
    }

    const allConnectRequest = await ConnectionRequest.find({
      toUserId: logedInUserId,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
    ]); // Populate the fromUserId field with firstName and lastName from User model with the held of ref connectionRequest

    if (!allConnectRequest || allConnectRequest.length === 0) {
      return res.status(404).send("No connection requests found");
    }

    res.status(200).json({
      message: "Connection requests fetched successfully",
      connectionRequests: allConnectRequest,
    });
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(400).send("Error fetching connection requests");
  }
});

// Get all the sent connection update requests by the logged in user
userRouter.get("/user/requests/connections", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;
    if (!logedInUser) {
      return res.status(400).send("User not authenticated");
    }

    const connections = await ConnectionRequest.find({
      $and: [
        {
          $or: [{ fromUserId: logedInUser._id }, { toUserId: logedInUser._id }],
        },
        { status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAVED_DATA)
      .populate("toUserId", USER_SAVED_DATA);

    if (!connections || connections.length === 0) {
      return res.status(404).send("No connections found");
    }

    const data = connections.map((connection) => {
        if (connection.fromUserId._id.toString() === logedInUser._id.toString()) {
          return connection.toUserId; // Return the toUserId data if the logged in user is the fromUserId
        }
        else{
            return connection.fromUserId; //else Return the fromUserId data if the logged in user is the toUserId
        }
    }); // sent only the fromUserId data

    res.status(200).json({
      message: "Connections fetched successfully",
      connections: data,
    });
  } catch (error) {
    console.error("Error fetching sent connection requests:", error);
    res.status(400).send("Error fetching sent connection requests");
  }
});


userRouter.get("/user/feed", userAuth, async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page-1)*limit;

  try{
    const logedInUser = req.user;
    if(!logedInUser){
      return res.status(400).send("User not authenticated");
    }
    /*whome to show
    1. all users who are not connected with the logged in user 
    //whome to hide
    3. hide all rejected users by logged in user
    4. shouldn't show his own card
    5. hide all ignored users by logged in users
    6. hide all who are already connected or accepted
    7. hide all who requested the user*/

    const allConnections = await ConnectionRequest.find({ // Finding all connections with ignored, rejected, accepted and interested status
      $or:[
        {fromUserId : logedInUser._id},
        {toUserId : logedInUser._id}
      ]
    }).select("fromUserId toUserId")

    //console.log(allConnections);
    

    const hideAllConnectionStatusUsers = new Set()

    allConnections.forEach(connection =>{
      hideAllConnectionStatusUsers.add(connection.fromUserId.toString());
      hideAllConnectionStatusUsers.add(connection.toUserId.toString());
    })
    
    //console.log(hideAllConnectionStatusUsers);

    const userToShow = await User.find({ // hiding all users from connection table and own userIdis this manada - Saikat
      $and: [
        {_id: {$nin: Array.from(hideAllConnectionStatusUsers)}},
        {_id: {$ne: logedInUser._id}}
      ]
    }).select(USER_SAVED_DATA).skip(skip).limit(limit); //skip and limit are two functions given by mongoDb to handel pagination cases
    
    res.send(userToShow);

  }catch(error){
    console.error("Error fetching user feed:", error);
    res.status(400).send("Error fetching user feed");
  }

})

module.exports = userRouter;
