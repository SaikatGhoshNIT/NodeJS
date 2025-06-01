const {mongoose} = require('mongoose');
const validator = require('validator'); // Import validator for validation (NPM package)

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
        validate(value){
            if(!["male", "female"].includes(value.toLowerCase())) {
                throw new Error ("Gender must be either Male or Female")
            }
        }
    },
    skills : {
        type: [String],
        validate(value){
            if(value.length > 5){
                throw new Error("Skills cannot be more than 5");
            }
        }
    }
},
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
})

module.exports = mongoose.model("User", userSchema);