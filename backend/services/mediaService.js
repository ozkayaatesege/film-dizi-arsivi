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

module.exports = {
    getAllMedia
};