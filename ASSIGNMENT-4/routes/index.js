const express = require("express");

const adminData = require("./admin");

const router = express.Router();

const fillWeek = (pomidori) => {
  let pomidoriWeek = [0, 0, 0, 0, 0, 0, 0];
  // fill week array with pomidoros backwards
  for (let j = 0; j < 2; j++) {
    //weekend
    for (let i = 0; i < 4; i++) {
      if (!pomidori) break;
      pomidoriWeek[6 - j]++;
      pomidori--;
    }
  }
  for (let j = 0; j < 5; j++) {
    //week
    for (let i = 0; i < 8; i++) {
      if (!pomidori) break;
      pomidoriWeek[4 - j]++;
      pomidori--;
    }
  }
  return pomidoriWeek;
};

router.get("/", (req, res, next) => {
  const pomidori = adminData.pomidori.pomidori;
  const pomidoriWeek = fillWeek(pomidori);
  res.render("index", {
    pomidoriWeek,
    title: "Garden",
    path: "/",
  });
});

module.exports = router;
