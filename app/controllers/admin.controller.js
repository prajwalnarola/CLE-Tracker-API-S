require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWTFunctions = require("../Helpers/JWTFunctions");

const db = require("../config/db.config"); // models path
const { user, categories, documents, cleTracker, credits, details, admin_setting, resources, faq} = db;

const userControl = require("./user.controller");
const helperFunctions = require("../utils/helperFunctions");
const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const uploadFile = require("../utils/uploadFile");
const constants = require("../utils/constants");
const { forEach } = require("async");
const totalRequiredDocument = 4;


exports.createCategories = async (req, res) => {
    try {
      if (!req?.body) {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"));
        return;
      }
  
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
        where: { id: decoded?.id, is_admin: 1, is_delete: 0 },
      });
  
      if (data.length > 0) {

        await categories.create({category: req.body.category});
        res.status(responseCode.OK).send(responseObj.successObject("data has been inserted!"));
  
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
      }
    } catch (err) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
    }
  }

  exports.createSetting = async (req, res) => {
    try {
      if (!req?.body) {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"));
        return;
      }
  
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
        where: { id: decoded?.id, is_admin: 1, is_delete: 0 },
      });
  
      if (data.length > 0) {

        const settingData = {
            requirements: req.body.requirements, 
            privacy_policy: req.body.privacy_policy,
            terms_and_conditions: req.body.terms_and_conditions
        }

        await admin_setting.create(settingData);
        res.status(responseCode.OK).send(responseObj.successObject("data has been inserted!"));
  
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
      }
    } catch (err) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
    }
  }

  exports.createResources = async (req, res) => {
    try {
      if (!req?.body) {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"));
        return;
      }
  
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
        where: { id: decoded?.id, is_admin: 1, is_delete: 0 },
      });
  
      if (data.length > 0) {

        const settingData = await admin_setting.findAll({
            where: { id: req.body.setting_id, is_delete: 0 },
          });
      
          if (settingData.length > 0) {
    
            await resources.create({ resources: req.body.resources, setting_id: req.body.setting_id});
            res.status(responseCode.OK).send(responseObj.successObject("data has been inserted!"));

          }else {
            res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
          }

      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
      }
    } catch (err) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
    }
  }

  exports.createFAQ = async (req, res) => {
    try {
      if (!req?.body) {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"));
        return;
      }
  
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
        where: { id: decoded?.id, is_admin: 1, is_delete: 0 },
      });
  
      if (data.length > 0) {

        const settingData = await admin_setting.findAll({
            where: { id: req.body.setting_id, is_delete: 0 },
          });
      
          if (settingData.length > 0) {
    
            await faq.create({setting_id: req.body.setting_id, questions: req.body.questions, answers: req.body.answers});
            res.status(responseCode.OK).send(responseObj.successObject("data has been inserted!"));

          }else {
            res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
          }

      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
      }
    } catch (err) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
    }
  }