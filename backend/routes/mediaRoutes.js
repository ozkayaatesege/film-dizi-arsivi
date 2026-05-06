const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.status(200).json({mesaj: "Tüm medya listesi yakında buraya gelecek!"});
});

module.exports=router;