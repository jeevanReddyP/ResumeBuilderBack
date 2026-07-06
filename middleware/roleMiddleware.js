const authorizeRoles=(...roles)=>{
    return(req,res,next)=>{
        console.log(req.user.id)
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                Msg:"Access denied"
            })
        }
        next()
    }
}

module.exports=authorizeRoles