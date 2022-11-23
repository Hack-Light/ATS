const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const passport = require("passport");

exports.createUser = async (req, res, next) => {
  const { name, email, username, phone, password, role } = req.body;
  let user;
  try {
    user = await UserModel.findOne({ username });

    if (user) {
      res.send("error");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new UserModel({
      name,
      password: hashedPassword,
      email,
      phone,
      username,
      role
    });

    let result = await user.save();
    res.redirect("/login");
    console.log(result);
  } catch (e) {
    res.redirect("/login");
  }
};

exports.loginUser = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.session.message = {
        type: "danger",
        intro: "User does not exist",
        message: "Input correct login details "
      };
      res.redirect("/login");
    }
    req.logIn(user, error => {
      if (err) return next(error);

      if (user.role === "admin") {
        return res.redirect("/admin");
      }
      if (req.session.eventUrl) return res.redirect(req.session.eventUrl);
      return res.redirect("/users/" + user._id);
    });
  })(req, res, next);
};

exports.logoutUser = async (req, res) => {
  if (req.session) {
    await req.session.destroy(err => {
      if (err) {
        debug(err);
      } else res.redirect("/");
    });
  }
};

exports.googleAuth = async (req, res, next) => {
  passport.authenticate("google", { scope: ["email", "profile"] });
};

exports.googleAuthRedirect = async (req, res, next) => {
  try {
    let user;
    user = await UserModel.findOne({ providerID: req.user.id });

    if (user === null) {
      user = new UserModel({
        provider: "Google",
        providerID: req.user.id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.displayName
      });

      user = await user.save();
    }

    req.logIn(user, error => {
      if (error) return next(error);

      if (user.role === "admin") {
        return res.redirect("/admin");
      }
      if (req.session.eventUrl) return res.redirect(req.session.eventUrl);
      return res.redirect("/users/" + user._id);
    });
  } catch (err) {
    console.log(err);
  }
};
