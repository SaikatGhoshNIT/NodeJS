const express = require('express');
const connectionRequestRouter = express.Router();

connectionRequestRouter.post('/request', async (req, res) => {
    try{

    }catch (error) {
        console.error("Error sending connection request:", error);
        res.status(500).send("Error sending connection request: " + error.message);
    }
});

module.exports = connectionRequestRouter; // Export the connection request router