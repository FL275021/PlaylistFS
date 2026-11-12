import sanitizeHtml from 'sanitize-html';

// Elimina etiquetas HTML de los campos de texto para prevenir XSS en contenido almacenado.
export const sanitizeTextFields = (...fields) => (req, res, next) => {
  fields.forEach((field) => {
    if (typeof req.body[field] === 'string') {
      req.body[field] = sanitizeHtml(req.body[field], {
        allowedTags: [],
        allowedAttributes: {},
      }).trim();
    }
  });
  next();
};
