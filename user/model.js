const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    type : {
        type: String,
        enum: ["translator", "client"],
        required: true,
    },
    country : {
        type:String,
        required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook in Mongoose, executed before saving the user document
userSchema.pre('save',async function (next){
  if(!this.isModified('password')){ // Check if the password has been modified
    next(); // If not modified, move to the next middleware
  }

  const salt = await bcrypt.genSalt(10); // Generate a salt for password hashing
  this.password = await bcrypt.hash(this.password, salt); // Hash the password using bcrypt
});


const User = mongoose.model('Users', userSchema);

module.exports = User;