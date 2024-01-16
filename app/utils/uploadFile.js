const fs = require("fs");
const async = require("async");
const path = require("path");

module.exports = async (req, res) => {
  return new Promise((resolve, reject) => {
    async.waterfall(
      [
        function (callback) {
          if (req.files) {
            var file;
            var files;
            var dir;

            if (req.files["media"]) { //'media' media IS KEY WHICH WE ARE PASSING IN PARAMS. WE NEED TO CHANGE IT ACCORDINGLY.
              file = req.files["media"];
              files = [].concat(req.files.media);
              dir = "./upload/posts";
            } 
            if (req.files["profile"]) {
              file = req.files["profile"];
              files = [].concat(req.files.profile);
              dir = "./upload/profile";
            }
            if (req.files["documents"]) { 
              file = req.files["documents"];
              console.log(file);
              files = [].concat(req.files.documents);
              dir = "./upload/documents";
            }

            var image_path_array = [];

            //files
            async.eachSeries(
              files,
              function (file, loop_callback) {
                // console.log('=============== file =====================');
                // console.log(file);
                // console.log('====================================');
                // return res.status(413).send({ status: process.env.FAILED, message: "TEMP DOWN 2" });
                if (file.size > 3 * 2048 * 2048) {
                  reject([]);
                  return res.status(413).send({ status: 0, message: "File is too Large" });
                } else {
                  // IF DIRECTORY IS NOT EXIST THEN BELOW CODE WILL CREATE NEW ONE AUTOMATICALLY
                  if (!fs.existsSync(dir)) {
                    const parentDir = path.dirname(dir);
                    if (!fs.existsSync(parentDir)) {
                      fs.mkdirSync(parentDir, { recursive: true });
                    }
                    fs.mkdirSync(dir);
                  }
      
                  if (file.mimetype.startsWith("image/")) {
                    // handle image file
                    var filename = Date.now() + "." + file.name.split(".").pop();
                    file.mv(dir + "/" + filename, function (err) {
                      if (err) {
                        loop_callback({
                          err: "There was an issue in uploading Image",
                        });
                      } else {
                        image_path_array.push({
                          type: "image",
                          name: filename,
                        });
                        loop_callback();
                      }
                    });
                  }
                  if (file.mimetype.startsWith("application/pdf")) {
                    var filename = Date.now() + "." + file.name.split(".").pop();
                    file.mv(dir + "/" + filename, function (err) {
                      if (err) {
                        loop_callback({
                          err: "There was an issue in uploading Image",
                        });
                      } else {
                        image_path_array.push({
                          type: "document",
                          name: filename,
                        });
                        loop_callback();
                      }
                    });
                  }
                }
              },
              function (err) {
                if (err) {
                  reject([]);
                  return res.status(err.status).json(err);
                } else {
                  callback(null, image_path_array);
                }
              },
            );
          } else {
            callback(null, []);
          }
        },
      ],
      async (err, image_path_array) => {
        resolve(image_path_array);
      },
    );
  });
};
