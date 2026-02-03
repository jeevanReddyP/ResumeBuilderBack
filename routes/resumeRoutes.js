const express=require("express")
const router=express.Router()

const Resume=require("../models/resumeModel")
const generatePDF=require("../utils/pdfGenerator")

router.post("/download",async(req,res)=>{
    try {
        const {templateId, theme}=req.body

        const userId=req.body.userId
      const resume = await Resume.findOne({ userId });
        if(!resume){
            return res.status(404).json({Msg:"Resume Not Found"})
        }

        const pdfBuffer=await generatePDF(
            resume,
            templateId,
            theme
        );
        res.send(pdfBuffer)

    } catch (error) {
         console.error(error);
    res.status(500).json({ message: "PDF generation failed" })
    }
})
module.exports = router;