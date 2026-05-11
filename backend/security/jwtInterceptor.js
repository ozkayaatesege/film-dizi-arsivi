const jwt = require('jsonwebtoken');

// authController.js dosyasında kullandığımız şifrenin birebir aynısı
const JWT_SECRET='benim_cok_gizli_anahtarim_123'

//İsteklerin arasına giren fonksiyon
const verifyToken=(req,res,next)=>{
    //Frontend'den gelen Authhorization başlığını alınıyoruz
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];

    //Eğer token hiç göderilmediyse(kullanıcı giriş yapmadıysa)
    if(!token){
        return res.status(403).json({mesaj:'Bu işlem için yetkiniz yok.Lütfen giriş yapınız'});
    }

    //Token üretilmiş sahte mi yoksa süresimi dolmuş ?
    jwt.verify(token,JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({mesaj:'Oturum süreniz dolmuş veya geçersiz token.'});
        }
        //Kullanıcının ID'sinin bir sonraki adıma aktarmak için req içine koyuyoruz
        req.userId = decoded.id;
        next();
    });
};

module.exports=verifyToken;