"use strict";

var express = require('express');

var profileRouter = express.Router();

var _require = require("../middlewares/auth"),
    userAuth = _require.userAuth; // Import the userAuth middleware


var _require2 = require("../utils/validate.js"),
    updateValidation = _require2.updateValidation; // Import the update validation function
// Profile route


profileRouter.get("/profile", userAuth, function _callee(req, res) {
  var _req$user, firstName, lastName, email, age, skills, gender;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$user = req.user, firstName = _req$user.firstName, lastName = _req$user.lastName, email = _req$user.email, age = _req$user.age, skills = _req$user.skills, gender = _req$user.gender; // Get user data from the request object

          /*const token = req.cookies.token; // Get cookies from the request
          if (!token) {
            return res.status(401).send("Access denied. No token provided.");
          }
          try{
            // Verify the token
            const decoded = jwt.verify(token, "Dena@123"); // Use the same secret used to sign the token
            const user = await User.findById(decoded._id); // Find the user by ID from the token
            if (!user) {
              return res.status(404).send("User not found");
            }*/

          _context.prev = 1;
          res.status(200).send({
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
            age: age,
            skills: skills
          }); // Send the user profile data

          _context.next = 9;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](1);
          console.error("Error verifying token:", _context.t0);
          return _context.abrupt("return", res.status(400).send("Invalid token" + _context.t0.message));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 5]]);
});
profileRouter.patch("/profile/update", userAuth, function _callee2(req, res) {
  var userExistingData, dataToUpdate;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (updateValidation(req.body)) {
            _context2.next = 3;
            break;
          }

          throw new Error("Invalid update fields");

        case 3:
          userExistingData = req.user; // Get the existing user data from userAuth middleware

          dataToUpdate = req.body; // Get the data to update from the request body

          Object.keys(dataToUpdate).forEach(function (key) {
            userExistingData[key] = dataToUpdate[key]; // Update the existing user data with the new data
          });
          /*const updatedUser = await User.findByIdAndUpdate(   //!we can also use findByIdAndUpdate to update the user data too
            userExistingData._id,
            dataToUpdate,
            { new: true, runValidators: true } // <-- runValidators here
          );
          if (!updatedUser) {
            return res.status(404).send("User not found");
          }*/
          // Save the updated user data   

          _context2.next = 8;
          return regeneratorRuntime.awrap(userExistingData.save());

        case 8:
          // Save the updated user data to the database
          res.json({
            message: "User data updated successfully",
            user: userExistingData
          });
          res.status(200);
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(400).send("Invalid update fields: " + _context2.t0.message));

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
profileRouter["delete"]("/profile/delete", userAuth, function _callee3(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          user = req.user; // Get the user data from the request object

          _context3.next = 4;
          return regeneratorRuntime.awrap(user.remove());

        case 4:
          // Remove the user from the database
          res.status(200).send("User deleted successfully");
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(400).send("Error deleting user: " + _context3.t0.message));

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
profileRouter.patch("/profile/change-password", userAuth, function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
        case "end":
          return _context4.stop();
      }
    }
  });
});
module.exports = profileRouter; // Export the profile router