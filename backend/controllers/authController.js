const authService = require('../services/authService');

// KAYIT OLMA YÖNLENDİRMESİ
const register = async (req, res) => {
    try {
        const { kullanici_adi, sifre } = req.body;

        // Temel doğrulama
        if (!kullanici_adi || !sifre) {
            return res.status(400).json({ mesaj: 'Kullanıcı adı ve şifre zorunludur.' });
        }

        // İsteği Service'e iletiyoruz
        const result = await authService.register(kullanici_adi, sifre);
        
        // Mutfaktan başarıyla dönerse müşteriye sunuyoruz
        res.status(201).json({ mesaj: 'Kayıt işlemi başarıyla tamamlandı!', userId: result.userId });
    } catch (error) {
        // Mutfaktan bir hata fırlatılırsa (Örn: İsim alınmış)
        const statusCode = error.status || 500;
        res.status(statusCode).json({ mesaj: error.mesaj, error: error.error });
    }
};

// GİRİŞ YAPMA YÖNLENDİRMESİ
const login = async (req, res) => {
    try {
        const { kullanici_adi, sifre } = req.body;

        if (!kullanici_adi || !sifre) {
            return res.status(400).json({ mesaj: 'Kullanıcı adı ve şifre zorunludur.' });
        }

        // Giriş isteğini service'e iletiyoruz
        const result = await authService.login(kullanici_adi, sifre);

        // Service'den Token başarıyla geldiyse
        res.status(200).json({ 
            message: 'Giriş başarılı!', 
            token: result.token, 
            kullanici_adi: result.kullanici_adi 
        });
    } catch (error) {
        // Hatalı şifre veya kullanıcı yoksa
        const statusCode = error.status || 500;
        res.status(statusCode).json({ mesaj: error.mesaj });
    }
};

module.exports = { register, login };