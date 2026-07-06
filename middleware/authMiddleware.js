const jwt=require("jsonwebtoken")

const authMiddelware= async (req,res,next)=>{

    const token = req.headers.authorization?.split(" ")[1]
    console.log(token)
    if(!token){
        return res.status(401).json({Msg:"No token access denied"})
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        console.log(req.user.role)
        next();
    } catch (error) {
        res.status(400).json({Msg:"Invalid token"})
    }
}

module.exports=authMiddelware