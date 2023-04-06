const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    nuique: true,
    minlength: 8,
  },
  // required: true means this field is a required input
  // not means it should be persisted to the database
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

// Only when the password is changed or when it's created new,
// we need to encrypt the password
userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) next();

  // Two way to specify cost parameter
  // 1. generating the salt (random String) manually
  // 2. pass cost parameter
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
