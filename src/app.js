const express = require('express');
const app = express();

port = 7777;

app.use("/api", (req, res) => {
    res.send('Hello from API');
});

app.use("/",(req, res)=>{
    res.send('Hello World');
}) // if the first middleware ("/") matches all routes, including /api, so the /api handler is never reached.


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});