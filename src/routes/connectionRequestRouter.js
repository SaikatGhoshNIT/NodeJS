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
            fromUserId : fromUserId,
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

connectionRequestRouter.patch("/request/update/:status/:requestId", userAuth, async (req,res) =>{
  try{
    const { status, requestId } = req.params;
    
    const loginUserId = req.user._id;

    // Validate the requestId and status
    if(!requestId || !status){
      return res.status(400).json({ error: "Request ID and status are required." });
    }

    // Validate the status
    const validStatus = ["accepted", "rejected"];
    const isValidStatus = validStatus.includes(status);
    if (!isValidStatus){
      return res.status(400).json({
        error: "Invalid status. Status must be either 'accepted' or 'rejected'."
      })
    }

    //Check if the requestID is valid
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,// Ensure the request ID is valid
      toUserId: loginUserId, // Ensure the request belongs to the logged-in user
      status: "interested" // Ensure the request is in 'interested' status only if connection request is already accepted or rejected, then it will not allow again.
    })

    if(!connectionRequest){
      return res.status(404).json({ error: "Connection request not found or not in 'interested' status." });
    }

    // Check status to ensure it can only be updated once
    /*if (connectionRequest.status === "accepted" || connectionRequest.status === "rejected") {
      return res.status(400).json({
        error: `Connection request has already been ${connectionRequest.status}.`
      });
    }*/
    

    // Update the connection request status
    connectionRequest.status = status; // Set the new status
    connectionRequest.updatedAt = Date.now(); // Update the timestamp
    const data = await connectionRequest.save();
    res.status(200).json({
      message: `Connection request updated successfully to '${status}'.`,
      data
    });
  }
  catch(error){
    console.error("Error updating connection request:", error);
    res.status(500).send("Error updating connection request: " + error.message);
  }
})

module.exports = connectionRequestRouter; // Export the connection request router
