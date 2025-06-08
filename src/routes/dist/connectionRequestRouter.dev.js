"use strict";

var express = require("express");

var connectionRequestRouter = express.Router();

var _require = require("../middlewares/auth"),
    userAuth = _require.userAuth;

var ConnectionRequest = require("../models/connectionRequest"); // Import the ConnectionRequest model


var User = require("../models/user"); // Import the User model


connectionRequestRouter.post("/request/send/:status/:toUserID", userAuth, function _callee(req, res) {
  var _req$params, status, toUserID, fromUserId, validStatus, toUser, existingRequest, connectionRequest, data;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$params = req.params, status = _req$params.status, toUserID = _req$params.toUserID;
          fromUserId = req.user._id; // Get the authenticated user's ID from the request object
          // Validate the status

          validStatus = ["ignored", "interested"];

          if (validStatus.includes(status)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.send(400).json({
            error: "Invalid status. Status must be either 'ignored' or 'interested'."
          }));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(User.findById(toUserID));

        case 8:
          toUser = _context.sent;

          if (toUser) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "User with the specified ID does not exist."
          }));

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(ConnectionRequest.findOne({
            $or: [{
              fromUserId: fromUserId,
              toUserId: toUserID
            }, {
              fromUserId: toUserID,
              toUserId: fromUserId
            }]
          }));

        case 13:
          existingRequest = _context.sent;

          if (!existingRequest) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Connection request already exists between these users."
          }));

        case 16:
          if (!(fromUserId.toString() === toUserID.toString())) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "You cannot send a connection request to yourself."
          }));

        case 18:
          // Create a new connection request
          connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserID,
            status: status // Set the status to 'ignored' or 'interested'

          }); // Save the connection request to the database

          _context.next = 21;
          return regeneratorRuntime.awrap(connectionRequest.save());

        case 21:
          data = _context.sent;
          res.status(201).json({
            message: "Connection request sent successfully with status '".concat(status, "'."),
            data: data
          });
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](0);
          console.error("Error sending connection request:", _context.t0);
          res.status(500).send("Error sending connection request: " + _context.t0.message);

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 25]]);
});
connectionRequestRouter.patch("/request/update/:status/:requestId", userAuth, function _callee2(req, res) {
  var _req$params2, status, requestId, loginUserId, validStatus, isValidStatus, connectionRequest, data;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$params2 = req.params, status = _req$params2.status, requestId = _req$params2.requestId;
          loginUserId = req.user._id; // Validate the requestId and status

          if (!(!requestId || !status)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Request ID and status are required."
          }));

        case 5:
          // Validate the status
          validStatus = ["accepted", "rejected"];
          isValidStatus = validStatus.includes(status);

          if (isValidStatus) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Invalid status. Status must be either 'accepted' or 'rejected'."
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(ConnectionRequest.findOne({
            _id: requestId,
            // Ensure the request ID is valid
            toUserId: loginUserId,
            // Ensure the request belongs to the logged-in user
            status: "interested" // Ensure the request is in 'interested' status only if connection request is already accepted or rejected, then it will not allow again.

          }));

        case 11:
          connectionRequest = _context2.sent;

          if (connectionRequest) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: "Connection request not found or not in 'interested' status."
          }));

        case 14:
          // Check status to ensure it can only be updated once

          /*if (connectionRequest.status === "accepted" || connectionRequest.status === "rejected") {
            return res.status(400).json({
              error: `Connection request has already been ${connectionRequest.status}.`
            });
          }*/
          // Update the connection request status
          connectionRequest.status = status; // Set the new status

          connectionRequest.updatedAt = Date.now(); // Update the timestamp

          _context2.next = 18;
          return regeneratorRuntime.awrap(connectionRequest.save());

        case 18:
          data = _context2.sent;
          res.status(200).json({
            message: "Connection request updated successfully to '".concat(status, "'."),
            data: data
          });
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](0);
          console.error("Error updating connection request:", _context2.t0);
          res.status(500).send("Error updating connection request: " + _context2.t0.message);

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 22]]);
});
module.exports = connectionRequestRouter; // Export the connection request router