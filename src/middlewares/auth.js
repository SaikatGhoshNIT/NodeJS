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

const userAuth = (req, res, next) => {
    //const token = req.headers['authorization']; //get the token from the request headers.
    console.log("User auth is getting checked...");
    
    const token = "valid-token";
    if (token === 'valid-token') { //check if the token is valid.
        next(); //if the token is valid, pass control to the next middleware function.
    } else {
        res.status(401).send('Unauthorized Request for User'); //if the token is not valid, send a 401 Unauthorized response.
    }
    // Here you can add logic to check if the user is authenticated
}

module.exports = {
    adminAuth,
    userAuth
};