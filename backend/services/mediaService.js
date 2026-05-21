const db = require('../config/database');

const runRules=(...rules)=>{
    for(let ruleError of rules){
        if(ruleError !== null) return ruleError;
    }
    return null;
};

// İŞ KURALLARI
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

const checkDuplicateMedia=(baslik, tur, userId)=>{
    return new Promise((resolve, reject)=>{
        db.get(
            `SELECT id FROM media 
             WHERE LOWER(baslik) = LOWER(?) 
             AND tur = ? 
             AND kullanici_id = ?`,
            [baslik, tur, userId],
            (err, row)=>{
                if(err) return reject(err); // Güvenlik ağı: SQL hatası olursa sistemi kitlemesin
                if(row) return resolve({status:400, mesaj:'Bu içerik zaten arşivinde mevcut!'});
                resolve(null);
            }
        );
    });
};

// Tüm filmleri ve dizileri veritabanından çeken fonksiyon (Vitrin ve Kişisel panel ayrımı)
const getAllMedia = (userId) => {
    return new Promise((resolve, reject) => {
        if(userId){
            // Kişisel panel: Sadece bu kullanıcının girdiği verileri getir
            const sql='SELECT * FROM media WHERE kullanici_id = ? ORDER BY id DESC';
            db.all(sql,[userId],(err,rows)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
        }else{
            // Vitrin: Ziyaretçiler için tüm filmleri ve dizileri grupla ve puan ortalamasını al
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

// Veritabanına yeni kayıt ekleme fonksiyonu (Sahibinin kimliği ile beraber)
const addMedia = (mediaData, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const durum = mediaData.durum || 'İzlenecek';
            const puan = mediaData.puan || 0;

            const duplicateCheck = await checkDuplicateMedia(
                mediaData.baslik,
                mediaData.tur,
                userId
            );

            const ruleResult = runRules(
                duplicateCheck,
                checkUnwatchedScore(durum, puan),
                chechEmptyTitle(mediaData.baslik),
                checkScoreLimit(puan)
            );

            if(ruleResult !== null){
                return reject(ruleResult);
            }

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

            db.run(query, values, function(err){
                if(err){
                    reject(err);
                }else{
                    resolve({id:this.lastID, kullanici_id:userId, ...mediaData});
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Sadece bu veriyi giren güncelleyebilir
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

        // SQL Lite'nin update komutu ile o id'ye ait satırlar güncellenir
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

// Sadece bu veriyi giren silebilir
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