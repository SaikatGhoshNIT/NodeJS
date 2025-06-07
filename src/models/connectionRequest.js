const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        },
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


//Schema level validation to ensure that the connection request is not sent to oneself
connectionRequestSchema.pre('save', function(next){ // pre will run before the save operation always
    try{const connectionRequest = this;
    if(this.fromUserId.toString() === this.toUserId.toString()) {
        //return throw new Error("You cannot send a connection request to yourself.");
        return next({
            status: 400,
            message: "You cannot send a connection request to yourself."
        });
    }
    next();}
    catch(error){
        //next(error);
        return next({
            status: 400,
            message: "Error in connection request validation: " + error.message
        });
    }
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true }); // Ensure unique connection requests between users

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);