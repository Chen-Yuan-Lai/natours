module.exports = (fn) => {
  return (req, res, next) => {
    // pass error into next
    fn(req, res, next).catch(next);
  };
};
