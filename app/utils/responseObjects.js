// COMMON METHODS FOR THE RETURN RESPONSE OBJECTS, FOR SUCCUESS AND FAIL
module.exports = {
  successObject: (message, data) => {
    if (data) {
      return { status: 1, message: message ?? "Success", data: data };
    } else {
      return { status: 1, message: message ?? "Success" };
    }
  },

  failObject: (message, error) => {
    if (error) {
      return { status: 0, message: message ?? "Failed", error: error };
    } else {
      return { status: 0, message: message ?? "Failed" };
    }
  },
};
