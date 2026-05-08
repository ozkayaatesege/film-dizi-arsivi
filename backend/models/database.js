const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Veritabanı dosyasının yolunu belirliyoruz (Ana dizindeki film_arsivi.db)
const dbPath = path.resolve(__dirname, '../../film_arsivi.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err.message);
    } else {
        console.log('SQLite veritabanına başarıyla bağlanıldı.');
    }
});

// Tabloları oluşturma işlemleri (db.serialize ile sırayla çalışmasını sağlıyoruz)
db.serialize(() => {
    // 1. MEVCUT MEDYA TABLOSU
    db.run(`
        CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            baslik TEXT NOT NULL,
            tur TEXT,
            kategori TEXT,
            durum TEXT,
            puan REAL,
            notlar TEXT
        )
    `);

    // 2. YENİ EKLENEN: KULLANICILAR TABLOSU
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kullanici_adi TEXT UNIQUE NOT NULL,
            sifre TEXT NOT NULL
        )
    `);

    // 3. YENİ EKLENEN: PUANLAMALAR TABLOSU
    db.run(`
        CREATE TABLE IF NOT EXISTS ratings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            media_id INTEGER NOT NULL,
            puan REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (media_id) REFERENCES media(id)
        )
    `);
});

module.exports = db;