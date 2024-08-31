const mongoose = require('mongoose')
const validator = require('validator');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide your name'],
        unique: true,
    },
    duration: Number,
    ratings: {
        type: Number,
        validate: {
            validator: function (value) {
                return value >= 1 && value <= 10
            },
            message: `Ratings should be between 1 and 10 and not ({VALUE})`
        }
    },
    price: Number
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

movieSchema.virtual('durationInHours').get(function () {
    return this.duration / 60;
})

const Movie = new mongoose.model('newMovie', movieSchema);
module.exports = Movie;