const mediaService=require('../services/mediaService');

//Tarayıcıdan gelen isteği karşılayıp servise yönlendiren fonksiyon
const getAllMedia=async (req,res)=>{
    try{

        const data=await mediaService.getAllMedia();

        //veri başarıyla gelirse tarayıcıya 200 (OK) koduyla sunuyoruz
        res.status(200).json(data);
    }catch(error){
        res.status(500).json({mesaj:"Veriler çekilirken bir hata oluştu",hata:error.message})
    }
};

module.exports={
    getAllMedia
};