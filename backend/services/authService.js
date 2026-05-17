const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// KAYIT OLMA İŞ MANTIĞI
const register = (kullanici_adi, sifre) => {
    return new Promise((resolve, reject) => {

        // İş kuralı: Kullanıcı adı veya şifre boş olamaz
        if (!kullanici_adi || !sifre || kullanici_adi.trim() === '' || sifre.trim() === '') {
            return reject({ status: 400, mesaj: 'Kullanıcı adı ve şifre boş bırakılamaz.' });
        }

        //İş kuralı: Şifre uzunluğu kontrolü
        if(sifre.length<6){
            return reject({status:400,mesaj:'Şifre en az 6 karakter içermelidir.'});
        }

        // İş kuralı: Şifre en az bir harf ve en az bir rakam içermelidir
        const harfVarMi = /[a-zA-Z]/.test(sifre);
        const rakamVarMi = /\d/.test(sifre);

        if (!harfVarMi || !rakamVarMi) {
            return reject({ status: 400, mesaj: 'Şifreniz en az bir harf ve en az bir rakam içermelidir.' });
        }

        // Şifreyi güvenlik standartlarına göre hashliyoruz
        const hashedPassword = bcrypt.hashSync(sifre, 8);
        const sql = `INSERT INTO users (kullanici_adi, sifre) VALUES (?, ?)`;
        
        db.run(sql, [kullanici_adi, hashedPassword], function(err) {
            if (err) {
                // Aynı kullanıcı adıyla biri varsa hatayı Controller'a fırlat
                if (err.message.includes('UNIQUE constraint failed')) {
                    reject({ status: 400, mesaj: 'Bu kullanıcı adı zaten alınmış, lütfen başka bir tane deneyin.' });
                } else {
                    reject({ status: 500, mesaj: 'Veritabanı hatası oluştu.', error: err.message });
                }
            } else {
                // İşlem başarılıysa sadece yeni ID'yi gönder
                resolve({ userId: this.lastID });
            }
        });
    });
};

// GİRİŞ YAPMA İŞ MANTIĞI 
const login = (kullanici_adi, sifre) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE kullanici_adi = ?`;
        
        db.get(sql, [kullanici_adi], (err, user) => {
            if (err) return reject({ status: 500, mesaj: 'Veritabanı hatası oluştu.' });
            
            // Kullanıcı veritabanında yoksa
            if (!user) return reject({ status: 404, mesaj: 'Böyle bir kullanıcı bulunamadı.' });

            // Şifre kontrolü
            const passwordIsValid = bcrypt.compareSync(sifre, user.sifre);
            if (!passwordIsValid) return reject({ status: 401, mesaj: 'Hatalı şifre girdiniz.' });

            // Şifre doğruysa Token üret
            const token = jwt.sign({ id: user.id, kullanici_adi: user.kullanici_adi }, JWT_SECRET, { expiresIn: '24h' });

            resolve({
                token: token,
                kullanici_adi: user.kullanici_adi
            });
        });
    });
};

module.exports = { register, login };