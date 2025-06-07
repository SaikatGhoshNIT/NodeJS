const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken') // Import validator for validation (NPM package)
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing (NPM package)

const {Schema} = mongoose;

const userSchema = new Schema ({
    firstName : String, // String is shorthand for {type: String}
    lastName : String,
    email : { // Email is a required field and must be unique
        type : String,
        required : true,
        unique : true,
        trim : true,
        // Validate email format
        validate(value) {
            /*const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(value)) {
                throw new Error("Invalid email format");
            }*/
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email format");
            }
        }
    },
    password : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        validate(value) {
            if(!validator.isStrongPassword(value, { minLength: 6 })) {
                throw new Error("Password must be at least 6 characters long");
            }
        }
    },
    age : {
        type : Number,
        min : 1,
        max : 80,
        validate(value){
            if(value <=0 || value >80){
                throw new Error("Age must be between 1 and 80");
            }
        }
    }, 
    gender : {
        type : String,
        enum :{
            values: ['male', 'female', 'other', 'prefer not to say', "Male", "Female", "Other", "Prefer not to say"],
            message: '{VALUE} is not a valid status'
        },
        default: 'prefer not to say',
        /*validate(value){
            if(!["male", "female"].includes(value.toLowerCase())) {
                throw new Error ("Gender must be either Male or Female")
            }
        }*/
    },
    skills : {
        type: [String],
        validate(value){
            if(value.length > 5){
                throw new Error("Skills cannot be more than 5");
            }
        }
    },
    mobile :{
        type: String,
        validate(value) {
            if(!validator.isMobilePhone(value, 'any', {strictMode: false})) {
                throw new Error("Invalid mobile number format");
            }
        }
    }

},
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
})

userSchema.methods.getJwtToken = async function() {
    const user = this;  // 'this' refers to the instance of the user document and arrow function don't have their own 'this'
    const token = jwt.sign({_id: this._id}, "Dena@123", { expiresIn: "1h" })
    return token; // Return the generated JWT token
}

userSchema.methods.comparePassword = async function(password) {
    const user = this; // 'this' refers to the instance of the user document
    const isMatch = await bcrypt.compare(password, this.password); 
    if(!isMatch){
        throw new Error("Invalid password"); // If the password does not match, throw an error
    }// Compare the provided password with the hashed password
    return isMatch; // Return true if the passwords match, false otherwise
}

module.exports = mongoose.model("User", userSchema);