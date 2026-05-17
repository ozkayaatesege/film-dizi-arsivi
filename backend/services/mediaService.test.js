const mediaService=require('./mediaService');

describe('MediaService İş Mantığı Testleri',()=>{

    //1. TEST
    test('Film/Dizi puanı 10 dan büyük girildiğinde sistem hata fırlatmalı',async()=>{
        //Test amaçlı puanı 15 olan hatalı bir veri girişi yapıyoruz
        const hataliVeri={
            baslik:'Matrix',
            tur:'Film',
            puan:15
        };
        const sahteUserID=1;
        try{
            await mediaService.addMedia(hataliVeri,sahteUserID);
        }catch(error){
            expect(error.mesaj).toBe('Puan 0 ile 10 arasında olmalıdır.');
            expect(error.status).toBe(400);
        }
    });

    //2. TEST
    test('Film/Dizi başlığı boş gönderildiğinde sistem kaydı reddetmeli', async () => {
        const hataliVeri = { 
            baslik: '', // HATA BURADA: Başlık bilerek boş bırakıldı
            tur: 'Dizi', 
            puan: 8 
        };
        const sahteUserId = 1;

        try {
            await mediaService.addMedia(hataliVeri, sahteUserId);
        } catch (error) {
            expect(error.mesaj).toBe('Film veya dizi başlığı boş bırakılamaz.');
            expect(error.status).toBe(400);
        }
    });

        //3. TEST
    test('Durumu İzlenecek olan bir filme puan girilirse sistem reddetmeli', async () => {
        const hataliVeri = { 
            baslik: 'Interstellar', 
            tur: 'Film', 
            durum: 'İzlenecek', 
            puan: 9 // HATA BURADA: İzlenmemiş filme puan verilmiş
        };
        try {
            await mediaService.addMedia(hataliVeri, 1);
        } catch (error) {
            expect(error.mesaj).toBe('Henüz izlemediğiniz bir yapıma puan veremezsiniz.');
            expect(error.status).toBe(400);
        }
    });
});