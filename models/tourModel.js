const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    // first object is the schema definition,
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      // unique not really a validator
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain charactyers'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      // shorthand
      required: [true, 'A tour must have a difficulty'],
      // complete validator object
      // enum is only for string
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      // a setter function is going be to be ran each time
      // that there is a new value for the ratings average field
      set: (val) => Math.round(val * 10) / 10, // 4.666 -> 46.666 -> 47 -> 4.7
    },
    ratingQuanity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // custom validator
      validate: {
        validator: function (val) {
          // this only point to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regilar price',
      },
    },
    summary: {
      type: String,
      // remove all the white space in the beginning and in the end of the string
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    // We simply leave the images somewhere in the file system
    // and then put the name of the image itself
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    // save images' name as an array of strings.
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // embedded object
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // in order to really create new documents and then embed them into another document,
    // we actually need to create an array.
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // second an object for the options.
    // each time that the data is actually outputted as JSON,
    // we want virtuals to be true.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// Virtual properties, call back function should not use arrow function
// because we need this keyword in the function
// get method: this virtual propperty here will basically be created each time
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
// Mongoose will populate those documents from the model given in ref,
// whose foreignField value will match with the localField value of the current collection.
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
/*
We cannot use this virtual property here
in a query, because they're technically
not part of the database.
*/

// DOCUMENT MIDDLEWARE: runs before .save() .create()
// In a save middleware, the this keyword is gonna point to the currently processed document
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Embeding user in tour collection
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// post middleware functions are executed after all the pre middleware functions
// have completed.
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// the this keyword will point at the current query
tourSchema.pre(/^find/, function (next) {
  // If we create a find query, we can chain other methods
  // in that query object before executed
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  // populate only happen only in queries
  this.populate({
    path: 'guides',
    // not select __v and passwordCgangeAt fields
    select: '-v -passwordCgangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
// this is going to point to the current aggregation object.
tourSchema.pre('aggregate', function (next) {
  // put another match object into the first element of pipeline array
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
