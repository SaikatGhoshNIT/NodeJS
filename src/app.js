const express = require('express');
const app = express();

port = 7777;

//!Order of middleware (routes) matters the most.
//! Middleware functions are executed in the order they are defined.

// Handle authentication middleware for simplify the code.
app.use("/admin", (req, res, next) => {
    //const token = req.headers['authorization']; //get the token from the request headers.
    console.log("Admin auth is getting checked...");
    
    const token = "xyz";
    if (token === 'valid-token') { //check if the token is valid.
        next(); //if the token is valid, pass control to the next middleware function.
    } else {
        res.status(401).send('Unauthorized'); //if the token is not valid, send a 401 Unauthorized response.
    }
    // Here you can add logic to check if the user is authenticated
});

// Handle admin routes
app.get("/admin/getAllData", (req, res) => {
    res.send('Hello from Admin');
});

app.delete("/admin/deleteData", (req, res) => {
    res.send('Hello from Admin DELETE');
});





app.use('/express', (req, res, next) => { //multiple middleware functions can be used for a single route.
    console.log('Middleware for /express route');
    next(); //next is a function that passes control to the next middleware function.
}, [(req, res,next) => {
    res.send('Hello from /express route');
    next();
},
(req, res) => {
    console.log('This will not be executed because the response has already been sent.');
}]
);

app.get("/user", (req, res) => { //get is a method to handle GET requests.
    //res.send(`Hello from API GETAPI_ID ${req.query}`);
    console.log(req.query); //params is an object that contains the route parameters.
    //res.send(`Hello from API GET with id ${req.params.id}`);
});

app.use("/api", (req, res) => { //use is a method to handle all HTTP methods.
    res.send('Hello from API');
});

app.get("/getapi", (req, res) => { //get is a method to handle GET requests.
    res.send('Hello from API GET');
});


app.post("/postapi", (req, res) => { //post is a method to handle POST requests.
    //We can write logic here to POST data to the server.
    res.send('Hello from API POST');
});

app.use("/",(req, res)=>{
    res.send('Hello World');
}) // if the first middleware ("/") matches all routes, including /api, so the /api handler will never reached.


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});