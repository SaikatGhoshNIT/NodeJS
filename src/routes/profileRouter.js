const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth"); // Import the userAuth middleware
const {updateValidation} = require("../utils/validate.js"); // Import the update validation function
const {passwordValidator} = require("../utils/validate.js"); // Import the password validation function
const {forgetPasswordAuth} = require("../middlewares/auth"); // Import the forgetPasswordAuth middleware
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing




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

profileRouter.patch("/profile/update", userAuth, async(req, res)=>{
  try{
    if(!updateValidation(req.body)) {
      throw new Error("Invalid update fields");
    }
    const userExistingData = req.user; // Get the existing user data from userAuth middleware
    const dataToUpdate = req.body; // Get the data to update from the request body
 

    Object.keys(dataToUpdate).forEach((key)=>{
      userExistingData[key] = dataToUpdate[key]; // Update the existing user data with the new data
    })
    
    /*const updatedUser = await User.findByIdAndUpdate(   //!we can also use findByIdAndUpdate to update the user data too
      userExistingData._id,
      dataToUpdate,
      { new: true, runValidators: true } // <-- runValidators here
    );
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }*/
    
    // Save the updated user data   
    await userExistingData.save(); // Save the updated user data to the database
    res.json({
      message: "User data updated successfully",
      user: userExistingData
  });
      
    res.status(200)

  }
  catch(error) {
    return res.status(400).send("Invalid update fields: " + error.message);
  }
})

profileRouter.delete("/profile/delete", userAuth, async(req, res)=>{
  try{
    const user = req.user; // Get the user data from the request object
    await user.remove(); // Remove the user from the database
    res.status(200).send("User deleted successfully");
  }catch(error) {
    return res.status(400).send("Error deleting user: " + error.message);
  }
})

profileRouter.patch(("/profile/change-password"), userAuth, async(req, res)=>{
  try{
    const currentPassword = req.user?.password; // Get the current password from the user data
    const newPassword = req.body.password;
    passwordValidator(newPassword); // Validate the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8); // Hash the new password
    console.log("Hashed Password:", hashedPassword);
    const isMatch = await bcrypt.compare(hashedPassword, currentPassword);
    console.log("Password match:", isMatch);
    if(isMatch){
      return res.status(400).send("New password cannot be the same as the current password");
    }
    req.user.password = hashedPassword; // Update the user's password with the new hashed password
    //!currentPassword is not a variable you can assign to—it's just a local variable holding the value of req.user.password. Assigning to it does not update the user's password in the database or in the user object.
    console.log("Updated Password:", req.user.password);
    await req.user.save(); // Save the updated user data to the database
    console.log("Password changed successfully");
    res.status(200).send("Password changed successfully");  
  }
  catch(error) {
    return res.status(400).send("Error changing password: " + error.message);
  } 
})

profileRouter.patch("/profile/forget-password", forgetPasswordAuth, async(req, res)=>{
  try{
    const user = req.user; // Get the user data from the request object
    const newPassword = req.body.password; // Get the new password from the request body
    passwordValidator(newPassword); // Validate the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8); // Hash the new password
    req.user.password = hashedPassword; // Update the user's password with the new hashed password
    console.log("Hashed Password:", hashedPassword);
    console.log("Updated Password:",  req.user.password);
    await user.save(); // Save the updated user data to the database
    res.status(200).send("Password reset successfully");
  }catch(error) {
    return res.status(400).send("Error resetting password: " + error.message);
  }
})

module.exports = profileRouter; // Export the profile router