const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/database');

const JWT_SECRET = 'benim_cok_gizli_anahtarim_123'; 

// KAYIT OLMA MOTORU
const register = (req, res) => {
    const { kullanici_adi, sifre } = req.body;

    if (!kullanici_adi || !sifre) {
        return res.status(400).json({ mesaj: 'Kullanıcı adı ve şifre zorunludur.' });
    }

    // Şifreyi güvenlik standartlarına göre hashliyoruz (şifreliyoruz)
    const hashedPassword = bcrypt.hashSync(sifre, 8);

    const sql = `INSERT INTO users (kullanici_adi, sifre) VALUES (?, ?)`;
    
    db.run(sql, [kullanici_adi, hashedPassword], function(err) {
        if (err) {
            // Eğer aynı kullanıcı adıyla biri daha kayıt olmaya çalışırsa (UNIQUE kuralı)
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ mesaj: 'Bu kullanıcı adı zaten alınmış, lütfen başka bir tane deneyin.' });
            }
            return res.status(500).json({ mesaj: 'Veritabanı hatası oluştu.', error: err.message });
        }
        res.status(201).json({ mesaj: 'Kayıt işlemi başarıyla tamamlandı!', userId: this.lastID });
    });
};

// GİRİŞ YAPMA MOTORU
const login = (req, res) => {
    const { kullanici_adi, sifre } = req.body;

    const sql = `SELECT * FROM users WHERE kullanici_adi = ?`;
    
    db.get(sql, [kullanici_adi], (err, user) => {
        if (err) return res.status(500).json({ mesaj: 'Veritabanı hatası oluştu.' });
        
        // Kullanıcı veritabanında yoksa
        if (!user) return res.status(404).json({ mesaj: 'Böyle bir kullanıcı bulunamadı.' });

        // Kullanıcı var, peki şifresi doğru mu? (Hashlenmiş şifre ile girilen şifreyi karşılaştırıyoruz)
        const passwordIsValid = bcrypt.compareSync(sifre, user.sifre);
        if (!passwordIsValid) return res.status(401).json({ mesaj: 'Hatalı şifre girdiniz.' });

        // Şifre de doğruysa VIP Kartı (JWT) üret! (Geçerlilik süresini 24 saat)
        const token = jwt.sign({ id: user.id, kullanici_adi: user.kullanici_adi }, JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ 
            message: 'Giriş başarılı!', 
            token: token, 
            kullanici_adi: user.kullanici_adi 
        });
    });
};

module.exports = { register, login };