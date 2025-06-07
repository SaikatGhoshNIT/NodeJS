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
            message: "Connection request sent successfully.",
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
module.exports = connectionRequestRouter; // Export the connection request router