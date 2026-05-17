const authService = require('./authService');

// Unit Test: Auth Service (Tüm testleri kapsayan ana blok)
describe('Auth Service İş Mantığı Testleri', () => {
    
    // 1. TEST
    test('Şifre 6 karakterden kısa olduğunda hata dönmeli', async () => {
        try {
            await authService.register('test_user', '12345');
        } catch (error) {
            expect(error.mesaj).toBe('Şifre en az 6 karakter içermelidir.');
            expect(error.status).toBe(400);
        }
    });

    // 2. TEST
    test('Veritabanında olmayan bir kullanıcıyla giriş yapılmaya çalışıldığında 404 hatası dönmeli', async () => {
        try {
            // Kafadan sallama, kesinlikle olmayan bir kullanıcı adı giriyoruz
            await authService.login('kesinlikle_olmayan_bir_kullanici', 'sifre123');
        } catch (error) {
            expect(error.mesaj).toBe('Böyle bir kullanıcı bulunamadı.');
            expect(error.status).toBe(404);
        }
    });

    // 3. TEST 
    test('Kullanıcı adı veya şifre boş gönderildiğinde 400 hatası dönmeli', async () => {
        try {
            await authService.register('yeni_kullanici', '');
        } catch (error) {
            expect(error.mesaj).toBe('Kullanıcı adı ve şifre boş bırakılamaz.');
            expect(error.status).toBe(400);
        }
    });

    //4. TEST
    test('Şifre sadece sayı veya sadece harf içerdiğinde 400 hatası dönmeli', async () => {
        // Senaryo 1: Sadece harf var, rakam yok
        try {
            await authService.register('test_user', 'sadeceHarfler');
        } catch (error) {
            expect(error.mesaj).toBe('Şifreniz en az bir harf ve en az bir rakam içermelidir.');
            expect(error.status).toBe(400);
        }

        // Senaryo 2: Sadece rakam var, harf yok
        try {
            await authService.register('test_user_2', '12345678');
        } catch (error) {
            expect(error.mesaj).toBe('Şifreniz en az bir harf ve en az bir rakam içermelidir.');
            expect(error.status).toBe(400);
        }
    });
});