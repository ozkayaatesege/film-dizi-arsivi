const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Veritabanı dosyasının yolunu belirliyoruz
const dbPath = path.resolve(__dirname, '../../film_arsivi.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err.message);
    } else {
        console.log('SQLite veritabanına başarıyla bağlanıldı.');
    }
});

// Tabloları oluşturma işlemleri
db.serialize(() => {
    
    // 1. KULLANICILAR TABLOSU
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kullanici_adi TEXT UNIQUE NOT NULL,
            sifre TEXT NOT NULL
        )
    `);

    // 2. MEDYA TABLOSU (GÜNCELLENDİ: Artık her filmin bir sahibi var!)
    db.run(`
        CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kullanici_id INTEGER NOT NULL,
            baslik TEXT NOT NULL,
            tur TEXT,
            kategori TEXT,
            durum TEXT,
            puan REAL,
            notlar TEXT,
            FOREIGN KEY (kullanici_id) REFERENCES users(id)
        )
    `);
});

module.exports = db;