// FILE COMPLETE 
const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  addThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller')

router
  .route('/')
  .get(getAllThoughts)

router
  .route('/:user')
  .post(addThought);

router
  .route('/:thought')
  .get(getThoughtById)
  .put(addThought)
  .delete(removeThought)

router

  .route('/:thought/reactions')
  .post(addReaction)
  .delete(removeThought)

  
module.exports = router;
