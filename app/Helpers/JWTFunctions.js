/* It contains functions and const for JWT authentication */

// Secret key for JWT
const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");

const jwt = require('jsonwebtoken');

// Middleware to verify JWT tokens
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('authHeader', authHeader);
    if (!authHeader) {
        // Return error message if token is missing
        res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject('Authorization token missing'));
        return;
    }
    // const token = authHeader.split(' ')[1];
    const token = authHeader
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, payload) => {
        if (err) {
            res.status(responseCode.BADREQUEST).send(responseObj.failObject(err.message, 'Forbidden'));
        } else {
            let tokenValue = payload.authKey;
            if (tokenValue.includes('-')) {
                const uniqueKey = tokenValue.split('-')[2];
                validateToken(uniqueKey, res, function (validated) {
                    if (validated === true) {
                        req.user = tokenValue;
                        next();
                    }
                });
            } else {
                req.user = tokenValue;
                next();
            }
        }
    });

}

// // Middleware to verify JWT tokens
// function verifyConfirmation(req, res, next) {
//     appFunctions.log("---------verifyConfirmation------------");
//     const confirmationCode = req.params.confirmationCode;

//     appFunctions.log(confirmationCode);

//     if (!confirmationCode) {
//         // Return error message if token is missing
//         res.status(responseCode.RESPONSE_CODE_401).json({message: 'Code is missing'});
//         return;
//     }
//     jwt.verify(confirmationCode, config.secret, (err, payload) => {
//         if (err) {
//             res.status(responseCodes.RESPONSE_CODE_403).json({
//                 message: err.message,
//                 error: messages.forbidden
//             });
//         } else {
//             //appFunctions.log(payload.authKey);
//             req.user = payload.authKey;
//             next();
//         }
//     });

// }

// function removeToken(uniqueKey, removedToken) {
//     let param = [uniqueKey];
//     dbConnection.executeQuery(appQueries.removeUserToken, param, function (e, result, f) {
//         if (e) {
//             res.status(responseCodes.RESPONSE_CODE_500).json({error: e});
//         } else if (result.changedRows === 0) {
//             res.status(responseCodes.RESPONSE_CODE_401).json({msg: messages.invalidToken});
//         } else {
//             removedToken(true);
//         }
//     });
// }

// function validateToken(uniqueKey, res, validated) {
//     let param = [uniqueKey];
//     dbConnection.executeQuery(appQueries.selectUserToken, param, function (e, result, f) {
//         appFunctions.log(result);
//         if (e) {
//             res.status(responseCodes.RESPONSE_CODE_500).json({error: e});
//         } else if (result.length === 0) {
//             res.status(responseCodes.RESPONSE_CODE_401).json({msg: messages.invalidToken});
//         } else {
//             validated(true);
//         }
//     });
// }

// function checkeIfMultipleDeviceSupport(id, callback) {
//     if (MULTIPLE_DEVICES_SUPPORT === true) {
//         callback({error: null});
//     } else {
//         let param = [id];
//         dbConnection.executeQuery(appQueries.removeAllUserToken, param, function (e, resultDeviceToken, f) {
//             // appFunctions.log(e);
//             if (e) {
//                 callback({error: e});
//             } else {
//                 // Return token in response
//                 appFunctions.log("Other token are expired!");
//                 callback({error: null});
//             }
//         });
//     }
// }

// function generateToken(email, device_token, device, id, generatedTokenResult) {
//     appFunctions.log("---------generateToken------------");

//     checkeIfMultipleDeviceSupport(id, function (callback) {
//         if (callback.error === null) {
//             const uniqueKey = appFunctions.randomString();
//             let authKey = email + "-" + id + "-" + uniqueKey;
//             let token = jwt.sign({authKey}, config.secret);
//             let param = [id, device_token, device, uniqueKey];
//             dbConnection.executeQuery(appQueries.insertDeviceToken, param, function (e, resultDeviceToken, f) {
//                 // appFunctions.log(e);
//                 if (e) {
//                     generatedTokenResult({error: e});
//                 } else {
//                     // Return token in response
//                     generatedTokenResult({token: token});
//                 }
//             });
//         } else {
//             generatedTokenResult({error: callback.error});

//         }

//     });


// }

// function generateTokenForEmailVerification(email, device_token, device, id, generatedTokenResult) {
//     appFunctions.log("---------generateTokenForEmailVerification------------");

//     var date = new Date();
//     date.setDate(date.getDate() + 7);
//     let authKey = email + "-" + id + "-" + date;
//     let token = jwt.sign({authKey}, config.secret);
//     generatedTokenResult({token: token});


// }

function generateTokenWithoutAuth(authKey) {
    return jwt.sign({ authKey }, process.env.ACCESS_TOKEN_SECRET_KEY);
}

module.exports = {
    verifyToken,
    //     generateToken,
    generateTokenWithoutAuth,
    //     generateTokenForEmailVerification,
    //     verifyConfirmation
};