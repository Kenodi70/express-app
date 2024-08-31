const Movie = require('../Model/movieModel');
const ApiFeatures = require('../Utils/ApiFeatures');
const CustomError = require('../Utils/CustomError');
const asyncErrorHandler = require('../Utils/asyncErrorHandler')

exports.getTopRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratings';

    next();
}

exports.getAll = asyncErrorHandler(async (req, res, next) => {

        const features = new ApiFeatures(Movie.find(), req.query)
            .filter().sort().limitFields()
        //   let movies = await features.query
        // console.log(req.query)

        // const excludeFields = ['sort', 'page', 'limit', 'fields'];
        // const queryObj = { ...req.query }
        // excludeFields.forEach((el) => {
        //     delete queryObj[el]
        // })
        // console.log(queryObj)
        // let queryStr = JSON.stringify(queryObj)
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        // let queryOb = JSON.parse(queryStr)
        // let query = Movie.find(queryOb);
        // if (req.query.sort) { 
        //     query = query.sort(req.query.sort)
        // }

        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     console.log(fields)
        //     query = query.select(fields)
        // } else {
        //     query = query.select('-__v')
        // }

        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 10
        // const skip = (page - 1) * limit;
        // query = query.skip(skip).limit(limit)
        // if (req.query.page) {
        //     const moviesCount = await Movie.countDocuments()
        //     if (skip >= moviesCount) {
        //         throw new Error('Page not found');
        //     }
        // }
        const movies = await features.query

        res.status(200).json({
            status: "Success",
            length: `${movies.length}`,
            data: {
                movies
            }
        })
    }

)

exports.getStats = asyncErrorHandler(async (req, res, next) => {

    const stats = await Movie.aggregate([
        { $match: { ratings: { $gt: 3 } } },
        {
            $group: {
                _id: '$ratings',
                avgRating: { $avg: `$ratings` },
                avgPrice: { $avg: `$price` },
                maxPrice: { $min: `$price` },
                minPrice: { $max: `$price` },
                totalPrice: { $sum: `$price` },
                movieCount: { $sum: 1 }
            }
        },
        { $sort: { minPrice: 1 } }
    ]);

    res.status(200).json({
        status: "Success",
        count: `${stats.length}`,
        data: {
            stats
        }
    })

})

exports.getOne = asyncErrorHandler(async (req, res, next) => {
        // const movie = await Movie.find({ _id: req.params.id });
        const movie = await Movie.findById(req.params.id)

            if(!movie){
                const error = new CustomError(`Movie with ID ${req.params.id} is not found`, 404)
              return  next(error)
            }
        res.status(200).json({
            status: "Success",
            data: {
                movie
            }
        })
  
})




exports.create = asyncErrorHandler(async (req, res, next) => {
    const newMovie = await Movie.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            newMovie
        }
    })
})







// [
//     {
//       "name": "Inception",
//       "duration": "148 minutes",
//       "ratings": 8.8,
//       "price": 14.99
//     },
//     {
//       "name": "The Matrix",
//       "duration": "136 minutes",
//       "ratings": 8.7,
//       "price": 12.99
//     },
//     {
//       "name": "Interstellar",
//       "duration": "169 minutes",
//       "ratings": 8.6,
//       "price": 15.99
//     },
//     {
//       "name": "The Dark Knight",
//       "duration": "152 minutes",
//       "ratings": 9.0,
//       "price": 13.99
//     },
//     {
//       "name": "Pulp Fiction",
//       "duration": "154 minutes",
//       "ratings": 8.9,
//       "price": 11.99
//     }
//   ]
