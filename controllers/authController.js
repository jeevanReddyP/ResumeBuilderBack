const express=require("express")
const User=require("../models/userModel")
const bcrypt=require("bcryptjs")
const jwt = require("jsonwebtoken")

 const RegisterUser= async (req,res)=>{
    try {
        const {name,email,password}= req.body
        const userexists = await User.findOne({email})
        if(userexists){
           return res.status(400).json({msg:"User Already Exists"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedpass=await bcrypt.hash(password,salt)
        const user=await User.create({
            name,
            email,
            password:hashedpass
        })
      const token=jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
      )
      res.status(201).json({Msg:`User Registerd Successfully`,token})

    } catch (error) {
        res.status(500).json({Msg:error.message})
    }
}

 const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({Msg:"Enter Valid Email and Password"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
       if(!isMatch){
        return res.status(400).json({Msg:"Enter Valid Password"})
       }

       const token=jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
       )
       res.status(200).json({Msg:"Login Successful",token})
    } catch (error) {
        res.status(500).json({Msg:error.message})
    }
}

module.exports={RegisterUser,loginUser}