const express = require('express');
const authRouter = express.Router();
const { signupValidation} = require("../utils/validate.js") // Import the validation function
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const User = require("../models/user.js");
const { userAuth } = require("../middlewares/auth.js"); // Import the userAuth middleware  
const { RunCommandCursor } = require('mongodb');


authRouter.post("/signUp", async (req, res) => {
  /*user.save().then((user) => {
        console.log('User saved successfully:', user);
        res.send('User signed up successfully');
    }).catch((error) => {
        console.error('Error saving user:', error);
        res.status(400).send('Error signing up user');
    });*/
  try {
    //! Validate the user data before saving
    signupValidation(req.body);

    //! Encrypt the password before saving
    const hashPassword = await bcrypt.hash(req.body.password, 8);
    
    const { firstName, lastName, email, age, gender, skills } = req.body; // Destructure the required fields from the request body

    const user = new User(
      ({ firstName, lastName, email, password: hashPassword, age, gender, skills }) 
    ); // Create a new user object from the request body
    
    //user.password = hashPassword; // Set the hashed password
    const existingUser = await User.find({ email: user.email }); // Check if a user with the same email already exists
    if (existingUser.length > 0) {
      throw new Error("User with this email already exists");
    }
    // Save the user to the database
    await user.save();
    console.log("User saved successfully:", user);
    res.send("User signed up successfully");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).send("Error signing up user: " + error.message);
  }
});

//Login route
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body; // Destructure the required fields from the request body

  try {
    
    const user = await User.findOne({ email: email });
    if(!user){
        return res.status(404).send("User not found");
    }

    /*const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch) {
        return res.status(401).send("Invalid credentials");
    }*/
    await user.comparePassword(password); // Use the method defined in the user schema to compare the password
    //! Generate a token and set it in a cookie
    //const token = jwt.sign({ _id: user._id }, "Dena@123", { expiresIn: "1h" }); //hiding the user ID in the token, expires in 1 hour
    const token = await user.getJwtToken(); // Use the method defined in the user schema to get the token
    res.cookie("token", token, {maxAge:3600000, httpOnly: true}); // Set a cookie with the user ID, expires in 1 hour
    res.status(200).send(`User ${user.firstName} logged in successfully`); // Send a success response

    }catch (error) { 
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user: " + error.message);
  };

});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.clearCookie("token"); // Clear the cookie
    res.status(200).send("User logged out successfully");
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).send("Error logging out user: " + error.message);
  }
});

module.exports = authRouter;