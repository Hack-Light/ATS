const express = require("express");
const router = express.Router();

const { checkAuthentication } = require("../util/auth");

const { getOneEvent, getAll, getOneEventVote } = require("../controllers/events");

/* GET users listing. */
router.get("/", checkAuthentication, getAll);

router.get("/:ref_no", checkAuthentication, getOneEvent);

router.get("/:ref_no", checkAuthentication, getOneEvent);

router.get("/vote/:ref_no", checkAuthentication, getOneEventVote);



// router.post("/search", searchEvents);

module.exports = router;
