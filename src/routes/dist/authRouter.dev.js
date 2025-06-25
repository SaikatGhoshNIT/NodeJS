"use strict";

var express = require('express');

var authRouter = express.Router();

var _require = require("../utils/validate.js"),
    signupValidation = _require.signupValidation; // Import the validation function


var bcrypt = require("bcrypt"); // Import bcrypt for password hashing


var User = require("../models/user.js");

var _require2 = require("../middlewares/auth.js"),
    userAuth = _require2.userAuth; // Import the userAuth middleware  


var _require3 = require('mongodb'),
    RunCommandCursor = _require3.RunCommandCursor;

authRouter.post("/signUp", function _callee(req, res) {
  var hashPassword, _req$body, firstName, lastName, email, age, gender, skills, user, existingUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          //! Validate the user data before saving
          signupValidation(req.body); //! Encrypt the password before saving

          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 8));

        case 4:
          hashPassword = _context.sent;
          _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, age = _req$body.age, gender = _req$body.gender, skills = _req$body.skills; // Destructure the required fields from the request body

          user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            age: age,
            gender: gender,
            skills: skills
          }); // Create a new user object from the request body
          //user.password = hashPassword; // Set the hashed password

          _context.next = 9;
          return regeneratorRuntime.awrap(User.find({
            email: user.email
          }));

        case 9:
          existingUser = _context.sent;

          if (!(existingUser.length > 0)) {
            _context.next = 12;
            break;
          }

          throw new Error("User with this email already exists");

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          console.log("User saved successfully:", user);
          res.send("User signed up successfully");
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error("Error saving user:", _context.t0);
          res.status(400).send("Error signing up user: " + _context.t0.message);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
}); //Login route

authRouter.post("/login", function _callee2(req, res) {
  var _req$body2, email, password, user, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; // Destructure the required fields from the request body

          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).send("User not found"));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(user.comparePassword(password));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(user.getJwtToken());

        case 11:
          token = _context2.sent;
          // Use the method defined in the user schema to get the token
          res.cookie("token", token, {
            maxAge: 3600000,
            httpOnly: true
          }); // Set a cookie with the user ID, expires in 1 hour

          res.status(200).json({
            // Send a success response
            message: "User logged in successfully",
            user: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              age: user.age,
              skills: user.skills
            }
          });
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](1);
          console.error("Error logging in user:", _context2.t0);
          res.status(500).send("Error logging in user: " + _context2.t0.message);

        case 20:
          ;

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 16]]);
});
authRouter.post("/logout", userAuth, function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          try {
            res.clearCookie("token"); // Clear the cookie

            res.status(200).send("User logged out successfully");
          } catch (error) {
            console.error("Error logging out user:", error);
            res.status(500).send("Error logging out user: " + error.message);
          }

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = authRouter;