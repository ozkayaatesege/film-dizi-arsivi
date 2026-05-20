let guncellenecekId = null;  //Düzenlenecek filmin id'si tutuluyor
let silinecekId = null;      //Silinecek filmin'in id'si tutuluyor

// Uygulamada filtrelemede ve eklemede kullanılan sabit kategoriler
const GECERLI_KATEGORILER = [
  'Aksiyon', 'Macera', 'Dram', 'Komedi', 'Suç', 'Gerilim',
  'Gizem', 'Fantastik', 'Bilim Kurgu', 'Animasyon', 'Belgesel', 'Müzikal'
];

document.addEventListener("DOMContentLoaded", () => {
  setupModalCategories(); // Sayfa yüklendiğinde modal içindeki açılır menüyü kur
  medyalariGetir();
});

// MODAL İÇİ KATEGORİ AÇILIR MENÜSÜNÜ KURAN FONKSİYON
function setupModalCategories() {
  const listesi = document.getElementById('modalCokluSecimListesi');
  if (!listesi) return;

  listesi.innerHTML = '';
  
  // Checkboxları oluştur ve karanlık temaya uygun stillendir
  GECERLI_KATEGORILER.forEach(kategori => {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.padding = '8px 10px';
      label.style.margin = '0';
      label.style.cursor = 'pointer';
      label.style.borderBottom = '1px solid #3a3a3a'; // Alt çizgi detayı
      
      label.innerHTML = `<input type="checkbox" value="${kategori}" class="modal-kategori-cb" style="margin-right:10px;"> ${kategori}`;
      
      // Üzerine gelince hafif renk değişimi (Hover)
      label.addEventListener('mouseenter', () => label.style.backgroundColor = '#383838');
      label.addEventListener('mouseleave', () => label.style.backgroundColor = 'transparent');
      
      listesi.appendChild(label);
  });

  // Açılır menüyü açma/kapama
  const gosterge = document.getElementById('modalCokluSecimGosterge');
  gosterge.addEventListener('click', (e) => {
      e.stopPropagation();
      const gorunurMu = listesi.style.display === "block";
      listesi.style.display = gorunurMu ? "none" : "block";
  });

  // Checkbox'lar seçildikçe metni ve gizli inputu güncelle
  const checkboxes = document.querySelectorAll('.modal-kategori-cb');
  const metin = document.getElementById('modalSecilenKategorilerMetni');
  const hiddenInput = document.getElementById('kategoriHiddenValue');

  checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
          const secilenler = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);
          hiddenInput.value = secilenler.join(', ');
          metin.innerText = secilenler.length > 0 ? secilenler.join(', ') : 'Seçiniz...';
      });
  });

  // Boşluğa tıklayınca menüyü kapat
  document.addEventListener("click", (e) => {
      const kapsayici = document.getElementById("modalKategoriKapsayici");
      if (kapsayici && !kapsayici.contains(e.target)) {
          listesi.style.display = "none";
      }
  });
}

