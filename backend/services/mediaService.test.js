const mediaService = require('./mediaService');

describe('MediaService İş Mantığı Testleri', () => {

    // 1. TEST
    test('Film/Dizi puanı 10 dan büyük girildiğinde sistem hata fırlatmalı', async () => {
        // Test amaçlı puanı 15 olan hatalı bir veri girişi yapıyoruz
        const hataliVeri = {
            baslik: 'Matrix',
            tur: 'Film',
            puan: 15
        };
        await expect(
            mediaService.addMedia(hataliVeri, 1)
        ).rejects.toMatchObject({
            mesaj: 'Puan 0 ile 10 arasında olmalı.',
            status: 400
        });
    });

    // 2. TEST
    test('Film/Dizi başlığı boş gönderildiğinde sistem kaydı reddetmeli', async () => {
        const hataliVeri = {
            baslik: '', // HATA BURADA: Başlık bilerek boş bırakıldı
            tur: 'Dizi',
            puan: 8
        };
        await expect(
            mediaService.addMedia(hataliVeri, 1)
        ).rejects.toMatchObject({
            mesaj: 'Film veya Dizi başlığı boş bırakılmaz.',
            status: 400
        });
    });

    // 3. TEST
    test('Durumu İzlenecek olan bir filme puan girilirse sistem reddetmeli', async () => {
        const hataliVeri = {
            baslik: 'Interstellar',
            tur: 'Film',
            durum: 'İzlenecek',
            puan: 9 // HATA BURADA: İzlenmemiş filme puan verilmiş
        };
        await expect(
            mediaService.addMedia(hataliVeri, 1)
        ).rejects.toMatchObject({
            mesaj: 'Henüz izlemediğiniz bir yapıma puan veremezsiniz.',
            status: 400
        });
    });
});