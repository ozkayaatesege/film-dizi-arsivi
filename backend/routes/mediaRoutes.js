const express=require('express');
const router=express.Router();
const mediaController=require('../controllers/mediaController');

//GET: '/api/media' adresine bir istek gelirse işi doğrudan Controller'daki getAllMedia fonksiyonuna devret
router.get('/',mediaController.getAllMedia);

module.exports=router;