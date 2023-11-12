var express = require("express");
var router = express.Router();
var fs = require("fs");
var readline = require("readline");
var path = require("path");

function containsXSS(input) {
  const xssPattern = /<script|alert\(|<\/script|javascript:/i;
  return xssPattern.test(input);
}

function containsSqlInjection(input) {
  const specialCharacters = /[-\/\\^$*+?.()|[\]{}]/g;
  return specialCharacters.test(input);
}

router.post("/", function (req, res, next) {
  let data = req.body;
  console.log();
  let type = req.body.type;
  const filePath = "10-million-password-list-top-10000.txt";

  const fileStream = fs.createReadStream(filePath, "utf-8");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  if (type === "search") {
    if (containsXSS(data.inputData) || containsSqlInjection(data.inputData)) {
      res.status(400).send("Invalid input. XSS detected.");
    } else {
      res.status(200).send("Valid input");
    }
  } else {
    let matchFound = false;
    rl.on("line", (line) => {
      if (line.includes(data.inputData)) {
        matchFound = true;
        return;
      }
    });
    rl.on("close", () => {
      if (matchFound) {
        res.status(400).send("bad password");
      } else {
        res.status(200).send("excellent password");
      }
    });
  }
});

module.exports = router;
