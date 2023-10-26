const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'Users'
    },
    school:{
        type: String
    },
    degree:{
        type: String
    },
    field:{
        type: String
    },
    startDate:{
        type: String
    },
    endDate:{
        type:String
    },
    rate:{
        type:Number
    },
    fee:{
        type:Number
    },
    language:[],
    picture:{
        type:String
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    contact:{
        type:String
    },
    address:{
        type:String
    },
    description:{
        type:String
    }


},{
    timestamps: true
});

const Profile = mongoose.model('Profiles', profileSchema);

module.exports = Profile;