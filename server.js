const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

// Swagger Konfigürasyon Ayarları
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Film ve Dizi Arşivi API',
            version: '1.0.0',
            description: 'Kişisel film ve dizi arşivini yönetmek ve test etmek için interaktif API dokümantasyonu',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    // Swagger'ın API kodlarını nerede arayacağını söylüyoruz
    apis: ['./backend/routes/*.js'], 
};

// Swagger Dokümantasyonunu Oluşturma
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const mediaRoutes = require('./backend/routes/mediaRoutes');
app.use('/api/media', mediaRoutes);

app.get('/api/test', (req, res) => {
    res.json({ durum: 'Başarılı', mesaj: 'Backend tıkır tıkır çalışıyor!' });
});

app.listen(PORT, () => {
    console.log(`Sunucu ayağa kalktı! Tarayıcıda şu adrese gidebilirsin: http://localhost:${PORT}`);
    console.log(`Swagger API Dokümantasyonu için: http://localhost:${PORT}/api-docs`);
});