const errorCode = {
  invalidData: 400,
  idNotFound: 404,
  defaultError: 500,
// const CONFLICT = 409;
// const UNAUTHORIZED = 401;
// const FORBIDDEN = 403;
};

const errorMessage = {
  invalidData: "Invalid data provided",
  idNotFound: "Requested resource not found",
  defaultError: "An error has occurred on the server",
  validationError: "Validation failed",
  requiredEmail: "An email address is required",
  // invalidData_URL: "Invalid image URL",
  // invalidData_Item_Id: "Invalid itemId",
};

module.exports = { errorCode, errorMessage };