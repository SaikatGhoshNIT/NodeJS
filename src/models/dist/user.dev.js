"use strict";

var mongoose = require('mongoose');

var validator = require('validator');

var jwt = require('jsonwebtoken'); // Import validator for validation (NPM package)


var bcrypt = require('bcryptjs'); // Import bcrypt for password hashing (NPM package)


var Schema = mongoose.Schema;
var userSchema = new Schema({
  firstName: String,
  // String is shorthand for {type: String}
  lastName: String,
  email: {
    // Email is a required field and must be unique
    type: String,
    required: true,
    index: true,
    // Create an index for faster lookups
    unique: true,
    trim: true,
    // Validate email format
    validate: function validate(value) {
      /*const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(value)) {
          throw new Error("Invalid email format");
      }*/
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email format");
      }
    }
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: function validate(value) {
      if (!validator.isStrongPassword(value, {
        minLength: 6
      })) {
        throw new Error("Password must be at least 6 characters long");
      }
    }
  },
  age: {
    type: Number,
    min: 1,
    max: 80,
    validate: function validate(value) {
      if (value <= 0 || value > 80) {
        throw new Error("Age must be between 1 and 80");
      }
    }
  },
  gender: {
    type: String,
    "enum": {
      values: ['male', 'female', 'other', 'prefer not to say', "Male", "Female", "Other", "Prefer not to say"],
      message: '{VALUE} is not a valid status'
    },
    "default": 'prefer not to say'
    /*validate(value){
        if(!["male", "female"].includes(value.toLowerCase())) {
            throw new Error ("Gender must be either Male or Female")
        }
    }*/

  },
  skills: {
    type: [String],
    validate: function validate(value) {
      if (value.length > 5) {
        throw new Error("Skills cannot be more than 5");
      }
    }
  },
  mobile: {
    type: String,
    validate: function validate(value) {
      if (!validator.isMobilePhone(value, 'any', {
        strictMode: false
      })) {
        throw new Error("Invalid mobile number format");
      }
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields

});

userSchema.methods.getJwtToken = function _callee() {
  var user, token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = this; // 'this' refers to the instance of the user document and arrow function don't have their own 'this'

          token = jwt.sign({
            _id: this._id
          }, "Dena@123", {
            expiresIn: "1h"
          });
          return _context.abrupt("return", token);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
};

userSchema.methods.comparePassword = function _callee2(password) {
  var user, isMatch;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user = this; // 'this' refers to the instance of the user document

          _context2.next = 3;
          return regeneratorRuntime.awrap(bcrypt.compare(password, this.password));

        case 3:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 6;
            break;
          }

          throw new Error("Invalid password");

        case 6:
          return _context2.abrupt("return", isMatch);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
};

userSchema.index({
  email: 1,
  firstName: 1,
  lastName: 1
}); // Create a compound index for email, firstName, and lastName

module.exports = mongoose.model("User", userSchema);