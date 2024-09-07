const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const { signUp, signUpForm, loginForm, login, logout } = require("../controllers/users.js");

// SignUp

router.route("/signup")
.get(signUpForm)
.post(wrapAsync(signUp));

// Login
router.route("/login")
.get(loginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    login
);


// Logout
router.get("/logout", logout);


module.exports = router;