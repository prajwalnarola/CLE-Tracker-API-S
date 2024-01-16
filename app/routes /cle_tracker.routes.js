// IMPORT LIBRARY
const Router = require("express").Router();

// IMPORT ASSETS
const controller = require("../controllers/cle_tracker.controller");
const validator = require("../utils/validator");


// DEFINED DIFFRENT ROUTES AND AS MIDDLWARE WE PASSED VALIDATIONS
Router.get('/categories', [], controller.getCategories);
Router.post('/post', [], controller.postCle);
Router.get('/getCle', [], controller.getCle);
Router.post('/updateCle', [], controller.updateCle);

module.exports = Router;
