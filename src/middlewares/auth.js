const jwt = require('jsonwebtoken');
const  User  = require('../models/user');

const adminAuth = (req, res, next) => {
    //const token = req.headers['authorization']; //get the token from the request headers.
    console.log("Admin auth is getting checked...");
    
    const token = "valid-token";
    if (token === 'valid-token') { //check if the token is valid.
        next(); //if the token is valid, pass control to the next middleware function.
    } else {
        res.status(401).send('Unauthorized Request for Admin'); //if the token is not valid, send a 401 Unauthorized response.
    }
    // Here you can add logic to check if the user is authenticated
}

const userAuth = async (req, res, next) => {
    //const token = req.headers['authorization']; //get the token from the request headers.
    /*{console.log("User auth is getting checked...");
    
    const token = "valid-token";
    if (token === 'valid-token') { //check if the token is valid.
        next(); //if the token is valid, pass control to the next middleware function.
    } else {
        res.status(401).send('Unauthorized Request for User'); //if the token is not valid, send a 401 Unauthorized response.
    }}*/
    // Here you can add logic to check if the user is authenticated
    try{
    const {token} = req.cookies;
    if (!token) {
        return res.status(403).send('Unauthorized Request for User: No token provided'); //if no token is provided, send a 401 Unauthorized response.
    }
    console.log("User auth is getting checked...");
    const decodedToken = jwt.verify(token, "Dena@123");

    const user = await User.findById(decodedToken._id);
    if(!user){
        return res.status (401).send('Unauthorized Request for User');  
    }
    console.log("User found:", user.email);
    req.user = user;
    next(); //if the token is valid, pass control to the next middleware function.
    }catch(error) {
        console.error("Error in userAuth middleware:", error);
        res.status(401).send('Unauthorized Request for User:'+ error.message); //if the token is not valid, send a 401 Unauthorized response.
    }
}

const forgetPasswordAuth = async (req, res, next) => {
    try{
    const {email, firstName, lastName} = req.body;

    if (!email || !firstName || !lastName) { //check if the required fields are present in the request body.
        return res.status(400).send('Bad Request: Missing required fields for password reset');
    }
    const user = await User.findOne({email, firstName, lastName}); //find the user by email, first name and last name.
    if (!user) {
        return res.status(404).send('User not found'); //if the user is not found, send a 404 Not Found response.
    }
    console.log("User found for password reset:", user.email);
    req.user = user; //attach the user to the request object.
    next();} //if the user is authenticated, pass control to the next middleware function.
    catch(error) {
        console.error("Error in passportAuth middleware:", error);
        res.status(401).send('Unauthorized Request for Passport Auth:'+ error.message); //if the user is not authenticated, send a 401 Unauthorized response.
    }
}


module.exports = {
    adminAuth,
    userAuth,
    forgetPasswordAuth
};