// BİLDİRİM MODALI 
function mesajGoster(mesaj, tip = "hata") {
  const eskiModal = document.getElementById("bildirimModali");
  if (eskiModal) eskiModal.remove();

  const renkler = {
    hata:   { baslik: "Bir Sorun Oluştu", buton: "#e53e3e", butonHover: "#c53030" },
    basari: { baslik: "İşlem Başarılı",   buton: "#38a169", butonHover: "#2f855a" },
    bilgi:  { baslik: "Bilgi",            buton: "#3182ce", butonHover: "#2b6cb0" },
  };

  const r = renkler[tip] || renkler.hata;

  const modal = document.createElement("div");
  modal.id = "bildirimModali";
  modal.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  `;

  modal.innerHTML = `
    <div style="
      background: #1a1a2e;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 32px 28px;
      max-width: 420px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    ">
      <h2 style="color: #f0c040; margin: 0 0 16px; font-size: 1.3rem;">${r.baslik}</h2>
      <p style="color: #ccc; margin: 0 0 24px; line-height: 1.5;">${mesaj}</p>
      <button id="bildirimKapatBtn" style="
        background: ${r.buton};
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 32px;
        font-size: 1rem;
        cursor: pointer;
        width: 100%;
      ">Tamam</button>
    </div>
  `;

  document.body.appendChild(modal);

  const kapatBtn = document.getElementById("bildirimKapatBtn");
  kapatBtn.addEventListener("click", () => modal.remove());
  kapatBtn.addEventListener("mouseenter", () => kapatBtn.style.background = r.butonHover);
  kapatBtn.addEventListener("mouseleave", () => kapatBtn.style.background = r.buton);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ARAYÜZ YETKİ KONTROL MOTORU
function arayuzuGuncelle() {
  const token = localStorage.getItem("token");
  const kartButonGruptari = document.querySelectorAll(".kart-butonlar");

  const yeniEkleBtn = document.getElementById("yeniEkleBtn");
  const authModalAcBtn = document.getElementById("authModalAcBtn");
  const cikisYapBtn = document.getElementById("cikisYapBtn");
  const durumFiltreKapsayici = document.getElementById("durumFiltreKapsayici");

  if (token) {
    yeniEkleBtn.style.display = "block";
    cikisYapBtn.style.display = "block";
    authModalAcBtn.style.display = "none";
    if (durumFiltreKapsayici) durumFiltreKapsayici.style.display = "flex";
    kartButonGruptari.forEach((grup) => (grup.style.display = "flex"));
  } else {
    yeniEkleBtn.style.display = "none";
    cikisYapBtn.style.display = "none";
    authModalAcBtn.style.display = "block";
    if (durumFiltreKapsayici) durumFiltreKapsayici.style.display = "none";
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
      kapsayici.innerHTML = "<p>Arşivde henüz bir kayıt bulunmuyor</p>";
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
        
        // Sadece giriş yapmış kullanıcı kendi arşivine bakıyorsa notu görsün
        if (token) {
          notGosterimi = `<p><strong>Not:</strong> ${medya.notlar || 'Not yok.'}</p>`;
        }
        
        // Puan null, 0 veya boşsa şık bir metin göster
        let puanMetni = '';
        if (medya.puan === null || medya.puan === 0 || medya.puan === "null") {
            puanMetni = 'Henüz puanlanmadı';
        } else {
            puanMetni = `${medya.puan}/10`;
        }

        puanVeNotGosterimi = `
          <p><strong>Puan:</strong> ${puanMetni}</p>
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
        document.getElementById("durum").value = medya.durum;
        document.getElementById("puan").value = medya.puan || "";
        document.getElementById("notlar").value = medya.notlar || "";

        // Seçili kategorileri açılır menüye işle (Checkbox mantığı)
        const mevcutKategoriler = (medya.kategori || "").split(',').map(k => k.trim()).filter(k => k);
        const hiddenInput = document.getElementById("kategoriHiddenValue");
        const seciliMetin = document.getElementById("modalSecilenKategorilerMetni");
        
        if (hiddenInput) hiddenInput.value = mevcutKategoriler.join(', ');
        if (seciliMetin) seciliMetin.innerText = mevcutKategoriler.length > 0 ? mevcutKategoriler.join(', ') : "Kategori Seçin";
        
        document.querySelectorAll('.modal-kategori-cb').forEach(cb => {
            cb.checked = mevcutKategoriler.includes(cb.value);
        });

        document.querySelector("#eklemeModali .modal-icerik h2").innerText = "İçeriği Düzenle";
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

let isLoginMode = true; 

authModalAcBtn.addEventListener("click", () => {
  isLoginMode = true; 
  authFormunuAyarla();
  authModali.style.display = "flex";
});

authIptalBtn.addEventListener("click", () => {
  authModali.style.display = "none";
  authFormu.reset();
});

authModDegistir.addEventListener("click", (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode; 
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

authFormu.addEventListener("submit", async (e) => {
  e.preventDefault();
  const kullanici_adi = document.getElementById("kullanici_adi").value;
  const sifre = document.getElementById("sifre").value;

  const url = isLoginMode ? "/api/auth/login" : "/api/auth/register";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kullanici_adi, sifre }),
    });

    const veri = await response.json();

    if (!response.ok) {
      mesajGoster(veri.mesaj || "İşlem başarısız!", "hata");
      return;
    }

    if (isLoginMode) {
      localStorage.setItem("token", veri.token);
      authModali.style.display = "none";
      authFormu.reset();
      arayuzuGuncelle(); 
      medyalariGetir(); 
    } else {
      mesajGoster("Kayıt başarılı! Lütfen şimdi giriş yapın.", "basari");
      isLoginMode = true;
      authFormunuAyarla();
      document.getElementById("sifre").value = ""; 
    }
  } catch (error) {
    console.error("Auth hatası:", error);
    mesajGoster("Sunucuya bağlanırken bir hata oluştu.", "hata");
  }
});

