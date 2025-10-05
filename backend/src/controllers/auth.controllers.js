import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/jwt.js";
import userSchema from "../validator/User.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async(req,res) =>{
   
    try{

        const {fullName, email, password} =await userSchema.validate( req.body);


        const user = await User.findOne({email})
        if (user) return res.status(400).json({message: "account with email already exists"})

        const salt = await bcrypt.genSalt(10)
         //hash passwords
         const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        if (newUser){
            generateToken(newUser._id,res)

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        }
        else{
            return res.status(400).json({message:"invaid user data"})
        }
  } catch (error){
    console.log("error in signup controller", error.message);
    if (error.name==='ValidationError'){
        return res.status(422).json({message:error.message,});
    }
    return res.status(400).json({message:error.message,});
    }
}
export const login = async (req,res) =>{
    const {email, password} = req.body
   try{

    const user=await User.findOne({email})

    if (!user) {
        return res.status(400).json({message:"Invalid credentials"})
    }

    if (!(await bcrypt.compare(password,user.password))){
        return res.status(400).json({message:"Invalid credentials"})

    }

    generateToken(user._id,res)
    res.status(200).json({
        _id:user.id,
        fullName: user.fullName,
        email:user.email,
        profilePic:user.profilePic,
    })


   } catch(error) {

    console.log("error in login controller", error.message)
    res.status(500).json({message:"Internal serever error"});

   }
}
export const logout = (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const update = async(req,res) =>{

    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if (!profilePic){
            return res.status(400).json({message:"no picture found"})

        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic: uploadResponse.secure_url}, {new:true})
        
        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("error in update controller",error.message)
        res.status(500).json({message:"Internal server error"});
    }
    
}

export const checkAuth = (req,res) =>{
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        console.log("error in check auth controller",error.message)
       res.status(500).json({message:"Internal server error"});
    }

}