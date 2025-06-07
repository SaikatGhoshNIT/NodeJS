"use strict";

var jwt = require('jsonwebtoken');

var User = require('../models/user');

var adminAuth = function adminAuth(req, res, next) {
  //const token = req.headers['authorization']; //get the token from the request headers.
  console.log("Admin auth is getting checked...");
  var token = "valid-token";

  if (token === 'valid-token') {
    //check if the token is valid.
    next(); //if the token is valid, pass control to the next middleware function.
  } else {
    res.status(401).send('Unauthorized Request for Admin'); //if the token is not valid, send a 401 Unauthorized response.
  } // Here you can add logic to check if the user is authenticated

};

var userAuth = function userAuth(req, res, next) {
  var token, decodedToken, user;
  return regeneratorRuntime.async(function userAuth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.cookies.token;
          console.log("User auth is getting checked...");
          decodedToken = jwt.verify(token, "Dena@123");
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findById(decodedToken._id));

        case 6:
          user = _context.sent;

          if (user) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(401).send('Unauthorized Request for User'));

        case 9:
          console.log("User found:", user.email);
          req.user = user;
          next(); //if the token is valid, pass control to the next middleware function.

          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error("Error in userAuth middleware:", _context.t0);
          res.status(401).send('Unauthorized Request for User:' + _context.t0.message); //if the token is not valid, send a 401 Unauthorized response.

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var forgetPasswordAuth = function forgetPasswordAuth(req, res, next) {
  var _req$body, email, firstName, lastName, user;

  return regeneratorRuntime.async(function forgetPasswordAuth$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, email = _req$body.email, firstName = _req$body.firstName, lastName = _req$body.lastName;

          if (!(!email || !firstName || !lastName)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).send('Bad Request: Missing required fields for password reset'));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email,
            firstName: firstName,
            lastName: lastName
          }));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).send('User not found'));

        case 9:
          console.log("User found for password reset:", user.email);
          req.user = user; //attach the user to the request object.

          next();
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          console.error("Error in passportAuth middleware:", _context2.t0);
          res.status(401).send('Unauthorized Request for Passport Auth:' + _context2.t0.message); //if the user is not authenticated, send a 401 Unauthorized response.

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

module.exports = {
  adminAuth: adminAuth,
  userAuth: userAuth,
  forgetPasswordAuth: forgetPasswordAuth
};