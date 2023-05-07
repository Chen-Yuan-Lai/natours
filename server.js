const mongoose = require('mongoose');
const dotenv = require('dotenv');
// add enviroment variables

// handle uncahght exception (sync)
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down');
  console.log(err.name, err.message);
  console.log(err);
  // we don't have any async task
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// connect to the database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection success!'));

// START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// handle unhandled rejections (async)
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLE REJECTION! Shutting down...');

  // by doing server.close,  we give the server,
  // basically time to finish all the request
  // that are still pending or being handled at the time,
  server.close(() => {
    process.exit(1);
  });
});

/*
each time that there is an unhandled rejection
somewhere in our application, the process object
will emit an object called unhandled rejection
and so we can subscribe to that event by creating
another listener 
*/

// handle sigterm signal sended by render when render restart your application
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
