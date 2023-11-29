const asyncHandler = require("express-async-handler");
const User = require("./model.js");
const generateToken = require("../utils/generateToken.js");

//  @desc   :  Register user
//  @Route  :  POST /users
//  @access :  Public
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password, country, type } = req.body
        const userExist = await User.findOne({ email })

        if (userExist) {
            res.status(400)
            throw new Error("User already exist");
        }

        const user = await User.create({
            email, username, password, country, type
        })

        if (user) {
            const jwt = generateToken(user._id);
            res.status(200).json({
                _id: user._id,
                email,
                username,
                password,
                country,
                type,
                jwt
            })
        }
        else {
            res.status(400)
            throw new Error("Invalid user data")
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }

})

//  @desc   :  Login user
//  @Route  :  POST /users/login
//  @access :  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Email or password missing!")
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const jwt = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            type: user.type,
            jwt
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }

})

//  @desc   :  Sign In With Google
//  @Route  :  POST /users/google
//  @access :  Public
const signInWithGoogle = asyncHandler(async (req, res) => {
    const { username, email, type } = req.body;

    try{
        const userExist = await User.findOne({ email });
    
        if (userExist) {
            const jwt = generateToken(userExist._id);
            res.status(200).json({
                _id: userExist._id,
                email: userExist?.email,
                username: userExist?.username,
                type: userExist?.type,
                jwt
            })
        } else {
            const user = await User.create({
                email, username, type
            })
    
            const jwt = generateToken(user._id);
    
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                type: user.type,
                jwt
            });
        }
    } catch(error){
        return res.status(500).json(error.message)
    }
})

//  Exporting the routes
module.exports = {
    registerUser,
    loginUser,
    signInWithGoogle
}