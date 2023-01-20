exports.throwError = (status, message, errData = {}) => {
  const error = new Error(message);
  error.statusCode = status;
  error.errData = { ...errData.error };
  throw error;
};
