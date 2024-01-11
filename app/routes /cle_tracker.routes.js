// IMPORT LIBRARY
const Router = require("express").Router();

// IMPORT ASSETS
const controller = require("../controllers/cle_tracker.controller");
const validator = require("../utils/validator");

// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.get('/categories', [], controller.getCategories);

module.exports = Router;
