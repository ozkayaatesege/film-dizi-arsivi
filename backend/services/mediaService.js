const db = require('../models/database');

// Tüm filmleri ve dizileri veritabanından çeken fonksiyon (Asıl İş Mantığı burada)
const getAllMedia = () => {
    return new Promise((resolve, reject) => {
        // En son eklenen en üstte çıksın diye DESC (azalan) sıralaması yapıyoruz
        db.all('SELECT * FROM media ORDER BY eklenme_tarihi DESC', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

//veri tabanına yeni kayıt eklmeme fonksiyonu
const addMedia=(mediaData)=>{
    return new Promise((resolve,reject)=>{
        const query='INSERT INTO media (baslik,tur,kategori,durum,puan,notlar) VALUES (?, ?, ?, ?, ?, ?)';
        const values=[
            mediaData.baslik,
            mediaData.tur,
            mediaData.kategori || null,
            mediaData.durum || 'İzlenecek',
            mediaData.puan || 0,
            mediaData.notlar || ''
        ];

        //Veri eklerken db.run kullanılır.
        db.run(query,values,function(err){
            if(err){
                reject(err);
            }else{
                resolve({id:this.lastID,...mediaData});
            }
        });
    });
};

module.exports = {
    getAllMedia,
    addMedia
};