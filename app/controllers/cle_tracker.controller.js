require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWTFunctions = require("../Helpers/JWTFunctions");

const db = require("../config/db.config"); // models path
const { user, categories, documents, cleTracker, credits } = db;

const userControl = require("./user.controller");
const functions = require("../utils/helperFunctions");
const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const uploadFile = require("../utils/uploadFile");
const constants = require("../utils/constants");
const totalRequiredDocument = 4

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

exports.postCle = async (req, res) => {
  try {
    if (!req?.body) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"))
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
      where: { id: decoded?.id, is_delete: 0 },
    })

    if (data?.length > 0) {
      const cleData = {
        user_id: decoded?.id,
        category_id: req.body.categoryId,
        cle_name: req.body.cleName,
        cle_date: req.body.cleDate,
      };

      await cleTracker.create(cleData)
        .then(async (result) => {
          if (!result.isEmpty) {

            let insert_documents = [];

            if (req.files['documents']) {
              const uploadedFiles = await uploadFile(req, res);

              for (const file of uploadedFiles) {
                const document = {
                  cle_tracker_id: result.id,
                  document: file.name
                };
                insert_documents.push(document);
                console.log("Document: ", file.name);
              }
            }
            if (insert_documents.length <= totalRequiredDocument) {

              documents.bulkCreate(insert_documents);

            } else {

              res.send({ message: "you can upload only 4 documents!!" });

            }

            const creditsData = {
              cle_tracker_id: result.id,
              creditsEarned: req.body.creditsEarned,
            };

            credits.create(creditsData);

            res.send({ message: "data has been inserted!" });

          } else {
            res.send({ message: "Can not insert data" });
          }
        })
        .catch((err) => {
          res.status(400).send({ message: "Somthing went wrong while inserting data!" });
        });

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
  }
}


exports.getCle = async (req, res) => {
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

      const cleData = await cleTracker.findAll({
        where: { user_id: decoded?.id, is_delete: 0 },
      })

      if (cleData?.length > 0) {

        const categoryData = await categories.findAll({
          where: { id: cleData[0].category_id, is_delete: 0 }, attributes: ["id", "cle_name"]
        })

        const creditsData = await credits.findAll({
          where: { cle_tracker_id: cleData[0].id, is_delete: 0 }, attributes: ["id", "creditsEarned"]
        })

        const documentData = await documents.findAll({
          where: { cle_tracker_id: cleData[0].id, is_delete: 0 }, attributes: ["id", "document"]
        })

        const responseData = {
          id: cleData[0].id,
          user_id: cleData[0].user_id,
          cle_name: cleData[0].cle_name,
          cle_date: cleData[0].cle_date,
          category_data: categoryData,
          credits_data: creditsData,
          document_data: documentData
        }

        res.status(responseCode.OK).send(responseObj.successObject(null, responseData))
      }
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
  }
}

exports.updateCle = async (req, res) => {
  try {
    if (!req?.body) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"))
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

    const cle_tracker_id = req.body?.cleTrackerId
    const credit_id = req.body?.creditId
    const document_id = req.body?.documentId

    let updated_cle = {};

    if (req.body?.cleName) {
      updated_cle['cle_name'] = req.body?.cleName
    }

    if (req.body?.cleDate) {
      updated_cle['cle_date'] = req.body?.cleDate
    }

    if (req.body?.categoryId) {
      updated_cle['category_id'] = req.body?.categoryId
    }

    const creditsData = {
      creditsEarned: req.body?.creditsEarned,
    };

    let update_document;
    if (req.files['documents']) {
      update_document = (await uploadFile(req, res))[0]?.name
    }

    const update_document_data = {
      document: update_document
    }

    console.log(update_document);

    if (updated_cle) {
      const data = await cleTracker.update(updated_cle, { where: { id: cle_tracker_id, user_id: decoded?.id, is_delete: 0 } });
      if (data) {

        const verifyCreditData = await credits.findAll({
          where: { id: credit_id, cle_tracker_id: cle_tracker_id, is_delete: 0 },
        })

        if (verifyCreditData.length > 0) {
          await credits.update(creditsData, { where: { id: credit_id, cle_tracker_id: cle_tracker_id, is_delete: 0 } });
        } else {
          res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong updating credits!"))
        }

        const verifyDocumentData = await documents.findAll({
          where: { id: document_id, cle_tracker_id: cle_tracker_id, is_delete: 0 },
        })

        if (verifyDocumentData.length > 0) {

          await documents.update(update_document_data, { where: { id: document_id, cle_tracker_id: cle_tracker_id, is_delete: 0 } });
          res.status(responseCode.OK).send(responseObj.successObject("CLE updated successfuly!"))

        } else {

          const currentDocCount = await documents.count({
            where: { cle_tracker_id: cle_tracker_id, is_delete: 0 },
          })

          let insert_documents = [];

          if (req.files['documents']) {
            const uploadedFiles = await uploadFile(req, res);

            for (const file of uploadedFiles) {
              const document = {
                cle_tracker_id: cle_tracker_id,
                document: file.name
              };
              insert_documents.push(document);
              console.log("Document: ", file.name);
            }
          }

          if (insert_documents.length <= totalRequiredDocument - currentDocCount) {
            documents.bulkCreate(insert_documents);
            res.status(responseCode.OK).send(responseObj.successObject("CLE updated successfuly!"))
          } else {
            res.status(responseCode.BADREQUEST).send({ message: "you can upload only 4 documents!!" });
          }

        }
      }
    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong! No data to update."))
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
  }
}




