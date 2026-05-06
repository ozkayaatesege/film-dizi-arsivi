const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

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
router.post('/', mediaController.addMedia);

module.exports = router;