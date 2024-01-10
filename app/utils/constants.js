module.exports = {
  TEMPLATE_PATHS: {
    FORGOT_PASS: process.cwd() + "/app/emails/reset_password/html.ejs", //PROCESS.CWD() IS GIVES FULL WORKING DIRECTORY PATH.
    SUCCESS_200: process.cwd() + "/app/templates/200_SUCCESS.ejs",
    ERROR_400: process.cwd() + "/app/templates/400_ERROR.ejs",
    ERROR_401: process.cwd() + "/app/templates/401_ERROR.ejs",
    ERROR_404: process.cwd() + "/app/templates/404_ERROR.ejs",
    ERROR_500: process.cwd() + "/app/templates/500_ERROR.ejs",
    RESET_PASS_FORM: process.cwd() + "/app/templates/reset_password.ejs",
    VERIFY_EMAIL: process.cwd() + "/app/templates/verify_email.ejs",
    EMAIL_VERIFIED: process.cwd() + "/app/templates/email_verified.ejs",
  },
};
