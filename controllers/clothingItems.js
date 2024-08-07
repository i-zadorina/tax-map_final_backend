const Item = require('../models/clothingItem');
const { errorCode, errorMessage } = require('../utils/errors');

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
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
    .then((item) => res.status(200).send({ data: item }))
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
  Item.findByIdAndRemove(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: 'Successfully deleted' }))
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

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
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
    .then(() => res.status(200).send({ message: 'Successfully deleted' }))
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
  likeItem,
  dislikeItem,
};
