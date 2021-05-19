var ncp = require("ncp").ncp;
var rmdir = require("rimraf");

var res = "src/res";
var dest = "target/res";

rmdir(dest, function (err) {
  if (err) {
    console.log("No old resource folder found.");
    return;
  }
  console.log("The old resource folder has been deleted.");
  ncp(res, dest, function (error) {
    if (error) {
      return console.error(error);
    }
    console.log("The resource folder has been copied.");
  });
});
