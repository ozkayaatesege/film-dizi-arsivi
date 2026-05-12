class Model{
    constructor(id,kullanici_id,baslik,tur,kategori,durum,puan,notlar){
        this.id = id;
        this.kullanici_id = kullanici_id; // Bu filmin sahibinin ID'si
        this.baslik = baslik;
        this.tur = tur;             // Film veya Dizi
        this.kategori = kategori;   // Aksiyon, Komedi vs.
        this.durum = durum;         // İzlenecek, İzlendi vs.
        this.puan = puan;           // 1-10 arası
        this.notlar = notlar;       //Kişisel yorumlar
    }
}

module.exports=Media;