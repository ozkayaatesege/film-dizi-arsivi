let guncellenecekId = null; 
let silinecekId = null; // Silinecek filmin ID'sini hafızada tutmak için yeni değişken

document.addEventListener('DOMContentLoaded', () => {
    medyalariGetir();
});

async function medyalariGetir() {
    const kapsayici = document.getElementById('listeKapsayici');

    try {
        const response = await fetch('/api/media');
        if (!response.ok) throw new Error('Veriler çekilemedi');
        const veriler = await response.json();

        if (veriler.length === 0) {
            kapsayici.innerHTML = '<p>Arşive henüz bir kayıt bulunmuyor</p>';
            return;
        }

        kapsayici.innerHTML = '';

        veriler.forEach(medya => {
            const kart = document.createElement('div');
            kart.className = 'medya-kart';
            
            let puanVeNotGosterimi = '';
            if (medya.durum !== 'İzlenecek') {
                puanVeNotGosterimi = `
                    <p><strong>Puan:</strong> ${medya.puan}/10</p>
                    <p><strong>Not:</strong> ${medya.notlar || 'Not yok.'}</p>
                `;
            }

            kart.innerHTML = `
                <h3>${medya.baslik}</h3>
                <p><strong>Tür:</strong> ${medya.tur}</p>
                <p><strong>Kategori:</strong> ${medya.kategori || 'Belirtilmedi'}</p>
                <p><strong>Durum:</strong> ${medya.durum}</p>
                ${puanVeNotGosterimi}
                <div class="kart-butonlar">
                    <button class="btn-duzenle">Düzenle</button>
                    <button class="btn-sil">Sil</button>
                </div>
            `;
            
            // DÜZENLE BUTONU İŞLEMLERİ 
            const duzenleBtn = kart.querySelector('.btn-duzenle');
            duzenleBtn.addEventListener('click', () => {
                guncellenecekId = medya.id; 
                
                document.getElementById('baslik').value = medya.baslik;
                document.getElementById('tur').value = medya.tur;
                document.getElementById('kategori').value = medya.kategori || '';
                document.getElementById('durum').value = medya.durum;
                document.getElementById('puan').value = medya.puan || '';
                document.getElementById('notlar').value = medya.notlar || '';
                
                document.querySelector('.modal-icerik h2').innerText = 'İçeriği Düzenle';
                eklemeModali.style.display = 'flex';
            });

            // --- YENİ: ÖZEL SİLME MODALINI AÇMA İŞLEMLERİ ---
            const silBtn = kart.querySelector('.btn-sil');
            silBtn.addEventListener('click', () => {
                silinecekId = medya.id; // Hangi filmin silineceğini hafızaya al
                
                // Türüne göre doğru ek eki ayarla (film-ini, dizi-sini, belgesel-ini)
                let turEki = 'yapımını';
                if (medya.tur === 'Film') turEki = 'filmini';
                if (medya.tur === 'Dizi') turEki = 'dizisini';
                if (medya.tur === 'Belgesel') turEki = 'belgeselini';

                // Modalın içindeki yazıyı dinamik olarak oluştur
                document.getElementById('silmeMetni').innerHTML = `<strong>${medya.baslik}</strong> ${turEki} arşivden tamamen silmek istediğinize emin misiniz?`;
                
                // Modalı görünür yap
                document.getElementById('silmeModali').style.display = 'flex';
            });

            kapsayici.appendChild(kart);
        });

    } catch (error) {
        console.error("Hata:", error);
        kapsayici.innerHTML = '<p style="color: red;">Veriler yüklenirken bir sorun oluştu.</p>';
    }
}

// --- EKLEME/DÜZENLEME MODALI BİLEŞENLERİ ---
const yeniEkleBtn = document.getElementById('yeniEkleBtn');
const eklemeModali = document.getElementById('eklemeModali');
const iptalBtn = document.getElementById('iptalBtn');
const eklemeFormu = document.getElementById('eklemeFormu');

yeniEkleBtn.addEventListener('click', () => {
    guncellenecekId = null; 
    eklemeFormu.reset();
    document.querySelector('#eklemeModali .modal-icerik h2').innerText = 'Yeni İçerik Ekle';
    eklemeModali.style.display = 'flex';
});

iptalBtn.addEventListener('click', () => {
    eklemeModali.style.display = 'none';
    eklemeFormu.reset();
});

