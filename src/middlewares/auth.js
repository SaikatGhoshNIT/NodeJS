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
    console.log("User auth is getting checked...");
    const decodedToken = jwt.verify(token, "Dena@123");

    const user = await User.findById(decodedToken._id);
    if(!user){
        return res.status (401).send('Unauthorized Request for User');  
    }
    console.log("User found:", user);
    req.user = user;
    next(); //if the token is valid, pass control to the next middleware function.
}catch(error) {
        console.error("Error in userAuth middleware:", error);
        res.status(401).send('Unauthorized Request for User:'+ error.message); //if the token is not valid, send a 401 Unauthorized response.
    }
}



module.exports = {
    adminAuth,
    userAuth
};