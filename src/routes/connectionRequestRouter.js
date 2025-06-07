const express = require("express");
const connectionRequestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest"); // Import the ConnectionRequest model
const User = require("../models/user"); // Import the User model

connectionRequestRouter.post(
  "/request/send/:status/:toUserID",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserID } = req.params;
      const fromUserId = req.user._id; // Get the authenticated user's ID from the request object

      // Validate the status
      const validStatus = ["ignored", "interested"];
      if (!validStatus.includes(status)) {
        return res.send(400).json({
          error:
            "Invalid status. Status must be either 'ignored' or 'interested'.",
        });
      }

      // Validate the toUserID
      const toUser = await User.findById(toUserID);
      if (!toUser) {
        return res.status(404).json({
          error: "User with the specified ID does not exist.",
        });
      }

      // Check if the connection request already exists
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId: toUserID,
          },
          {
            fromUserId: toUserID,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({
          error: "Connection request already exists between these users.",
        });
      }

      // Check if the user is trying to send a request to themselves
      if (fromUserId.toString() === toUserID.toString()) {
        return res.status(400).json({
          error: "You cannot send a connection request to yourself.",
        });
      }

      // Create a new connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId: toUserID,
        status: status, // Set the status to 'ignored' or 'interested'
      });
      // Save the connection request to the database
      const data = await connectionRequest.save();
      res.status(201).json({
        message: `Connection request sent successfully with status '${status}'.`,
        data: data,
      });
    } catch (error) {
      console.error("Error sending connection request:", error);
      res
        .status(500)
        .send("Error sending connection request: " + error.message);
    }
  }
);

module.exports = connectionRequestRouter; // Export the connection request router
