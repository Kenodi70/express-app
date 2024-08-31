const express =require('express');
const movieController = require('../controllers/movieControllers');


const router = express.Router();

router.route('/stats').get(movieController.getStats);
router.route('/topRated').get(movieController.getTopRated, movieController.getAll)
router.route('/:id').get(movieController.getOne);
router.route('/').get(movieController.getAll);
router.route('/create').post(movieController.create);

module.exports=router;