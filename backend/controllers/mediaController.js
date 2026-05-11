const mediaService=require('../services/mediaService');
const jwt=require('jsonwebtoken');

// Şifre çözerken kullanacağımız anahtar (Interceptor'daki ile aynı olmalı)
const JWT_SECRET='benim_cok_gizli_anahtarim_123';

//Tarayıcıdan gelen isteği karşılayıp servise yönlendiren fonksiyon
const getAllMedia=async (req,res)=>{
    try{
        let userId=null;

        // GET isteğinin önünde bekçi yok ama eğer gelen istekte Token varsa onu alıyoruz
        const authHeader =req.headers['authorization'];
        if(authHeader){
            const token =authHeader.split(' ')[1];

            try{
                // Token sahte değilse, sahibinin ID'sini alıyoruz
                const decoded=jwt.verify(token,JWT_SECRET);
                userId=decoded.id;
            }catch(error){
                // Token geçersizse veya süresi dolmuşsa direkt olarak ziyaretçi olarak devam et
            }
        }

        //Eğer user id doluysa Servis bize kişisel arşivi getirecek
        //Eğer usesr id boşsa(null) SErvis bize verilerin ortalama puanını gösteren bir liste getirecek
        const data=await mediaService.getAllMedia(userId);
        res.status(200).json(data);
    }catch(error){
        res.status(500).json({mesaj:"Veriler çekilirken bir hata oluştu",hata:error.message});
    }
};

//Tarayıcıdan gelen yeni film/dizi verisini karşılayan fonksiyon
const addMedia=async(req,res)=>{
    try{
        const yeniMedya=req.body; //Gelen json verisi alınıyor
        const userId=req.userId;  //Güvenliğimizden gelen kullanıcı kimliği

        if(!yeniMedya.baslik || !yeniMedya.tur){
            return res.status(400).json({mesaj: "Başlık ve tür (Film/Dizi) alanları zorunludur."});
        }

        //Film eklenirken servise bu filni ekleyen kişi bu adam diyebiliyoruz(Girilen userId verisi sayesinde)
        const eklenenVeri=await mediaService.addMedia(yeniMedya,userId);

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

        const userId=req.userId; //Güvenlikten gelen kullanıcı kimliği

        //Service dosyasında yazdığımız updateMEdia fonksiyonuna ID , veriyi ve Sahiplik kimliğini  gönderiyoruz
        const sonuc=await mediaService.updateMedia(id,guncelVeri,userId);

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
        const userId=req.userId;

        // Servise silinecek filmi ve silmek isteyen kişiyi yolluyoruz
        const sonuc=await mediaService.deleteMedia(id,userId);

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