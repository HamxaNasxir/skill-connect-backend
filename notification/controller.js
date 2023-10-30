const asyncHandler = require("express-async-handler");
const Notification = require("./model");

//  @desc   :  Create Notification
//  @Route  :  POST /notifications
//  @access :  Public
const createNotication = asyncHandler(async (req, res) => {
    const { receiverId, senderId, text, url } = req.body;
    const newNotification = new Notification({
        receiverId,
        senderId,
        text,
        url,
    });

    const notification = await newNotification.save();
    res.status(200).json(notification)
})

//  @desc   :  Get Notification
//  @Route  :  GET /notifications/:id
//  @access :  Pubic
const getNotification = asyncHandler(async(req,res)=>{
    const id = req.params.id;

    const notification = await Notification.find({receiverId:id}).sort({createdAt:-1}).exec();
    res.status(200).json(notification);
})

//  @desc   :  Making isRead true for Notification after clicking on view button, send id of notification which you want to read
//  @Route  :  PUT /notifications/:id
//  @access :  Public
const readNotification = asyncHandler(async(req,res)=>{
    const id = req.params.id;
  
    const availableNotification = await Notification.findById(id);
    if (!availableNotification) {
      return res.status(404).json({ error: "Notification is not available" });
    }

    await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

    return res.status(200).json("Notification has been marked as read");
})

//  @desc   :  Making isRead true for Notification after clicking on view button, send id of the receiver!
//  @Route  :  PUT /notifications/view/:id
//  @access :  Public
const viewNotification = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    await Notification.updateMany({receiverId: id}, {isCount:true})

    res.status(200).json("Notification has been marked as count")
})

//  @desc   :  Deleting Notification on clicking delete button
//  @Route  :  DELETE /notifications/:id
//  @access :  Public
const deleteNotification = asyncHandler(async(req,res)=>{
    const id  = req.params.id;

    await Notification.deleteOne({_id:id});

    res.status(200).json("Notification has been deleted");
})

module.exports = {
    createNotication,
    getNotification,
    readNotification,
    viewNotification,
    deleteNotification
}