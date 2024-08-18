// const { NODE_ENV, JWT_SECRET } = process.env;
// const jwt = require('jsonwebtoken');
const JWT_SECRET = "Some secret key";

// module.exports.token = jwt.sign(
//   { _id: user._id },
//   NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
// );

module.exports = { JWT_SECRET };