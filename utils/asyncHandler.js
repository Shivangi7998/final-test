export default  (fn) => (req, res, next) =>
    promises.resolve(fn( req, res, next)).catch(next);