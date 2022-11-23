const userModel = require("../models/user");
const ContestantModel = require("../models/contestant");


exports.getUserProfile = async (req, res, next) => {
  console.log(1);
  let data;
  try {
    const { _id, role } = req.user;
    const { id } = req.params;

    if (_id !== id) {
      res.redirect("/login");
    }
    const user = await userModel
      .findOne({ _id, role })
      .select("-password -updatedAt -createdAt");
    if (!user) {
      res.redirect("/login");
    }

    // get event data
    console.log(user);

    const contestants = await ContestantModel.find({ is_evicted: false })

    // if (tickets.length > 0) {
    //   let prevEvents = [];
    //   let upEvents = [];
    //   console.log(3);

    //   tickets.forEach(ticket => {
    //     let event = ticket.event;
    //     let currDate = new Date();
    //     let eventDate = new Date(event.date);
    //     console.log(4);

    //     if (currDate <= eventDate) {
    //       console.log(5);

    //       upEvents.push(event);
    //     } else {
    //       console.log(6);

    //       prevEvents.push(event);
    //     }
    //   });

    //   data.upEvents = upEvents;
    //   data.prevEvents = prevEvents;
    // }

    data = {
      title: "Profile | ATS",
      user: user,
      contestantsCount: contestants.length
    };

    res.render("profile", data);
  } catch (error) {
    console.log(error);
  }
};
