const asyncHandler = require("express-async-handler");
const User = require("./model.js");
const generateToken = require("../utils/generateToken.js");

//  @desc   :  Register user
//  @Route  :  POST /users
//  @access :  Public
const registerUser = asyncHandler( async (req,res)=>{
    try{
        const {username,email,password,country,type } = req.body
        const userExist = await User.findOne({email})
    
        if(userExist){
            res.status(400)
            throw new Error("User already exist");
        }
    
        const user = await User.create({
            email, username , password, country, type
        })
    
        if(user){
            const jwt = generateToken(user._id);
            res.status(200).json({
                _id:user._id,
                email,
                username , 
                password, 
                country, 
                type,
                jwt
            })
        }
        else{
            res.status(400)
            throw new Error("Invalid user data")
        }
    } catch(error){
        console.log(error.message)
    }
    
})

//  @desc   :  Login user
//  @Route  :  POST /users/login
//  @access :  Public
const loginUser = asyncHandler( async (req,res)=>{
    const { email,password } = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("Email or password missing!")
    }

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))){
        const jwt = generateToken(user._id);
    
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            type: user.type,
            jwt
        });
    }else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    
})

//  Exporting the routes
module.exports = {
    registerUser,
    loginUser
}