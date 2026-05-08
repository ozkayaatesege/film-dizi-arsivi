const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Kullanıcı kayıt ve giriş işlemleri
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı oluşturur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kullanici_adi:
 *                 type: string
 *               sifre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kayıt başarılı
 *       400:
 *         description: Kullanıcı adı zaten alınmış veya eksik bilgi
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi yapar ve JWT Token döndürür
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kullanici_adi:
 *                 type: string
 *               sifre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı, token döndürüldü
 *       401:
 *         description: Hatalı şifre
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.post('/login', authController.login);

module.exports = router;