cikisYapBtn.addEventListener("click", () => {
  localStorage.removeItem("token"); 
  arayuzuGuncelle(); 
  medyalariGetir(); 
});

// EKLEME/DÜZENLEME İŞLEMLERİ
const yeniEkleBtn = document.getElementById("yeniEkleBtn");
const eklemeModali = document.getElementById("eklemeModali");
const iptalBtn = document.getElementById("iptalBtn");
const eklemeFormu = document.getElementById("eklemeFormu");

yeniEkleBtn.addEventListener("click", () => {
  guncellenecekId = null;
  eklemeFormu.reset();

  // Modal açılırken kategorileri sıfırla (Checkbox mantığı)
  const hiddenInput = document.getElementById("kategoriHiddenValue");
  if(hiddenInput) hiddenInput.value = "";
  
  const seciliMetin = document.getElementById("modalSecilenKategorilerMetni");
  if(seciliMetin) seciliMetin.innerText = "Kategori Seçin";
  
  document.querySelectorAll('.modal-kategori-cb').forEach(cb => cb.checked = false);
  
  document.querySelector("#eklemeModali .modal-icerik h2").innerText = "Yeni İçerik Ekle";
  eklemeModali.style.display = "flex";
});

iptalBtn.addEventListener("click", () => {
  eklemeModali.style.display = "none";
  eklemeFormu.reset();
});

eklemeFormu.addEventListener("submit", async (e) => {
  e.preventDefault();

  // BAŞLIK FORMATLAMA ALGORİTMASI
  const hamBaslik = document.getElementById("baslik").value;
  const duzeltilmisBaslik = hamBaslik
    .trim() // Başındaki ve sonundaki gereksiz boşlukları siler
    .toLowerCase() // Önce her şeyi küçük harfe çevirir (senin mantık)
    .split(/\s+/) // Kelimeleri boşluklardan ayırır (fazla boşlukları da tekler)
    .map(kelime => kelime.charAt(0).toUpperCase() + kelime.slice(1)) // Her kelimenin ilk harfini büyütür
    .join(' '); // Kelimeleri tekrar aralarına tek boşluk koyarak birleştirir

  const medyaVerisi = {
    baslik: duzeltilmisBaslik, // Artık düzeltilmiş jilet gibi başlığı gönderiyoruz
    tur: document.getElementById("tur").value,
    kategori: document.getElementById("kategoriHiddenValue").value, 
    durum: document.getElementById("durum").value,
    puan: document.getElementById("puan").value
      ? parseFloat(document.getElementById("puan").value)
      : 0,
    notlar: document.getElementById("notlar").value,
  };

  const url = guncellenecekId ? `/api/media/${guncellenecekId}` : "/api/media";
  const method = guncellenecekId ? "PUT" : "POST";
  const token = localStorage.getItem("token"); 

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(medyaVerisi),
    });

    if (response.status === 401 || response.status === 403) {
      mesajGoster(
        "Oturum süreniz dolmuş veya yetkiniz yok. Lütfen tekrar giriş yapın.",
        "hata"
      );
      localStorage.removeItem("token");
      arayuzuGuncelle();
      eklemeModali.style.display = "none";
      return;
    }

    const veri = await response.json();

    if (!response.ok) {
      mesajGoster(veri.mesaj || "İşlem başarısız oldu.", "hata");
      return;
    }

    eklemeModali.style.display = "none";
    eklemeFormu.reset();

    if (guncellenecekId) {
      mesajGoster("Değişiklikleriniz başarıyla kaydedildi.", "basari");
    } else {
      mesajGoster("İçerik arşive başarıyla eklendi!", "basari");
    }

    medyalariGetir();
  } catch (error) {
    console.error("Hata:", error);
    mesajGoster("Bir hata oluştu!", "hata");
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
        Authorization: `Bearer ${token}`, 
      },
    });

    if (response.status === 401 || response.status === 403) {
      mesajGoster(
        "Oturum süreniz dolmuş veya yetkiniz yok. Lütfen tekrar giriş yapın.",
        "hata"
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
    mesajGoster("Kayıt silinirken bir hata oluştu!", "hata");
  }
});

