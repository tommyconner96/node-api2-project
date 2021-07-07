//import express
const express = require("express")
//define router so we can use ecpress.Router   
const router = express.Router()
//welcome message
router.get("/", (req, res) => {
	res.json({
		message: "Welcome to our API",
	})
})

module.exports = router