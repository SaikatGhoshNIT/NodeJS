"use strict";

var express = require('express');

var userRouter = express.Router();

var _require = require('../middlewares/auth'),
    userAuth = _require.userAuth;

var ConnectionRequest = require('../models/connectionRequest'); // Get all the pending connection requests for the logged in user


userRouter.get('/user/requests/recived', userAuth, function _callee(req, res) {
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
            status: 'interested'
          }).populate('fromUserId', ["firstName", "lastName", "age", "gender", "skills"]));

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

userRouter.get('/user/requests/sent', userAuth, function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {} catch (error) {
            console.error("Error fetching sent connection requests:", error);
            res.status(400).send("Error fetching sent connection requests");
          }

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = userRouter;