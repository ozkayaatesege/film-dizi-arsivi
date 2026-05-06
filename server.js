const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Gelen isteklerdeki JSON verilerini okuyabilmek için
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

const mediaRoutes=require('./backend/routes/mediaRoutes');
app.use('/api/media',mediaRoutes);

app.get('/api/test', (req, res) => {
    res.json({ 
        durum: 'Başarılı', 
        mesaj: 'Backend çalışıyor! Kişisel Film ve Dizi Arşivi API ayağa kalktı.' 
    });
});

app.listen(PORT, () => {
    console.log(`Sunucu ayağa kalktı! Tarayıcıda şu adrese gidebilirsin: http://localhost:${PORT}`);
});