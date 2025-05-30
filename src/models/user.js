const {mongoose} = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema ({
    firstName : String, // String is shorthand for {type: String}
    lastName : String,
    email : { // Email is a required field and must be unique
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    age : Number, 
    gender : {
        type : String,
        validate(value){
            if(!["male", "female"].includes(value.toLowerCase())) {
                throw new Error ("Gender must be either Male or Female")
            }
        }
    },
    skills : [String]
},
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
})

module.exports = mongoose.model("User", userSchema);