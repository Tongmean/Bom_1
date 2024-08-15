const express = require('express');
const router = express.Router();
//Import bomController form Controller
const { getBoms, postBom, updatebom } =  require("../controller/bomController");

//Get all bom value Sellect *
router.get('/',getBoms);
//Create bom
router.post('/create',postBom);
//Update bom
router.put('/update',updatebom);


module.exports = router;