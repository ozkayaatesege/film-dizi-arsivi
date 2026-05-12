const db = require('../config/database');

// Tüm filmleri ve dizileri veritabanından çeken fonksiyon (Vİtrin ve Kişisel panel ayrımı)
const getAllMedia = (userId) => {
    return new Promise((resolve, reject) => {
        if(userId){
            //Kişisel panel: Sadece bu kullanıcının girdiği verileri getir
            const sql='SELECT * FROM media WHERE kullanici_id = ? ORDER BY id DESC';
            db.all(sql,[userId],(err,rows)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
        }else{
            //Vitrin: Ziyaretçiler için tüm filmleri ve dizileri grupla ve puan ortalamasını al
            //Aynı başlık ve türdeki film veya dizileri birleştirip AVP(puan) ile ortalamalarını hesaplıyoruz
            const sql = `
                SELECT 
                    baslik, 
                    tur, 
                    MAX(kategori) as kategori, 
                    'Topluluk Arşivi' as durum, 
                    ROUND(AVG(puan), 1) as puan, 
                    'Kişisel notlar ziyaretçilere gizlidir.' as notlar 
                FROM media 
                GROUP BY baslik, tur 
                ORDER BY MAX(id) DESC
            `;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }); 
        }
    });
};

//veri tabanına yeni kayıt eklmeme fonksiyonu (Sahibinin kimliği ile beraber)
const addMedia=(mediaData,userId)=>{
    return new Promise((resolve,reject)=>{
        const query='INSERT INTO media (kullanici_id,baslik,tur,kategori,durum,puan,notlar) VALUES (?, ?, ?, ?, ?, ?,?)';
        const values=[
            userId,
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
                resolve({id:this.lastID, kullanici_id:userId, ...mediaData});
            }
        });
    });
};

//Sadecebu veriyi giren güncelleyebilir
const updateMedia=(id,data,userId)=>{
    return new Promise((resolve,reject)=>{
        //SQL Lite'nin update komutu ile o id'ye ait satırlar güncellenir
        const sql = `UPDATE media 
                     SET baslik = ?, tur = ?, kategori = ?, durum = ?, puan = ?, notlar = ? 
                     WHERE id = ? AND kullanici_id = ?`;

        const params=[data.baslik,data.tur,data.kategori,data.durum,data.puan,data.notlar,id,userId];
        db.run(sql,params,function(err){
            if(err){
                reject(err);
            }else{
                resolve({id:id,changes:this.changes});
            }
        });

    });
};

//Sadecebu veriyi giren silebilir
const deleteMedia=(id,userId)=>{
    return new Promise((resolve,reject)=>{
        const sql = `DELETE FROM media WHERE id = ? AND kullanici_id = ?`;
        db.run(sql, [id, userId], function(err) {
            if(err){
                reject(err);
            }else{
                resolve({ id: id, changes: this.changes});
            }
        });
    });
};

module.exports = {
    getAllMedia,
    addMedia,
    updateMedia,
    deleteMedia
};