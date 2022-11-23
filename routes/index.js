const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  createUser,
  loginUser,
  logoutUser,
  googleAuth,
  googleAuthRedirect
} = require("../controllers/index");
const { checkAuthentication, checkNotAuthentication } = require("../util/auth");


/* GET home page. */
router.get("/", async function (req, res, next) {
  let user = null;


  try {
    // let events = await Events.find(
    //   { is_deleted: false },
    //   {},
    //   { sort: { date: 1 } }
    // );

    if (req.user) {
      user = {
        _id: req.user._id
      };

      if (req.user.role == "admin") {
        res.redirect("/admin")
      } else {
        res.redirect(`/users/${req.user._id}`)
      }
    } else {
      res.render("index", { title: "Home | ATS" });
    }


  } catch (error) {
    console.log(error);
  }
});

router.get("/login", checkNotAuthentication, function (req, res, next) {
  res.render("login", { title: "Login | Syticks" });
});

router.post("/login", checkNotAuthentication, loginUser);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  googleAuthRedirect
);

// router.get("/auth/google/success", );

router.get("/register", checkNotAuthentication, function (req, res, next) {
  res.render("register", { title: "Register | ATS" });
});

router.get("/judges", checkAuthentication, function (req, res, next) {
  let user = null;
  if (req.user) {
    user = req.user
  }
  res.render("judges", { title: "Judges | ATS", user: user });
});

router.post("/register", checkNotAuthentication, createUser);

router.route("/logout").get(logoutUser);

module.exports = router;
