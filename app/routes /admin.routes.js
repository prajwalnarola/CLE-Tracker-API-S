// IMPORT LIBRARY
const Router = require("express").Router();

// IMPORT ASSETS
const controller = require("../controllers/admin.controller");
const validator = require("../utils/validator");


// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.post('/create-categories', [], controller.createCategories);
Router.post('/create-setting', [], controller.createSetting);
Router.post('/create-resources', [], controller.createResources);
Router.get('/create-faq', [], controller.createFAQ);

module.exports = Router;
