let guncellenecekId = null;
let silinecekId = null;

document.addEventListener("DOMContentLoaded", () => {
  medyalariGetir();
});

// ARAYÜZ YETKİ KONTROL MOTORU
// Bu fonksiyon, kullanıcının giriş yapıp yapmadığını kontrol eder ve butonları ona göre gizler/gösterir
function arayuzuGuncelle() {
  const token = localStorage.getItem("token");
  const kartButonGruptari = document.querySelectorAll(".kart-butonlar");

  // Header butonlarını ayarla
  const yeniEkleBtn = document.getElementById("yeniEkleBtn");
  const authModalAcBtn = document.getElementById("authModalAcBtn");
  const cikisYapBtn = document.getElementById("cikisYapBtn");

  if (token) {
    // Token var -> Kullanıcı giriş yapmış (Admin yetkileri açık)
    yeniEkleBtn.style.display = "block";
    cikisYapBtn.style.display = "block";
    authModalAcBtn.style.display = "none";

    // Tüm kartlardaki Düzenle/Sil butonlarını görünür yap
    kartButonGruptari.forEach((grup) => (grup.style.display = "flex"));
  } else {
    // Token yok -> Ziyaretçi modu (Sadece okuma)
    yeniEkleBtn.style.display = "none";
    cikisYapBtn.style.display = "none";
    authModalAcBtn.style.display = "block";

    // Tüm kartlardaki Düzenle/Sil butonlarını gizle
    kartButonGruptari.forEach((grup) => (grup.style.display = "none"));
  }
}

async function medyalariGetir() {
  const kapsayici = document.getElementById("listeKapsayici");

  try {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch("/api/media", { headers });
    if (!response.ok) throw new Error("Veriler çekilemedi");
    const veriler = await response.json();

    if (veriler.length === 0) {
      kapsayici.innerHTML = "<p>Arşive henüz bir kayıt bulunmuyor</p>";
      return;
    }

    kapsayici.innerHTML = "";

    veriler.forEach((medya) => {
      const kart = document.createElement("div");
      kart.className = "medya-kart";

      let puanVeNotGosterimi = '';
if (medya.durum !== 'İzlenecek') {
    const token = localStorage.getItem('token');
    
    let notGosterimi = '';
    if (token) {
        notGosterimi = `<p><strong>Not:</strong> ${medya.notlar || 'Not yok.'}</p>`;
    }

    puanVeNotGosterimi = `
        <p><strong>Puan:</strong> ${medya.puan}/10</p>
        ${notGosterimi}
    `;
}

      kart.innerHTML = `
                <h3>${medya.baslik}</h3>
                <p><strong>Tür:</strong> ${medya.tur}</p>
                <p><strong>Kategori:</strong> ${medya.kategori || "Belirtilmedi"}</p>
                <p><strong>Durum:</strong> ${medya.durum}</p>
                ${puanVeNotGosterimi}
                <div class="kart-butonlar">
                    <button class="btn-duzenle">Düzenle</button>
                    <button class="btn-sil">Sil</button>
                </div>
            `;

      const duzenleBtn = kart.querySelector(".btn-duzenle");
      duzenleBtn.addEventListener("click", () => {
        guncellenecekId = medya.id;

        document.getElementById("baslik").value = medya.baslik;
        document.getElementById("tur").value = medya.tur;
        document.getElementById("kategori").value = medya.kategori || "";
        document.getElementById("durum").value = medya.durum;
        document.getElementById("puan").value = medya.puan || "";
        document.getElementById("notlar").value = medya.notlar || "";

        document.querySelector("#eklemeModali .modal-icerik h2").innerText =
          "İçeriği Düzenle";
        document.getElementById("eklemeModali").style.display = "flex";
      });

      const silBtn = kart.querySelector(".btn-sil");
      silBtn.addEventListener("click", () => {
        silinecekId = medya.id;

        let turEki = "yapımını";
        if (medya.tur === "Film") turEki = "filmini";
        if (medya.tur === "Dizi") turEki = "dizisini";
        if (medya.tur === "Belgesel") turEki = "belgeselini";

        document.getElementById("silmeMetni").innerHTML =
          `<strong>${medya.baslik}</strong> ${turEki} arşivden tamamen silmek istediğinize emin misiniz?`;
        document.getElementById("silmeModali").style.display = "flex";
      });

      kapsayici.appendChild(kart);
    });

    arayuzuGuncelle();
    filtreleriUygula();
  } catch (error) {
    console.error("Hata:", error);
    kapsayici.innerHTML =
      '<p style="color: red;">Veriler yüklenirken bir sorun oluştu.</p>';
  }
}

