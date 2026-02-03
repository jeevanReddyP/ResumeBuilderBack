const express=require("express")
const User=require("../models/userModel")
const bcrypt=require("bcryptjs")
const jwt = require("jsonwebtoken");


const RegisterUser = async (req, res) => {
  console.log("Register page")
  try {
    const { name, email, password } = req.body;
console.log("Hello")
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
console.log("JWT_SECRET VALUE:", process.env.JWT_SECRET);
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ pre('save') will hash password automatically
    const user = new User({ name, email, password });
    await user.save();

    // ✅ token (make sure JWT_SECRET exists in Render)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.log(err.message)
    console.error("REGISTER ERROR:", err);

    // ✅ handle duplicate email nicely
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }

    return res.status(500).json({ message: err.message});
  }
};



 const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
         if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({Msg:"Enter Valid Email and Password"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
       if(!isMatch){
        return res.status(400).json({Msg:"Enter Valid Password"})
       }

        const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
       res.status(200).json({Msg:"Login Successful",token,
         user: { id: user._id, name: user.name, email: user.email }
       })
    } catch (error) {
       console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: error.message});
    }
}

module.exports={RegisterUser,loginUser}