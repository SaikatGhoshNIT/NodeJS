const express = require("express");
const app = express();
const { connectToDatabase } = require("./db.js");
const { signupValidation } = require("./utils/validate.js"); // Import the validation function
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const cookieParser = require("cookie-parser"); // Import cookie-parser to handle cookies
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation and verification
const {userAuth} = require("./middlewares/auth.js"); // Import the userAuth middleware
const User = require("./models/user.js");

//const {adminAuth, userAuth} = require('./middlewares/auth'); // Import the adminAuth middleware
//const {userAuth} = require('./middlewares/auth'); // Import the userAuth middleware

port = 7777;

app.use(express.json()); // Middleware to parse JSON bodies given by Express.
app.use(cookieParser()); // Middleware to parse cookies

// Middleware to parse JSON bodies
app.post("/signUp", async (req, res) => {
  /*user.save().then((user) => {
        console.log('User saved successfully:', user);
        res.send('User signed up successfully');
    }).catch((error) => {
        console.error('Error saving user:', error);
        res.status(400).send('Error signing up user');
    });*/
  try {
    //! Validate the user data before saving
    signupValidation(req.body);

    //! Encrypt the password before saving
    const hashPassword = await bcrypt.hash(req.body.password, 8);
    
    const { firstName, lastName, email } = req.body; // Destructure the required fields from the request body

    const user = new User(
      ({ firstName, lastName, email, password: hashPassword }) 
    ); // Create a new user object from the request body
    
    //user.password = hashPassword; // Set the hashed password
    const existingUser = await User.find({ email: user.email });
    if (existingUser.length > 0) {
      throw new Error("User with this email already exists");
    }
    // Save the user to the database
    await user.save();
    console.log("User saved successfully:", user);
    res.send("User signed up successfully");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).send("Error signing up user: " + error.message);
  }
});

//Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Destructure the required fields from the request body

  try {
    
    const user = await User.findOne({ email: email });
    if(!user){
        return res.status(404).send("User not found");
    }

    /*const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch) {
        return res.status(401).send("Invalid credentials");
    }*/
    await user.comparePassword(password); // Use the method defined in the user schema to compare the password
    //! Generate a token and set it in a cookie
    //const token = jwt.sign({ _id: user._id }, "Dena@123", { expiresIn: "1h" }); //hiding the user ID in the token, expires in 1 hour
    const token = await user.getJwtToken(); // Use the method defined in the user schema to get the token
    res.cookie("token", token, {maxAge:3600000, httpOnly: true}); // Set a cookie with the user ID, expires in 1 hour
    res.status(200).send(`User ${user.firstName} logged in successfully`); // Send a success response

    }catch (error) { 
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user: " + error.message);
  };

});

// Profile route
app.get("/profile",userAuth, async (req, res) => {
  const {firstName, lastName, email, age, skills} = req.user; // Get user data from the request object
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
      age,
      skills}); // Send the user profile data
  }catch (error) {
    console.error("Error verifying token:", error);
    return res.status(400).send("Invalid token"+ error.message);
  }
});

connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
/*const connectToDB = async ()=>{
  try{await connectToDatabase();
  console.log("Connected to MongoDB"); 
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}catch(error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDB();


// Get user data
app.get("/userdata", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const userdata = await User.find({ email: userEmail });
    if (userdata.length > 0) {
      return res.send(userdata);
    }
    res.status(404).send("User not found");
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

app.get("/feed", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const userdata = await User.find({ email: userEmail });
    if (userdata.length > 0) {
      return  res.send(userdata);
    }
    res.status(404).send("User not found");
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

app.delete("/deleteUser", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const result = await User.findOneAndDelete({ email: userEmail });
    if (result.length === 0) {
      return res.status(404).send("User not found");
    }
    console.log(result);
    res.send(`User with email ${userEmail} deleted successfully`);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(400).send("Error deleting user");
  }
});

app.patch("/updateUser/:id", async (req, res) => {
  //const userEmail = req.body.email;
  const userid = req.params?.id; //We should use req.params to get the route parameters, and UserID should not get updated in the request body, it should be passed as a route parameter.
  const data = req.body;

  try {
    //! Validate the update fields
    const allowedUpdates = [
      "password",
      "age",
      "skills",
      "firstName",
      "lastName",
      "gender",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) => {
      return allowedUpdates.includes(key);
    });

    console.log(isUpdateAllowed);

    if (!isUpdateAllowed) {
      //return res.status(400).send('Invalid update fields');
      throw new Error("Invalid update fields");
    }
    /*if(data.skills.length > 5) {
        throw new Error('Skills cannot be more than 5');
    }*/
    //await User.findByIdAndUpdate({_id : userid},{email : userEmail}, {runValidators: true}); // runValidators: true will ensure that the update operation will validate the data against the schema.
    /*await User.findByIdAndUpdate({ _id: userid }, data, {
      runValidators: true,
    });
    res.status(200).send(`User data updated successfully`);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).send("Error updating user" + error.message);
  }
});
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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
*/
