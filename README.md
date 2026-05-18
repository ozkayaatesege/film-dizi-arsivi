# Film ve Dizi Arşivi

Kişisel film ve dizi takibine yarayan web tabanlı bir CRUD uygulamasıdır. İzlenen veya izlenecek içerikler listelenebilir, puanlanabilir ve yönetilebilir.

Sistem, RESTful API sunan bir Node.js backend ve Vanilla JavaScript ile geliştirilmiş Tek Sayfa Uygulaması (SPA) frontend arayüzünden oluşmaktadır.

## Teknolojiler

- **Frontend:** Vanilla JavaScript (SPA, `fetch` ile asenkron API çağrıları)
- **Backend:** Node.js, Express.js v5
- **Veritabanı:** SQLite3
- **Kimlik Doğrulama:** JWT (JSON Web Token) + bcryptjs
- **API Dokümantasyonu:** Swagger (OpenAPI 3.0)
- **Test:** Jest

## Proje Yapısı

```
film-dizi-arsivi/
├── backend/
│   ├── controllers/        # İstek/yanıt yönetimi
│   ├── routes/             # API uç noktaları
│   ├── services/           # İş mantığı katmanı
│   └── security/           # JWT doğrulama middleware
├── frontend/               # Vanilla JS SPA arayüzü
├── film_arsivi.db          # SQLite veritabanı dosyası
├── server.js               # Uygulamanın başlangıç noktası
└── .env                    # Ortam değişkenleri
```

## Kurulum ve Çalıştırma

### Ön Koşullar

- Node.js (v18 veya üzeri)

### Adımlar

**1. Bağımlılıkları yükleyin:**
```bash
npm install
```

**2. `.env` dosyası oluşturun:**
```
PORT=3000
JWT_SECRET=gizli_anahtariniz
```

**3. Sunucuyu başlatın:**
```bash
npm start
```

Uygulama `http://localhost:3000` adresinde çalışmaya başlar.

**4. Testleri çalıştırın:**
```bash
npm test
```

## API Dokümantasyonu (Swagger)

Sunucu çalışırken tüm endpoint'leri interaktif olarak test edebilirsiniz:

👉 `http://localhost:3000/api-docs`

## API Uç Noktaları

Tüm istek ve yanıtlar JSON formatındadır.

### Kimlik Doğrulama

- `POST /api/auth/register` — Yeni kullanıcı kaydı oluşturur.
- `POST /api/auth/login` — Giriş yapar, JWT token döner.

### Medya (Film / Dizi)

Ekleme, güncelleme ve silme işlemleri için `Authorization: Bearer <token>` başlığı gereklidir.

- `GET /api/media` — Token ile istek atılırsa kullanıcının kişisel arşivini, token olmadan atılırsa tüm içeriklerin ortalama puanlarını döner.
- `POST /api/media` — Yeni film veya dizi kaydı ekler.
- `PUT /api/media/:id` — Mevcut kaydı günceller.
- `DELETE /api/media/:id` — Kaydı siler.

### Örnek İstek (POST /api/media)

```json
{
  "baslik": "Interstellar",
  "tur": "Film",
  "kategori": "Bilim Kurgu",
  "durum": "İzlendi",
  "puan": 9,
  "notlar": "Muhteşem bir yapım."
}
```

## Geliştirici

Ateş Ege Özkaya
