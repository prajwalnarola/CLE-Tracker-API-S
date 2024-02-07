// IMPORT LIBRARY
const Router = require("express").Router();

// INPORT ASSETS
const controller = require("../controllers/user.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.get('/profile', [], controller.getUserProfile);
Router.post('/update', [], controller.updateProfile);
Router.post('/change-password', [validator.validateChangePassword], controller.changePassword);
Router.post('/delete-account', [], controller.deleteAccount);
Router.post('/logout', [], controller.logout);
Router.get('/history', [], controller.cleHistory);
Router.get('/get-setting-details', [], controller.getSettingDetails);

module.exports = Router;
