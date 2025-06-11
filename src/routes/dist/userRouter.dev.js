"use strict";

var express = require("express");

var userRouter = express.Router();

var _require = require("../middlewares/auth"),
    userAuth = _require.userAuth;

var ConnectionRequest = require("../models/connectionRequest");

var User = require("../models/user");

var USER_SAVED_DATA = "firstName lastName age gender skills"; // Get all the pending connection requests for the logged in user

userRouter.get("/user/requests/recived", userAuth, function _callee(req, res) {
  var logedInUserId, allConnectRequest;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          logedInUserId = req.user._id;

          if (logedInUserId) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).send("User not authenticated"));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(ConnectionRequest.find({
            toUserId: logedInUserId,
            status: "interested"
          }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills"]));

        case 6:
          allConnectRequest = _context.sent;

          if (!(!allConnectRequest || allConnectRequest.length === 0)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).send("No connection requests found"));

        case 9:
          res.status(200).json({
            message: "Connection requests fetched successfully",
            connectionRequests: allConnectRequest
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching connection requests:", _context.t0);
          res.status(400).send("Error fetching connection requests");

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // Get all the sent connection update requests by the logged in user

userRouter.get("/user/requests/connections", userAuth, function _callee2(req, res) {
  var logedInUser, connections, data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          logedInUser = req.user;

          if (logedInUser) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("User not authenticated"));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(ConnectionRequest.find({
            $and: [{
              $or: [{
                fromUserId: logedInUser._id
              }, {
                toUserId: logedInUser._id
              }]
            }, {
              status: "accepted"
            }]
          }).populate("fromUserId", USER_SAVED_DATA).populate("toUserId", USER_SAVED_DATA));

        case 6:
          connections = _context2.sent;

          if (!(!connections || connections.length === 0)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).send("No connections found"));

        case 9:
          data = connections.map(function (connection) {
            if (connection.fromUserId._id.toString() === logedInUser._id.toString()) {
              return connection.toUserId; // Return the toUserId data if the logged in user is the fromUserId
            } else {
              return connection.fromUserId; //else Return the fromUserId data if the logged in user is the toUserId
            }
          }); // sent only the fromUserId data

          res.status(200).json({
            message: "Connections fetched successfully",
            connections: data
          });
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching sent connection requests:", _context2.t0);
          res.status(400).send("Error fetching sent connection requests");

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
userRouter.get("/user/feed", userAuth, function _callee3(req, res) {
  var page, limit, skip, logedInUser, allConnections, hideAllConnectionStatusUsers, userToShow;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          limit = limit > 50 ? 50 : limit;
          skip = (page - 1) * limit;
          _context3.prev = 4;
          logedInUser = req.user;

          if (logedInUser) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(400).send("User not authenticated"));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(ConnectionRequest.find({
            // Finding all connections with ignored, rejected, accepted and interested status
            $or: [{
              fromUserId: logedInUser._id
            }, {
              toUserId: logedInUser._id
            }]
          }).select("fromUserId toUserId"));

        case 10:
          allConnections = _context3.sent;
          //console.log(allConnections);
          hideAllConnectionStatusUsers = new Set();
          allConnections.forEach(function (connection) {
            hideAllConnectionStatusUsers.add(connection.fromUserId.toString());
            hideAllConnectionStatusUsers.add(connection.toUserId.toString());
          }); //console.log(hideAllConnectionStatusUsers);

          _context3.next = 15;
          return regeneratorRuntime.awrap(User.find({
            // hiding all users from connection table and own userIdis this manada - Saikat
            $and: [{
              _id: {
                $nin: Array.from(hideAllConnectionStatusUsers)
              }
            }, {
              _id: {
                $ne: logedInUser._id
              }
            }]
          }).select(USER_SAVED_DATA).skip(skip).limit(limit));

        case 15:
          userToShow = _context3.sent;
          //skip and limit are two functions given by mongoDb to handel pagination cases
          res.send(userToShow);
          _context3.next = 23;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](4);
          console.error("Error fetching user feed:", _context3.t0);
          res.status(400).send("Error fetching user feed");

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 19]]);
});
module.exports = userRouter;