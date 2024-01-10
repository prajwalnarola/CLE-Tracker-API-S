const jwt = require("jsonwebtoken");

const user_cont = require("../controllers/user.controller");
const responseStatus = require("../utils/responseStatus");
const responseObjects = require("../utils/responseObjects");

module.exports = async function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"] || req.authorization;

//   const parts = token?.split("Bearer ");
//   if (parts?.length > 0) {
//     token = parts[1];
//   }
// console.log(token)
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, async function (err, decoded) {
      if (err) {
        return res.status(responseStatus.UNAUTHORIZEDREQUEST).send({ message: err.message });
      }

      const login_user = (await user_cont.findUser(decoded?.email))?.data[0];

      if (login_user?.uuid == decoded?.uuid) {
        console.log("Token Data: ", decoded);
        req.decoded = decoded;
        next();
      } else {
        return res.status(responseStatus.UNAUTHORIZEDREQUEST).send(responseObjects.failObject("Auth Token is invalid."));
      }
      // else {
      //   console.log("Token Data: ", decoded);
      //   req.decoded = decoded;
      //   next();
      // }
    });
  } else {
    return res.status(responseStatus.UNAUTHORIZEDREQUEST).send(responseObjects.failObject("Unauthorized access"));
  }
};