// GÜVENLİK (AUTH) MODALI İŞLEMLERİ
const authModalAcBtn = document.getElementById("authModalAcBtn");
const cikisYapBtn = document.getElementById("cikisYapBtn");
const authModali = document.getElementById("authModali");
const authFormu = document.getElementById("authFormu");
const authIptalBtn = document.getElementById("authIptalBtn");
const authModDegistir = document.getElementById("authModDegistir");
const authBaslik = document.getElementById("authBaslik");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authSoruMetni = document.getElementById("authSoruMetni");

let isLoginMode = true; // true = Giriş Yap, false = Kayıt Ol

// Modalı aç
authModalAcBtn.addEventListener("click", () => {
  isLoginMode = true; // Her açıldığında varsayılan olarak "Giriş Yap" modunda başlasın
  authFormunuAyarla();
  authModali.style.display = "flex";
});

// Modalı kapat
authIptalBtn.addEventListener("click", () => {
  authModali.style.display = "none";
  authFormu.reset();
});

// Giriş <-> Kayıt Ol arası geçiş yap
authModDegistir.addEventListener("click", (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode; // Modu tam tersine çevir
  authFormunuAyarla();
});

function authFormunuAyarla() {
  if (isLoginMode) {
    authBaslik.innerText = "Giriş Yap";
    authSubmitBtn.innerText = "Giriş Yap";
    authSoruMetni.innerText = "Hesabınız yok mu?";
    authModDegistir.innerText = "Kayıt Ol";
  } else {
    authBaslik.innerText = "Kayıt Ol";
    authSubmitBtn.innerText = "Kayıt Ol";
    authSoruMetni.innerText = "Zaten hesabınız var mı?";
    authModDegistir.innerText = "Giriş Yap";
  }
}

// Form Gönderildiğinde (Giriş veya Kayıt)
authFormu.addEventListener("submit", async (e) => {
  e.preventDefault();
  const kullanici_adi = document.getElementById("kullanici_adi").value;
  const sifre = document.getElementById("sifre").value;

  // Hangi yola (endpoint) istek atacağımızı moda göre belirliyoruz
  const url = isLoginMode ? "/api/auth/login" : "/api/auth/register";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kullanici_adi, sifre }),
    });

    const veri = await response.json();

    if (!response.ok) {
      alert(veri.mesaj || "İşlem başarısız!");
      return;
    }

    if (isLoginMode) {
      // Giriş başarılıysa token'ı kasaya sakla
      localStorage.setItem("token", veri.token);
      authModali.style.display = "none";
      authFormu.reset();
      arayuzuGuncelle(); // Arayüzü admin moduna geçir
      medyalariGetir(); //Yeni kullanıcının verilerini getir
    } else {
      // Kayıt başarılıysa kullanıcıyı bilgilendir ve giriş moduna at
      alert("Kayıt başarılı! Lütfen şimdi giriş yapın.");
      isLoginMode = true;
      authFormunuAyarla();
      document.getElementById("sifre").value = ""; // Şifre kutusunu temizle
    }
  } catch (error) {
    console.error("Auth hatası:", error);
    alert("Sunucuya bağlanırken bir hata oluştu.");
  }
});

// Çıkış Yap İşlemi
cikisYapBtn.addEventListener("click", () => {
  localStorage.removeItem("token"); // Kasadaki bileti yırt
  arayuzuGuncelle(); // Arayüzü tekrar ziyaretçi moduna geçir
  medyalariGetir(); //Topluluk arşivini getir
});

// EKLEME/DÜZENLEME İŞLEMLERİ
const yeniEkleBtn = document.getElementById("yeniEkleBtn");
const eklemeModali = document.getElementById("eklemeModali");
const iptalBtn = document.getElementById("iptalBtn");
const eklemeFormu = document.getElementById("eklemeFormu");

yeniEkleBtn.addEventListener("click", () => {
  guncellenecekId = null;
  eklemeFormu.reset();
  document.querySelector("#eklemeModali .modal-icerik h2").innerText =
    "Yeni İçerik Ekle";
  eklemeModali.style.display = "flex";
});

iptalBtn.addEventListener("click", () => {
  eklemeModali.style.display = "none";
  eklemeFormu.reset();
});

