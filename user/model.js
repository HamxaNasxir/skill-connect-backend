const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    type : {
        type: String,
        enum: ["translator", "client" , "admin", "guest"],
        required: true,
    },
    country : {
        type:String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profileId:{
      type: mongoose.Types.ObjectId,
      ref: "Profiles",
      default:null
    }, 
    isActive: {
      type: Boolean,
      deafult:false
    },
    lat:{
      type: String,
      default: null
    },
    long:{
      type: String,
      default: null
    },
    address:{
      type: String,
      default: null
    },
    stripeCard:{
      type: String,
      default: null
    },
    otp:{
      type: String,
      default: null
    },
    otp_verify:{
      type: Boolean,
      default: false
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