require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWTFunctions = require("../Helpers/JWTFunctions");

const db = require("../config/db.config"); // models path
const { admin, user, deviceToken } = db;

const userControl = require("./user.controller");
const functions = require("../utils/helperFunctions");
const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const constants = require("../utils/constants");

exports.refreshToken = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(responseCode.BADREQUEST).json({ errors: errors?.errors[0]?.msg });
  }
  if (errors.isEmpty()) {
    // Get platform  from request body
    const platform = req.query.platform;
    if (platform === process.env.PLATFORM_iOS || platform === process.env.PLATFORM_ANDROID || platform === process.env.PLATFORM_POSTMAN) {
      // Generate JWT temp token
      const token = JWTFunctions.generateTokenWithoutAuth(platform);
      // Return token in response
      // res.json({token});
      res.status(responseCode.OK).send(responseObj.successObject(null, token));
      return;
    }
    // Return error message in response
    res.status(responseCode.RESPONSE_CODE_401).json({ msg: messages.invalidPlatform });
  }
}

exports.register = async (req, res) => {
  try {
    if (!req.body.email) {
      throw { message: "Content can not be empty!" };
    }
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw {
        status: responseCode.BADREQUEST,
        message: errors?.errors[0]?.msg,
      };
    }

    const user_email = await userControl.findUser(req.body.email);
    if (user_email.status === 1) {
      throw { message: "That email address is already registered." };
    } else {
      const create_user = {
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        email: req.body.email,
        date_of_birth: req.body.date_of_birth,
        attorny_registration_number: req.body.attorny_registration_number,
        new_york_state_admission_date: req.body.new_york_state_admission_date,
        department_of_admission: req.body.department_of_admission,
        password: req.body.password,
        is_experienced: req.body.is_experienced
      };

      const data = await user.create(create_user);
      if (data) {
        const mailResp = await userControl.sendVerificationMail({
          to: data?.email,
          subject: "Verify Email",
          verify_link:
            "localhost:" +
            // process.env.PORT +
            "3000" +
            "/auth/verify-password/" +
            data?.uuid,
          user_name: data?.user_name,
          email: data?.email,
        });
        if (mailResp.status == 0) {
          throw {
            message: "Error occured while sending mail",
            error: mailResp.error,
          };
        } else {
          res
            .status(responseCode.OK)
            .send(
              responseObj.successObject(
                "Registered successfully!, Check email and verify the link."
              )
            );
        }
      } else {
        throw {
          status: responseCode.INTERNALSERVER_ERROR,
          message: "Something went wrong!",
        };
      }
    }
  } catch (err) {
    if (err?.message) {
      if (Object.keys(err).length == 1) {
        res
          .status(responseCode.BADREQUEST)
          .send(responseObj.failObject(err?.message ?? null));
      } else {
        res
          .status(err?.status ?? responseCode.BADREQUEST)
          .send(
            responseObj.failObject(
              err?.message ?? null,
              err?.status ? null : err
            )
          );
      }
    } else {
      console.log("Error: ", err);
      res
        .status(responseCode.BADREQUEST)
        .send(responseObj.failObject(null, err));
    }
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    if (!req.params["token"]) {
      res.render(constants.TEMPLATE_PATHS.ERROR_500);
    }

    const token = req.params["token"];
    const db_user = await user.findAll({ where: { uuid: token, is_delete: 0, is_verified: 0 } });
    console.log(db_user[0]);
    if (db_user) {
      const updated = await user.update({ is_verified: 1 }, { where: { email: db_user[0]?.email } });
      if (updated) {
        res.render(constants.TEMPLATE_PATHS.EMAIL_VERIFIED);
      } else {
        res.render(constants.TEMPLATE_PATHS.ERROR_500);
      }
    } else {
      res.render(constants.TEMPLATE_PATHS.ERROR_400);
    }
  } catch (err) {
    console.log("error: ", err);
    res.render(constants.TEMPLATE_PATHS.ERROR_400);
  }
};

