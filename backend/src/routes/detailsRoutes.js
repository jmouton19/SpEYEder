const express = require("express");
const { getGoogleUserData } = require("../controllers/detailsController");

const router = express.Router();

router.get("/gmail", getGoogleUserData);

module.exports = router;
