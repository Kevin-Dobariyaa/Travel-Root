const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");

const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require("../middleware.js");

// SignUp

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync( async (req,res)=>{
    try{
        let {username,email, password} = req.body;
        const newUser = new User({email,username});
        
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            req.flash("success","Welcome to Travel Root!")
            res.redirect("/listings");
        })

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));


// Login

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})


router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login", failureFlash: true}),
     async (req,res)=>{
        req.flash("success","Welcome to Traval Root");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

// Logout

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings")
    })
})


module.exports = router;