const authService = require('../services/authService');

// Unit Test: Auth Service (Tüm testleri kapsayan ana blok)
describe('Auth Service İş Mantığı Testleri', () => {

    // 1. TEST
    test('Şifre 6 karakterden kısa olduğunda hata dönmeli', async () => {
        await expect(
            authService.register('test_user', '12345')
        ).rejects.toMatchObject({
            mesaj: 'Şifre en az 6 karakterden oluşmalı.',
            status: 400
        });
    });

    // 2. TEST
    test('Veritabanında olmayan bir kullanıcıyla giriş yapılmaya çalışıldığında 404 hatası dönmeli', async () => {
        await expect(
            // Olmayan bir kullanıcı adı giriyoruz
            authService.login('kesinlikle_olmayan_bir_kullanici', 'sifre123')
        ).rejects.toMatchObject({
            mesaj: 'Kullanıcı adı veya şifreniz yanlış.',
            status: 404
        });
    });

    // 3. TEST
    test('Kullanıcı adı veya şifre boş gönderildiğinde 400 hatası dönmeli', async () => {
        await expect(
            authService.register('yeni_kullanici', '')
        ).rejects.toMatchObject({
            mesaj: 'Kullanıcı adı ve şifre boş bırakılamaz.',
            status: 400
        });
    });

    // 4. TEST
    test('Şifre sadece sayı veya sadece harf içerdiğinde 400 hatası dönmeli', async () => {
        // Senaryo 1: Sadece harf var, rakam yok
        await expect(
            authService.register('test_user', 'sadeceHarfler')
        ).rejects.toMatchObject({
            mesaj: 'Şifreniz en az bir harf ve en az bir rakam içermelidir.',
            status: 400
        });

        // Senaryo 2: Sadece rakam var, harf yok
        await expect(
            authService.register('test_user_2', '12345678')
        ).rejects.toMatchObject({
            mesaj: 'Şifreniz en az bir harf ve en az bir rakam içermelidir.',
            status: 400
        });
    });
});