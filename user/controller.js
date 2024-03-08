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

        // Update the isActive true when login.
        const updatedUser = await User.findOneAndUpdate({email}, {isActive: true}, {new:true});
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            type: user.type,
            isActive: updatedUser?.isActive,
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

//  @desc   :  Logout user
//  @Route  :  PUT /users/logout/:userId
//  @access :  Public
const logoutUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;

        // Update the isActive to false when logging out.
        const user = await User.findOneAndUpdate({ _id: userId }, { isActive: false }, { new: true });

        // Provide feedback to the user in the response.
        res.status(200).json({
            message: 'User logged out successfully',
            id: user._id,
            isActive: user.isActive
        });
    } catch (error) {
        res.status(401);
        throw new Error(error?.message);
    }
})

//  @desc   :  Update Long and Lat
//  @Route  :  PUT /users/location
//  @access :  Public
const updateLocation = asyncHandler(async (req, res) => {
    try {
        const {userId, lat, long} = req.body;

        // Update the location
        const user = await User.findOneAndUpdate({ _id: userId }, { lat, long }, { new: true });

        // Provide feedback to the user in the response.
        res.status(200).json({
            message: 'Longitude and Latitude is updated',
            lat,
            long
        });
    } catch (error) {
        res.status(401);
        throw new Error(error?.message);
    }
})

//  @desc   :  Update Addres
//  @Route  :  PUT /users/address
//  @access :  Public
const updateAddress = asyncHandler(async (req, res) => {
    try {
        const {userId, address} = req.body;

        // Update the address
        const user = await User.findOneAndUpdate({ _id: userId }, { address }, { new: true });

        // Provide feedback to the user in the response.
        res.status(200).json({
            message: 'Address is updated',
            address: user?.address
        });
    } catch (error) {
        res.status(401);
        throw new Error(error?.message);
    }
})

const GetAllUsers = asyncHandler(async (req, res) => {
    try {
        const {userId, address} = req.body;

        // Update the address
        const user = await User.find({});

        // Provide feedback to the user in the response.
        res.status(200).json(user)
    } catch (error) {
        res.status(401);
        throw new Error(error?.message);
    }
})

//  @desc   :  Update Stripe Card
//  @Route  :  PUT /users/card
//  @access :  Public
const updateStripeCard = asyncHandler(async (req, res) => {
    try {
        const {userId, stripeCard} = req.body;

        // Update the stripe
        const user = await User.findOneAndUpdate({ _id: userId }, { stripeCard }, { new: true });

        // Provide feedback to the user in the response.
        res.status(200).json({
            message: 'Stripe Card is updated',
            stripeCard: user?.stripeCard
        });
    } catch (error) {
        res.status(401);
        throw new Error(error?.message);
    }
})

//  Exporting the routes
module.exports = {
    registerUser,
    loginUser,
    signInWithGoogle,
    logoutUser,
    updateLocation,
    updateAddress,
    updateStripeCard,
    GetAllUsers
}