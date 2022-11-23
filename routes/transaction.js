const express = require("express");
const router = express.Router();
const { checkAuthentication } = require("../util/auth");
const {
  makePayment,
  verifyPayment,
  makeGuestPayment,
  formPayment,
  greet
} = require("../controllers/transactions");

/* GET users listing. */
router.post("/:ref_no", checkAuthentication, makePayment);

router.get("/confirm/:link", checkAuthentication, async (req, res) => {
  const { link } = req.params;
  let data = {
    title: "Confirm Payment | Syticks",
    link
  };
  res.render("confirm", data);
});

router.get("/verify", verifyPayment);

// router.post("/guest/:slug", makeGuestPayment);
// router.post("/form/:slug",formPayment );

// router.get("/transaction/complete/:tx_ref", greet);

// router.get("/success", greet);

module.exports = router;
