require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWTFunctions = require("../Helpers/JWTFunctions");

const db = require("../config/db.config"); // models path
const { user, deviceToken, categories } = db;

const userControl = require("./user.controller");
const functions = require("../utils/helperFunctions");
const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const constants = require("../utils/constants");

exports.getCategories = async (req, res) => {
    try {
      if (!req.decoded) {
        res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("You are unauthorized to access this api! Please check the authorization token."));
        return;
      }
  
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
        return;
      }
  
      const decoded = req?.decoded;
  
      const data = await user.findAll({
        where: { id: decoded?.id, is_delete: 0 },
      })

      if (data?.length > 0) {
        const categoryData = await categories.findAll({
            attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete"] } 
        })
        res.status(responseCode.OK).send(responseObj.successObject(null, categoryData))
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
      }
    } catch (err) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
    }
  }

  