eklemeFormu.addEventListener("submit", async (e) => {
  e.preventDefault();

  const medyaVerisi = {
    baslik: document.getElementById("baslik").value,
    tur: document.getElementById("tur").value,
    kategori: document.getElementById("kategori").value,
    durum: document.getElementById("durum").value,
    puan: document.getElementById("puan").value
      ? parseFloat(document.getElementById("puan").value)
      : 0,
    notlar: document.getElementById("notlar").value,
  };

  const url = guncellenecekId ? `/api/media/${guncellenecekId}` : "/api/media";
  const method = guncellenecekId ? "PUT" : "POST";
  const token = localStorage.getItem("token"); // Token'ı kasadan al

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // YENİ: Bekçiye token'ı gösteriyoruz
      },
      body: JSON.stringify(medyaVerisi),
    });

    if (response.status === 401 || response.status === 403) {
      alert(
        "Oturum süreniz dolmuş veya yetkiniz yok. Lütfen tekrar giriş yapın.",
      );
      localStorage.removeItem("token");
      arayuzuGuncelle();
      eklemeModali.style.display = "none";
      return;
    }

    if (!response.ok) throw new Error("İşlem başarısız oldu");

    eklemeModali.style.display = "none";
    eklemeFormu.reset();
    medyalariGetir();
  } catch (error) {
    console.error("Hata:", error);
    alert("Bir hata oluştu!");
  }
});

// SİLME İŞLEMLERİ
const silmeModali = document.getElementById("silmeModali");
const silmeIptalBtn = document.getElementById("silmeIptalBtn");
const silmeEvetBtn = document.getElementById("silmeEvetBtn");

silmeIptalBtn.addEventListener("click", () => {
  silmeModali.style.display = "none";
  silinecekId = null;
});

silmeEvetBtn.addEventListener("click", async () => {
  if (!silinecekId) return;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`/api/media/${silinecekId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // YENİ: Silme işlemi için de bekçiye token gösteriyoruz
      },
    });

    if (response.status === 401 || response.status === 403) {
      alert(
        "Oturum süreniz dolmuş veya yetkiniz yok. Lütfen tekrar giriş yapın.",
      );
      localStorage.removeItem("token");
      arayuzuGuncelle();
      silmeModali.style.display = "none";
      return;
    }

    if (!response.ok) throw new Error("Silme işlemi başarısız oldu");

    silmeModali.style.display = "none";
    silinecekId = null;
    medyalariGetir();
  } catch (error) {
    console.error("Hata:", error);
    alert("Kayıt silinirken bir hata oluştu!");
  }
});

// ÇOKLU SEÇİM VE FİLTRELEME MOTORU
const aramaInput = document.getElementById("aramaInput");
const turFiltre = document.getElementById("turFiltre");
const cokluSecimGosterge = document.getElementById("cokluSecimGosterge");
const cokluSecimListesi = document.getElementById("cokluSecimListesi");
const secilenTurlerMetni = document.getElementById("secilenTurlerMetni");
const checkboxes = document.querySelectorAll("#cokluSecimListesi input");

let secilenTurler = [];

cokluSecimGosterge.addEventListener("click", () => {
  const gorunurMu = cokluSecimListesi.style.display === "block";
  cokluSecimListesi.style.display = gorunurMu ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (!document.getElementById("cokluSecimKapsayici").contains(e.target)) {
    cokluSecimListesi.style.display = "none";
  }
});

checkboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    if (cb.checked) {
      secilenTurler.push(cb.value);
    } else {
      secilenTurler = secilenTurler.filter((t) => t !== cb.value);
    }

    if (secilenTurler.length === 0) {
      secilenTurlerMetni.innerText = "Tüm Türler";
    } else {
      secilenTurlerMetni.innerText = secilenTurler.join(", ");
    }

    filtreleriUygula();
  });
});

const filtreleriUygula = () => {
  const arananKelime = aramaInput.value.toLowerCase();
  const secilenKategori = turFiltre.value;

  const kartlar = document.querySelectorAll(".medya-kart");

  kartlar.forEach((kart) => {
    const baslik = kart.querySelector("h3").innerText.toLowerCase();
    const kategoriMetni = kart.querySelectorAll("p")[0].innerText;
    const altTurMetni = kart.querySelectorAll("p")[1].innerText;

    const baslikEslesti = baslik.includes(arananKelime);
    const kategoriEslesti =
      secilenKategori === "Hepsi" || kategoriMetni.includes(secilenKategori);

    let turEslesti = false;
    if (secilenTurler.length === 0) {
      turEslesti = true;
    } else {
      turEslesti = secilenTurler.some((tur) => altTurMetni.includes(tur));
    }

    if (baslikEslesti && kategoriEslesti && turEslesti) {
      kart.style.display = "flex";
    } else {
      kart.style.display = "none";
    }
  });
};

aramaInput.addEventListener("input", filtreleriUygula);
turFiltre.addEventListener("change", filtreleriUygula);
