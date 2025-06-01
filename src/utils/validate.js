const validator = require('validator');

const signupValidation = (data) =>{
    const {firstName, lastName, email, password} = data;

    if(!firstName || !lastName || !email || !password) {
        throw new Error("All fields are required");
    }
    else if(!validator.isEmail(email)) {
        throw new Error("Invalid email format");
    }
    else if(!validator.isStrongPassword(password, { minLength: 6 })) {
        throw new Error("Password must be at least 6 characters long");
    }
    else if(!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
        throw new Error("First name and last name must contain only letters");
    }
    else if(!validator.isLength(firstName, { min: 2 }) || !validator.isLength(lastName, { min: 2 })) {
        throw new Error("First name and last name must be at least 2 characters long");
    }
}

module.exports = {
    signupValidation
};