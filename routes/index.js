var express = require("express");
var router = express.Router();

router.use("/users", require("./user"));
router.use("/comments", require("./comment"));

module.exports = router;
