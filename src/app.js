const express = require('express');
const app = express();

const {adminAuth, userAuth} = require('./middlewares/auth'); // Import the adminAuth middleware
//const {userAuth} = require('./middlewares/auth'); // Import the userAuth middleware

port = 7777;

//!Order of middleware (routes) matters the most.
//! Middleware functions are executed in the order they are defined.

//! Error handling middleware
app.get('/getUserData', (req, res) => {
    try {
        //Simulating an error
       throw new Error('Something went wrong while fetching user data');
       res.send('Hello from User Data');
    }
    catch(err){
        res.status(500).send("There is an error in your code");
    }
})

app.use("/",(err, req, res, next) => {
    if(err){
        //Log the error
        res.status(500).send("Something went wrong in the server");
    }
    else{
        res.send('Hello World');    
    }
})

//! Handle authentication middleware for simplify the code.
app.use("/admin", adminAuth);

// Handle admin routes
app.get("/admin/getAllData", (req, res) => {
    res.send('Hello from Admin');
});

app.delete("/admin/deleteData", (req, res) => {
    res.send('Hello from Admin DELETE');
});


app.get("/user/data", userAuth, (req, res) => { //! if we dont's have any child routes, we can use the middleware directly in the route. Where userAuth will be executed before the route handler.
    res.send('Hello from User');
    //res.send(`Hello from API GETAPI_ID ${req.query}`);
    //console.log(req.query); //params is an object that contains the route parameters.
    //res.send(`Hello from API GET with id ${req.params.id}`);
});

//! multiple middleware functions can be used for a single route.
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
/*
app.get("/user", (req, res) => {
    res.send('Hello from User');
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
*/

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});