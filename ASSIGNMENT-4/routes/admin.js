const express = require("express");
const fs = require("fs");

const router = express.Router();

const produce = { pomidori: 48 };

router.get("/", (req, res, next) => {
  res.render("admin", {
    title: "Control Central",
    path: "/admin",
    pomidori: produce.pomidori,
  });
});

router.post("/reset", (req, res, next) => {
  produce.pomidori = 48;
  res.redirect("/");
});

router.post("/harvest", (req, res, next) => {
  produce.pomidori -= req.body.amount;
  res.redirect("/");
});

exports.routes = router;
exports.pomidori = produce;
