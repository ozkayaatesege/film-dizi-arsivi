const db = require('../config/database');

const runRules=(...rules)=>{
    for(let ruleError of rules){
        if(ruleError !== null) return ruleError;
    }
    return null;
};

//İŞ KURALLARI
const checkUnwatchedScore=(durum,puan)=>{
    if(durum === 'İzlenecek' && puan>0){
        return {status:400,mesaj:'Henüz izlemediğiniz bir yapıma puan veremezsiniz.'};
    }
    return null;
};

const chechEmptyTitle = (baslik)=>{
    if(!baslik || baslik.trim()===''){
        return {status:400,mesaj:'Film veya Dizi başlığı boş bırakılmaz.'};
    }
    return null;
};

const checkScoreLimit=(puan)=>{
    if(puan<0 || puan>10){
        return {status:400,mesaj:'Puan 0 ile 10 arasında olmalı.'};
    }
    return null;
};


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
                    MAX(baslik) as baslik,
                    tur, 
                    MAX(kategori) as kategori, 
                    'Topluluk Arşivi' as durum, 
                    ROUND(AVG(CASE WHEN durum='İzlendi' THEN puan END),1) as puan, 
                    'Kişisel notlar ziyaretçilere gizlidir.' as notlar 
                FROM media 
                GROUP BY LOWER(baslik), tur
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

       const durum = mediaData.durum || 'İzlenecek';
       const puan = mediaData.puan || 0;

       const ruleResult=runRules(
        checkUnwatchedScore(durum,puan),
        chechEmptyTitle(mediaData.baslik),
        checkScoreLimit(puan)
       );

       if(ruleResult !==null){
        return reject(ruleResult);
       }

       //Veri tabanına ekleme
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

        const ruleResult=runRules(
            checkUnwatchedScore(data.durum,data.puan),
            chechEmptyTitle(data.baslik),
            checkScoreLimit(data.puan)
        );

        if(ruleResult !==null){
            return reject(ruleResult);
        }


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