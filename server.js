const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Gelen isteklerdeki JSON verilerini okuyabilmek için
app.use(express.json());

// Frontend klasörünü statik dosya olarak dışarı açıyoruz
app.use(express.static(path.join(__dirname, 'frontend')));

// API'nin çalıştığını test etmek için ilk endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        durum: 'Başarılı', 
        mesaj: 'Backend tıkır tıkır çalışıyor! Kişisel Film ve Dizi Arşivi API ayağa kalktı.' 
    });
});

app.listen(PORT, () => {
    console.log(`Sunucu ayağa kalktı! Tarayıcıda şu adrese gidebilirsin: http://localhost:${PORT}`);
});