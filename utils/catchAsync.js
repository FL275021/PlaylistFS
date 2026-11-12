// Envuelve un controlador async y redirige cualquier error rechazado al manejador central de errores.
const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default catchAsync;
