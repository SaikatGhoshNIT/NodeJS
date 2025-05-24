const { mongoose } = require("mongoose");

async function connectToDatabase() {
    try{
        await mongoose.connect('mongodb+srv://saikatghosh5434:D9fZzMlPFbQhgX2I@namastenodejs.ygizgc3.mongodb.net/devTinder');
        console.log('Connected to DB Successfully');
    }
    catch(error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = {connectToDatabase};