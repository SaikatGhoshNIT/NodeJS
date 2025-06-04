const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth"); // Import the userAuth middleware



// Profile route
profileRouter.get("/profile",userAuth, async (req, res) => {
  const {firstName, lastName, email, age, skills, gender} = req.user; // Get user data from the request object
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
    try{res.status(200).send({
      firstName,
      lastName,
      email,
      gender,
      age,
      skills}); // Send the user profile data
  }catch (error) {
    console.error("Error verifying token:", error);
    return res.status(400).send("Invalid token"+ error.message);
  }
});

module.exports = profileRouter; // Export the profile router