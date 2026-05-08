const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const jwtInterceptor = require('../security/jwtInterceptor');

/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       required:
 *         - baslik
 *         - tur
 *       properties:
 *         id:
 *           type: integer
 *           description: Otomatik atanan ID
 *         baslik:
 *           type: string
 *           description: Film veya dizinin adı
 *         tur:
 *           type: string
 *           description: Medya türü (Film, Dizi, Belgesel)
 *         kategori:
 *           type: string
 *           description: Tür (Örn. Aksiyon, Mühendislik, Dram)
 *         durum:
 *           type: string
 *           description: İzlenme durumu (İzlendi, İzlenecek)
 *         puan:
 *           type: integer
 *           description: 1-10 arası puan
 *         notlar:
 *           type: string
 *           description: Kişisel yorumlar
 */

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Tüm medya listesini getirir
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: Başarılı liste döndü
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 */
router.get('/', mediaController.getAllMedia);

/**
 * @swagger
 * /api/media:
 *   post:
 *     summary: Yeni bir film veya dizi ekler
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Media'
 *     responses:
 *       201:
 *         description: Başarıyla oluşturuldu
 *       400:
 *         description: Eksik parametre hatası
 */
router.post('/', jwtInterceptor, mediaController.addMedia);

/**
 * @swagger
 * /api/media/{id}:
 *   put:
 *     summary: Mevcut bir filmi veya diziyi günceller
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Güncellenecek medyanın ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Media'
 *     responses:
 *       200:
 *         description: Kayıt başarıyla güncellendi
 *       404:
 *         description: Güncellenecek kayıt bulunamadı
 */
router.put('/:id', jwtInterceptor, mediaController.updateMedia);

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Bir filmi veya diziyi siler
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Silinecek medyanın ID'si
 *     responses:
 *       200:
 *         description: Kayıt başarıyla silindi
 *       404:
 *         description: Silinecek kayıt bulunamadı
 */
router.delete('/:id', jwtInterceptor, mediaController.deleteMedia);

module.exports = router;