const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Veritabanı dosyasının yolu (Ana dizinde film_arsivi.db olarak oluşacak)
const dbPath = path.resolve(__dirname, '../../film_arsivi.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
        console.log('SQLite veritabanına başarıyla bağlandı.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Media tablosu: Hem film hem dizi için ortak alanlar
    db.run(`CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        baslik TEXT NOT NULL,
        tur TEXT NOT NULL, -- 'Film' veya 'Dizi'
        kategori TEXT, -- 'Aksiyon', 'Mühendislik', 'Psikolojik' vb.
        durum TEXT DEFAULT 'İzlenecek', -- 'İzlenecek' veya 'İzlendi'
        puan INTEGER DEFAULT 0, -- 1-10 arası
        notlar TEXT,
        eklenme_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

module.exports = db;