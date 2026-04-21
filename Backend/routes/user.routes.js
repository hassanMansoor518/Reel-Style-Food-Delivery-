const express = require("express");
const router = express.Router();
const { addUser } = require("../controller/user.controller");

router.post("/add", addUser);

module.exports = router;
