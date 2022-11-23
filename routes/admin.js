const express = require("express");
const {
  getAdminDash,
  getUpload,
  handleUpload,
  getAdminEvents,
  getVotesPage,
  deleteEvent,
  getEdit,
  editEvent,
  getForms,
  handleFormUpload
} = require("../controllers/admin");
const { checkAuthentication } = require("../util/auth");
let { cloudConfig } = require("../controllers/cloudinary");

const multer = require("multer");
let storage = multer.memoryStorage();
let uploads = multer({ storage: storage }).array("media");

const router = express.Router();

/* GET users listing. */
router.get("/", checkAuthentication, getAdminDash);
// router.get("/events", checkAuthentication, getAdminEvents);
router.get("/upload", checkAuthentication, getUpload);

router.get("/votes", checkAuthentication, getVotesPage);
// router.get("/forms", checkAuthentication, getForms);
// router.get("/event/delete/:slug", checkAuthentication, deleteEvent);
// router.get("/event/edit/:slug", checkAuthentication, getEdit);
// router.put(
//   "/event/edit/:slug",
//   uploads,
//   checkAuthentication,
//   cloudConfig,
//   editEvent
// );
router.post("/upload", uploads, checkAuthentication, cloudConfig, handleUpload);
// router.post("/forms",uploads, checkAuthentication,cloudConfig, handleFormUpload);


module.exports = router;
