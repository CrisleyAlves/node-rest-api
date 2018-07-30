const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../jwt/check-auth");
const productController = require("../controllers/products");

//sempre quando uma nova imagem for ser salva, as funções serão executadas
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/') //cb -> callback
    },
    filename: function(req, file, cb){
        cb(null, file.originalname); //cb -> callback
    }
})

const fileFilter = (req, file, cb) =>{    
    //salva o arquivo
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        // ignora o arquivo e não salva
        cb(null, false);
    }    
}

const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 2 // até 2 MB
    },
    fileFilter: fileFilter
});

router.post("/", checkAuth, upload.single('image'), productController.insert);
router.get("/", productController.getAll);
router.get("/:productId", productController.getById);
router.patch("/:productId", checkAuth, productController.patch);
router.delete("/:productId", checkAuth, productController.remove);

module.exports = router;