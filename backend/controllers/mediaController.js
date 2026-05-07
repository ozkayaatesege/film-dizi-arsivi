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
};

//Güncelleme methodu
const updateMedia=async (req,res)=>{
    try{
        //URL'den göderilen id burada yakalanıyor
        const id=req.params.id;

        //Formdan gelen yeni bilgiler alınıyor
        const guncelVeri=req.body;

        //Service dosyasında yazdığımız updateMEdia fonksiyonuna ID ve veriyi gönderiyoruz
        const sonuc=await mediaService.updateMedia(id,guncelVeri);

        if(sonuc.changes===0){
            return res.status(404).json({mesaj:"Güncellenecek kayıt bulunamadı!"});
        }
        res.status(200).json({mesaj:"Kayıt başarıyla güncellendi!",veri:{id,...guncelVeri}});
    }catch(error){
        res.status(500).json({hata:error.message});
    }
};

//Silme methodu

const deleteMedia=async(req,res)=>{
    try{
        const id=req.params.id;

        const sonuc=await mediaService.deleteMedia(id);

        if(sonuc.changes===0){
            return res.status(404).json({mesaj:"Silinecek kayıt bulunamadı"});
        }
        res.status(200).json({mesaj:"Kayıt başarıyla silindi"});
    }catch(error){
        res.status(500).json({hata:error.message});
    }
};

module.exports={
    getAllMedia,
    addMedia,
    updateMedia,
    deleteMedia
};