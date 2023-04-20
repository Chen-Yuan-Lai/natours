// review / rating / createAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be  empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    CreateAT: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// query middleware
reviewSchema.pre(/^find/, function (next) {
  // populate only happen only in queries
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// static method of schema
// this keyword points to the current model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // call aggregate on model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: 'tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuanity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuanity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// We don't use pre save middleware because the current review is not really
// in the collection just yet.
// Don't use next() in the post midddleware
reviewSchema.post('save', function (next) {
  // this points to current review
  // this.constructor points to the model
  this.constructor.calcAverageRatings(this.tour);
});

// Goal : access to the document
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // we can basically execute a query, and then that will give us the document
  // that's currently being processed.
  this.r = await this.findOne(); // retrieving the current document from the database.
  // console.log(this.r);
  next();
});

// after the query has already finished, and so therefore this query object has updated
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