eklemeFormu.addEventListener('submit', async (e) => {
    e.preventDefault();

    const medyaVerisi = {
        baslik: document.getElementById('baslik').value,
        tur: document.getElementById('tur').value,
        kategori: document.getElementById('kategori').value,
        durum: document.getElementById('durum').value,
        puan: document.getElementById('puan').value ? parseFloat(document.getElementById('puan').value) : 0,
        notlar: document.getElementById('notlar').value,
    };
    
    const url = guncellenecekId ? `/api/media/${guncellenecekId}` : '/api/media';
    const method = guncellenecekId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medyaVerisi)
        });
        
        if (!response.ok) throw new Error('İşlem başarısız oldu');

        eklemeModali.style.display = 'none';    
        eklemeFormu.reset();                    
        medyalariGetir();                       

    } catch (error) {
        console.error("Hata:", error);
        alert("Bir hata oluştu!");
    }
});

// SİLME ONAY MODALI BİLEŞENLERİ VE İŞLEMLERİ
const silmeModali = document.getElementById('silmeModali');
const silmeIptalBtn = document.getElementById('silmeIptalBtn');
const silmeEvetBtn = document.getElementById('silmeEvetBtn');

// İptale basılırsa sadece pencereyi kapat
silmeIptalBtn.addEventListener('click', () => {
    silmeModali.style.display = 'none';
    silinecekId = null; 
});

// Evet, Sil butonuna basılırsa işlemi gerçekleştir
silmeEvetBtn.addEventListener('click', async () => {
    if (!silinecekId) return;

    try {
        const response = await fetch(`/api/media/${silinecekId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Silme işlemi başarısız oldu');
        
        // Başarılıysa modalı kapat ve listeyi yenile
        silmeModali.style.display = 'none';
        silinecekId = null;
        medyalariGetir(); 
    } catch (error) {
        console.error("Hata:", error);
        alert("Kayıt silinirken bir hata oluştu!");
    }
});

const aramaInput = document.getElementById('aramaInput');
const turFiltre = document.getElementById('turFiltre');
const cokluSecimGosterge = document.getElementById('cokluSecimGosterge');
const cokluSecimListesi = document.getElementById('cokluSecimListesi');
const secilenTurlerMetni = document.getElementById('secilenTurlerMetni');
const checkboxes = document.querySelectorAll('#cokluSecimListesi input');

let secilenTurler = [];

// Kutuyu aç/kapat
cokluSecimGosterge.addEventListener('click', () => {
    const gorunurMu = cokluSecimListesi.style.display === 'block';
    cokluSecimListesi.style.display = gorunurMu ? 'none' : 'block';
});

// Kutunun dışına tıklandığında listeyi kapat
document.addEventListener('click', (e) => {
    if (!document.getElementById('cokluSecimKapsayici').contains(e.target)) {
        cokluSecimListesi.style.display = 'none';
    }
});

// Herhangi bir tür seçildiğinde/çıkarıldığında
checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        // Seçilenleri diziye ekle/çıkar
        if (cb.checked) {
            secilenTurler.push(cb.value);
        } else {
            secilenTurler = secilenTurler.filter(t => t !== cb.value);
        }

        // Kutunun içindeki yazıyı güncelle
        if (secilenTurler.length === 0) {
            secilenTurlerMetni.innerText = "Tüm Türler";
        } else {
            secilenTurlerMetni.innerText = secilenTurler.join(', ');
        }

        filtreleriUygula();
    });
});

const filtreleriUygula = () => {
    const arananKelime = aramaInput.value.toLowerCase();
    const secilenKategori = turFiltre.value;

    const kartlar = document.querySelectorAll('.medya-kart');

    kartlar.forEach(kart => {
        const baslik = kart.querySelector('h3').innerText.toLowerCase();
        const kategoriMetni = kart.querySelectorAll('p')[0].innerText; // Film/Dizi bilgisi
        const altTurMetni = kart.querySelectorAll('p')[1].innerText;   // Aksiyon/Dram bilgisi

        // İsim
        const baslikEslesti = baslik.includes(arananKelime);
        
        // Ana Kategori (Film/Dizi)
        const kategoriEslesti = (secilenKategori === 'Hepsi' || kategoriMetni.includes(secilenKategori));

        // Çoklu Tür Kontrolü (OR mantığı - Seçilenlerden herhangi birini içeriyor mu?)
        let turEslesti = false;
        if (secilenTurler.length === 0) {
            turEslesti = true; 
        } else {
            // Eğer kartın üzerindeki tür metni, seçtiğimiz türlerden herhangi birini içeriyorsa true döner
            turEslesti = secilenTurler.some(tur => altTurMetni.includes(tur));
        }

        if (baslikEslesti && kategoriEslesti && turEslesti) {
            kart.style.display = 'flex';
        } else {
            kart.style.display = 'none';
        }
    });
};

// Arama ve Kategori filtrelerini de motoru bağla
aramaInput.addEventListener('input', filtreleriUygula);
turFiltre.addEventListener('change', filtreleriUygula);