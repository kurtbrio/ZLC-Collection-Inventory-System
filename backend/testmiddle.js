const checkError = (req, res, next) => {
  if (res.error) {
    return error;
  }
  next();
};

module.exports = checkError;
