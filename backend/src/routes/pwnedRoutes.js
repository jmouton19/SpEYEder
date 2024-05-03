const express = require("express");
const { checkPwned } = require("../controllers/PwnedController");

const router = express.Router();

router.get("/pwnedemail", checkPwned);

module.exports = router;
