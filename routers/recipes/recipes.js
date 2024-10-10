var express = require("express");
const router = express.Router();
const { 
    getAll,
    getOne, 
    createOne,
    editOne, 
    deleteOne,
    deleteSome 
} = require("../../controllers/recipes");

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", createOne);
router.patch("/:id", editOne);
router.delete("/:id", deleteOne);
router.delete("/", deleteSome);

module.exports = router;