const Item = require('../models/clothingItem');
const { errorMessage } = require('../utils/error-messages');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const NotFoundError = require('../utils/errors/NotFoundError');

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: errorMessage.validationError }));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError('This user is not the owner of the item');
      }
      return Item.findByIdAndRemove(itemId);
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError({ message: errorMessage.NotFoundError }));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError({ message: errorMessage.BadRequestError }));
      } else {
        next(err);
      }
    });
};

const updateItem = (req, res, next) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  Item.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError({
            message: `${errorMessage.BadRequestError} from updateItem`,
          })
        );
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError({ message: errorMessage.NotFoundError }));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError({ message: errorMessage.BadRequestError }));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError({ message: errorMessage.NotFoundError }));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError({ message: errorMessage.BadRequestError }));
      } else {
        next(err);
      }
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
