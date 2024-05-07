const express = require("express");
const { getGoogleUserData } = require("../controllers/detailsController");
const { getGitHubUserData } = require("../controllers/detailsController");

const router = express.Router();

router.get("/gmail", getGoogleUserData);
router.get("/github", getGitHubUserData);

module.exports = router;
