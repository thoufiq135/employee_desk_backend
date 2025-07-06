const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
    const cametoken = req.cookies.AUTH;
    console.log("Received Token:", cametoken);

    if (!cametoken) {
        return res.status(401).json({ message: "Token not found" });
    }

    try {
        const verify = jwt.verify(cametoken, process.env.KEY);
        console.log("Token verified for:", verify);
        return res.status(200).json({ message: "verified", user: verify });
    } catch (e) {
        console.log("Error at token verify:", e);
        return res.status(403).json({ message: "Invalid token" });
    }
});

module.exports = router;
