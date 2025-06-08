const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { populate } = require("../models/user");

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

module.exports = userRouter;
