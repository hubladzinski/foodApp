var express = require("express");
var router = express.Router();

const schedule_controller = require("../controllers/scheduleController");

/* GET user schedule listing. */
router.get("/", schedule_controller.get_user_schedule);

router.post("/", schedule_controller.post_dateToSchedule);

module.exports = router;