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

```text
film-dizi-arsivi/
├── backend/
│   ├── config/             # Veritabanı bağlantı ayarları
│   ├── controllers/        # İstek/yanıt yönetimi
│   ├── models/             # Veritabanı modelleri
│   ├── node_modules/       # Yüklü paketler (Git'e dahil edilmez)
│   ├── routes/             # API uç noktaları
│   ├── security/           # JWT doğrulama middleware
│   ├── services/           # İş mantığı (Business Logic) katmanı
│   ├── tests/              # Jest birim testleri
│   ├── .env                # Ortam değişkenleri
│   ├── film_arsivi.db      # SQLite veritabanı dosyası
│   ├── package-lock.json   # Bağımlılık ağacı kilit dosyası
│   ├── package.json        # Proje bağımlılıkları ve scriptler
│   └── server.js           # Uygulamanın başlangıç noktası
├── frontend/               # Vanilla JS SPA arayüzü
│   ├── app.js              # Arayüz iş mantığı ve API istekleri
│   ├── index.html          # Ana sayfa iskeleti
│   └── style.css           # Stil ve tasarım dosyası
├── .gitignore              # Git tarafından yok sayılacak dosyalar
└── README.md               # Proje dokümantasyonu
```

## Kurulum ve Çalıştırma

### Ön Koşullar

- Node.js (v18 veya üzeri)

### Adımlar

**1. Projeyi klonlayın ve backend klasörüne gidin:**
```bash
git clone [https://github.com/ozkayaatesege/film-dizi-arsivi.git](https://github.com/ozkayaatesege/film-dizi-arsivi.git)
cd film-dizi-arsivi/backend
```
*(Not: Tüm Node.js bağımlılıkları ve sunucu dosyaları `backend` klasörü içerisindedir.)*

**2. Bağımlılıkları yükleyin:**
```bash
npm install
```

**3. `.env` dosyası oluşturun (`backend` klasörü içinde):**
```text
PORT=3000
JWT_SECRET=gizli_anahtariniz
```

**4. Sunucuyu başlatın:**
```bash
npm start
```

Uygulama `http://localhost:3000` adresinde çalışmaya başlar. Veritabanı ilk çalıştırmada otomatik olarak oluşturulacaktır.

**5. Testleri çalıştırın (İsteğe bağlı):**
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

## Testler

Testler, uygulamanın iş mantığı (service katmanı) kurallarının doğru çalışıp çalışmadığını denetlemek için **Jest** kullanılarak yazılmıştır.

```bash
# backend/ klasöründe çalıştırılmalıdır
npm test      # 7 adet iş mantığı (unit) testini çalıştırır
```

### Test Kapsamı

- `authService` : Kullanıcı kayıt ve giriş validasyonları.
- `mediaService` : Medya ekleme ve denetim iş kuralları.

## Geliştirici

Ateş Ege Özkaya
