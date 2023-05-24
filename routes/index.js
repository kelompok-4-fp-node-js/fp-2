var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "welcome to Toko belanja Kelompok 4" });
});
router.use("/users", require("./user"));
router.use("/photos", require("./photo"));
router.use("/comments", require("./comment"));
router.use("/socialmedias", require("./sosmed"));

module.exports = router;
