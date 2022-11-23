exports.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log(req.session.eventUrl);
  req.session.message = {
    type: "danger",
    intro: "Please Login",
    message: "Please login to continue"
  };
  res.redirect("/login");
};

exports.checkNotAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user === "admin") {
      return res.redirect("/admin");
    }

    return res.redirect("/users/" + req.user._id);
  }
  next();
};
