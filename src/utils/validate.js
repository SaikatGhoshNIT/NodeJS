const validator = require("validator");

const signupValidation = (data) => {
  const { firstName, lastName, email, password, skills, age } = data;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  } else if (!validator.isStrongPassword(password, { minLength: 6 })) {
    throw new Error("Password must be at least 6 characters long");
  } else if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
    throw new Error("First name and last name must contain only letters");
  } else if (
    !validator.isLength(firstName, { min: 2 }) ||
    !validator.isLength(lastName, { min: 2 })
  ) {
    throw new Error(
      "First name and last name must be at least 2 characters long"
    );
  } else if (!validator.isLength(skills, { max: 5 })) {
    throw new Error("You can add a maximum of 5 skills");
  }
  
  return true;
};

const updateValidation = (data) => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid data format");
  }
  if (Object.keys(data).length === 0) {
    throw new Error("No fields to update");
  }
  if (data.skills && !Array.isArray(data.skills)) {
    throw new Error("Skills must be an array");
  }

  try {
    const allowedUpdates = ["firstName", "lastName", "age", "gender", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) => {
      return allowedUpdates.includes(key);
    });
    console.log(isUpdateAllowed);
    
    return isUpdateAllowed;
  }
  catch (error) {
    throw new Error("Invalid update fields: " + error.message);
  }
};

const passwordValidator = (newPassword) => {
    try{if(!newPassword) {
      throw new Error("New password is required");
    }
    else if(!validator.isStrongPassword(newPassword, { minLength: 6 })) {
      throw new Error("New password must be at least 6 characters long");
    }
    return true;}
    catch(error) {
      throw new Error("Invalid password: " + error.message);
    }
}
module.exports = {
  signupValidation,
  updateValidation,
  passwordValidator
};
