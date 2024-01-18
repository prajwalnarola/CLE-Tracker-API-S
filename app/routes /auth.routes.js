// IMPORT LIBRARY
const { body, header, check, query, validationResult, } = require('express-validator');
const Router = require("express").Router();
const HelperFunctions = require('../Helpers/JWTFunctions')
// INPORT ASSETS
const authController = require("../controllers/auth.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.get("/refreshtoken", [query('platform').notEmpty()], authController.refreshToken);
Router.post("/register", [HelperFunctions.verifyToken, validator.validateRegister], authController.register);
Router.get("/verify-email/:token", authController.verifyEmail);
Router.post("/login", [HelperFunctions.verifyToken, validator.validateLogin], authController.login);
Router.post("/forgot-password", [validator.validateForgotPassword], authController.forgotPassword);
Router.post("/reset-password", authController.resetPassword);

module.exports = Router;
