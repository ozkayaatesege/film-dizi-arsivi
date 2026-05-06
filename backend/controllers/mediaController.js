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

//Tarayıcıdan gelen yeni film/dizi verisini karşılayan fonksiyon
const addMedia=async(req,res)=>{
    try{
        const yeniMedya=req.body; //Gelen json verisi alınıyor
        if(!yeniMedya.baslik || !yeniMedya.tur){
            return res.status(400).json({mesaj: "Başlık ve tür (Film/Dizi) alanları zorunludur."});
        }

        const eklenenVeri=await mediaService.addMedia(yeniMedya);

        //201 Created (Başarıyla oluşturuldu) kodu dönüyoruz.
        res.status(201).json({mesaj:"Başarıyla Eklendi!",veri:eklenenVeri});
    }catch (error) {
        res.status(500).json({ mesaj: "Veri eklenirken bir hata oluştu", hata: error.message });
    }
}

module.exports={
    getAllMedia,
    addMedia
};