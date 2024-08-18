const Item = require('../models/clothingItem');
const { errorCode, errorMessage } = require('../utils/errors');

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return res
      .status(errorCode.invalidData)
      .send({ message: errorMessage.invalidData });
  }
  return Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.validationError });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        const error = new Error();
        error.name = "Access Denied";
        throw error;
      }
  return Item.findByIdAndRemove(itemId)})
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "Access Denied") {
        return res
          .status(errorCode.accessDenied)
          .send({ message: `${errorMessage.accessDenied} to delete this item` });
      }
      if (err.name === "ValidationError" || err.name === 'CastError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.invalidData });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(errorCode.idNotFound)
          .send({ message: errorMessage.idNotFound });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  Item.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(errorCode.invalidData)
          .send({ message: `${errorMessage.invalidData} from updateItem` });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: `${errorMessage.defaultError} from updateItem` });
    });
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(errorCode.idNotFound)
          .send({ message: errorMessage.idNotFound });
      }
      if (err.name === 'CastError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.invalidData });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then(() => res.send({ message: 'Successfully deleted' }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(errorCode.idNotFound)
          .send({ message: errorMessage.idNotFound });
      }
      if (err.name === 'CastError') {
        return res
          .status(errorCode.invalidData)
          .send({ message: errorMessage.invalidData });
      }
      return res
        .status(errorCode.defaultError)
        .send({ message: errorMessage.defaultError });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  likeItem,
  dislikeItem,
};
