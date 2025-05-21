const express = require('express');
const app = express();

port = 7777;

//!Order of middleware (routes) matters

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
}) // if the first middleware ("/") matches all routes, including /api, so the /api handler is never reached.


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});