exports.login = async (req, res) => {
  try {
    // Validate request
    if (!req.body) {
      throw { message: "Content can not be empty!" };
    }
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { message: errors?.errors[0]?.msg };
    }

    const user_email = await userControl.findUser(req.body.email);

    if (user_email.status === 0) {
      throw { status: responseCode.INTERNALSERVER_ERROR, message: "Something went wrong while finding user" };
    } else if (user_email.status === 1) {

      // Restrict user to login if not verified
      
      if (user_email.data[0]?.is_verified == 0) {
        const mailResp = await userControl.sendVerificationMail({
          to: user_email.data[0]?.email,
          subject: "Verify Email",
          // verify_link: "localhost:" + process.env.PORT + "/auth/verify-password/" + user_email.data[0]?.uuid,
          verify_link: "localhost:" + "3000" + "/auth/verify-password/" + user_email.data[0]?.uuid,
          user_name: user_email.data[0]?.user_name,
          email: user_email.data[0]?.email,
        });

        if (mailResp.status == 0) {
          throw { message: "Error occured while sending mail", error: mailResp.error };
        } else {
          res.status(responseCode.OK).send(responseObj.failObject("Email is not verified. Email verification link sent!"));
          return;
        }
      }

      if (functions.verifyPassword(req.body?.password, user_email.data[0]?.password) && req.body.email.toLowerCase() == user_email.data[0].email.toLowerCase()) {
        const jwt_data = { id: user_email.data[0].id, email: user_email.data[0].email, uuid: user_email.data[0].uuid };
        const token = jwt.sign(jwt_data, process.env.ACCESS_TOKEN_SECRET_KEY);

        let return_data = functions.removeKeyCustom(user_email.data[0]?.dataValues, "password");
        return_data = functions.removeKeyCustom(return_data, "uuid");
        return_data = functions.removeKeyCustom(return_data, "device_token");
        return_data = functions.removeKeyCustom(return_data, "is_experienced");
        return_data = functions.removeKeyCustom(return_data, "is_verified");
        return_data = functions.removeKeyCustom(return_data, "is_delete");
        return_data = functions.removeKeyCustom(return_data, "is_testdata");
        return_data = functions.removeKeyCustom(return_data, "created_at");
        return_data = functions.removeKeyCustom(return_data, "updated_at");
        // if (return_data?.profile != null) {
        //   return_data["profile"] = process.env.UPLOAD_URL + return_data?.profile;
        // }

        const create_deviceToken = {
          user_id: user_email.data[0].id,
          device_type: req.headers['device_type'],
          device_token: req.headers['device_token'],
        };
  
        const data = await deviceToken.create(create_deviceToken);
        res.status(responseCode.OK).send({ ...responseObj.successObject("Login successfully!", return_data), token: token });
      } else {
        throw { status: responseCode.BADREQUEST, message: "Incorrect password!" };
      }
    } else {
      // throw { status: responseCode.BADREQUEST, message: "Invalid Email or password!" };
      throw { status: responseCode.BADREQUEST, message: "No such user found!" };
    }
  } catch (err) {
    if (err?.message) {
      res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.message ?? null));
    } else {
      console.log("Error: ", err);
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(null, err));
    }
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    if (!req?.body) {
      throw { message: "Content can not be empty!" };
    }

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { message: errors?.errors[0]?.msg };
    }

    const user_email = await userControl.findUser(req.body?.email);
    if (user_email.status === 0) {
      throw { status: responseCode.INTERNALSERVER_ERROR, message: "Something went wrong while finding user" };
    } else if (user_email.status === 1) {
      const reset_token = Buffer.from(jwt.sign({ id: user_email.data[0]?.id }, process.env.ACCESS_TOKEN_SECRET_KEY)).toString("base64");
      const mail_resp = await userControl.sendMail("reset_password", {
        to: user_email.data[0]?.email,
        subject: "Reset password",
        reset_link: process.env.BASE_URL + "auth/reset-password/" + reset_token,
        user_name: user_email.data[0]?.user_name,
      });

      if (mail_resp.status === 0) {
        throw { status: responseCode.INTERNALSERVER_ERROR, message: "Error occured while sending mail" };
      } else {
        res.status(responseCode.OK).send(responseObj.successObject("Reset link was sent to your email address"));
      }
    } else {
      throw { status: responseCode.BADREQUEST, message: "Invalid Email or password!" };
    }

    //         let reset_token = Buffer.from(jwt.sign({ id: user_email.data[0].id }, process.env.ACCESS_TOKEN_SECRET_KEY)).toString("base64");
    //         let mail_resp = await userControl.sendMail("reset_password", {
    //           to: user_email.data[0].email,
    //           subject: "Reset password",
    //           reset_link: "localhost:3000" + "/auth/reset-password/" + reset_token,
    //         });
    //         if (mail_resp.status === 0) {
    //           res.status(500).send({ message: "Error occured while sending mail", error: mail_resp.error });
    //         } else {
    //           res.status(200).send({ message: "Reset link was sent to your email address" });
    //         }
  } catch (err) {
    if (err?.message) {
      if (Object.keys(err).length == 1) {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message ?? null));
      } else {
        res.status(err?.status ?? responseCode.BADREQUEST).send(responseObj.failObject(err?.message ?? null, err?.status ? null : err));
      }
    } else {
      console.log("Error: ", err);
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(null, err));
    }
  }
};

exports.resetPassword = (req, res) => {
  // validate request
  if (!req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ message: errors });
    return;
  }
  try {
    jwt.verify(Buffer.from(req.body.token, "base64").toString(), process.env.ACCESS_TOKEN_SECRET_KEY, async (err, decoded) => {
      req.headers['device_type']
      if (err) {
        res.status(400).send({ message: "Token is not valid!" });
      } else {
        console.log(decoded.id);
        const user_data = await userControl.findUserById(decoded.id);
        delete user_data.data[0].password;
        const update_payload = {
          ...user_data.data[0],
          password: req.body.password,
        };
        console.log(update_payload.password);
        user
          .update({password: bcrypt.hashSync(update_payload.password, 10)}, { where: { id: decoded.id } }) 
          .then((result) => {
            if (result == 1) {
              res.send({ message: "Password has been updated!" });
            } else {
              res.send({ message: "Can not update password. Maybe user was not found!" });
            }
          })
          .catch((err) => {
            res.status(400).send({ message: "Somthing went wrong while updating password!" });
          });
      }
    });
  } catch (error) {
    res.status(400).send({ message: "Somthing went wrong!" });
  }
};