// ÇOKLU SEÇİM VE FİLTRELEME MOTORU (Ana Ekrandaki Filtreler)
const aramaInput = document.getElementById("aramaInput");
const turFiltre = document.getElementById("turFiltre");
const cokluSecimGosterge = document.getElementById("cokluSecimGosterge");
const cokluSecimListesi = document.getElementById("cokluSecimListesi");
const secilenTurlerMetni = document.getElementById("secilenTurlerMetni");
const checkboxes = document.querySelectorAll("#cokluSecimListesi input");

let secilenTurler = [];

if (cokluSecimGosterge && cokluSecimListesi) {
  cokluSecimGosterge.addEventListener("click", () => {
    const gorunurMu = cokluSecimListesi.style.display === "block";
    cokluSecimListesi.style.display = gorunurMu ? "none" : "block";
  });
}

document.addEventListener("click", (e) => {
  const cokluKapsayici = document.getElementById("cokluSecimKapsayici");
  if (cokluKapsayici && cokluSecimListesi && !cokluKapsayici.contains(e.target)) {
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
      if (secilenTurlerMetni) secilenTurlerMetni.innerText = "Tüm Türler";
    } else {
      if (secilenTurlerMetni) secilenTurlerMetni.innerText = secilenTurler.join(", ");
    }

    filtreleriUygula();
  });
});

const durumHaplari = document.querySelectorAll(".durum-hap");
let secilenDurum = "Hepsi"; 

durumHaplari.forEach((hap) => {
  hap.addEventListener("click", () => {
    durumHaplari.forEach((h) => h.classList.remove("aktif"));
    hap.classList.add("aktif");
    secilenDurum = hap.getAttribute("data-durum");
    filtreleriUygula();
  });
});

// ANA FİLTRELEME FONKSİYONU
const filtreleriUygula = () => {
  const arananKelime = aramaInput ? aramaInput.value.toLocaleLowerCase('tr-TR') : "";
  const secilenKategori = turFiltre ? turFiltre.value : "Hepsi";

  const kartlar = document.querySelectorAll(".medya-kart");

  kartlar.forEach((kart) => {
    const baslik = kart.querySelector("h3").innerText.toLocaleLowerCase('tr-TR');

    const pEtiketleri = kart.querySelectorAll("p");
    const kategoriMetni = pEtiketleri[0] ? pEtiketleri[0].innerText : "";
    const altTurMetni = pEtiketleri[1] ? pEtiketleri[1].innerText : ""; 
    const durumMetni = pEtiketleri[2] ? pEtiketleri[2].innerText : ""; 

    const baslikEslesti = baslik.includes(arananKelime);
    const kategoriEslesti = secilenKategori === "Hepsi" || kategoriMetni.includes(secilenKategori);

    let turEslesti = false;
    if (secilenTurler.length === 0) {
      turEslesti = true;
    } else {
      turEslesti = secilenTurler.some((tur) => altTurMetni.includes(tur));
    }

    const durumEslesti = secilenDurum === "Hepsi" || durumMetni.includes(secilenDurum);

    if (baslikEslesti && kategoriEslesti && turEslesti && durumEslesti) {
      kart.style.display = "flex";
    } else {
      kart.style.display = "none";
    }
  });
};

if (aramaInput) aramaInput.addEventListener("input", filtreleriUygula);
if (turFiltre) turFiltre.addEventListener("change", filtreleriUygula);