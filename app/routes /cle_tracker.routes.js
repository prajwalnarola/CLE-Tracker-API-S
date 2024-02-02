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
Router.post('/deleteDocument', [], controller.deleteDocuments);
Router.post('/deleteCle', [], controller.deleteCLE);
Router.get('/getCredits', [], controller.getCredits);
Router.get('/details', [], controller.getDetails);
Router.get('/total', [], controller.getTotalCLE);
Router.get('/total-by-category', [], controller.getTotalCLEForEachCategory);

module.exports = Router;
