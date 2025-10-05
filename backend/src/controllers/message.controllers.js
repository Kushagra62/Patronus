import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const sidebarUsers = async (req, res) => {
try {
    

    const loggedinUser = req.user._id;
    const getusers = await User.find({ _id: { $ne :loggedinUser}})

    res.status(200).json(getusers);
} catch (error) {
    console.log("error in sidebar user controller", error.message)
    res.status(500).json({message:"Internal serever error"});
}
    
}

export const getMessages = async (req, res) => {
  try {
    const { id: receiverid } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverid },
        { senderId: receiverid, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req,res) => {

  try {
    const {text,image} = req.body
    const senderId = req.user._id;
    const {id: receiverId} = req.params
    let imageurl;
    if (image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageurl = uploadResponse.secure_url;

    }
    const message = new Message({
        senderId,
        receiverId,
        text,
        image: imageurl 

    })
    await message.save()

    const receiverScoketId = getReceiverSocketId(receiverId);
    if (receiverScoketId){
        io.to(receiverScoketId).emit("newMessage", message)
    }


    res.status(201).json(message)
  } catch (error) {
    console.log("error in send message controller", error.message)
    res.status(500).json({message:"Internal serever error"});
  }
    
}