const crypto = require('crypto');

const uuid = () => crypto.randomUUID();

function jsonBody(obj) {
  return {
    mode: 'raw',
    raw: JSON.stringify(obj, null, 2),
    options: { raw: { language: 'json' } },
  };
}

function formDataBody(fields) {
  return { mode: 'formdata', formdata: fields };
}

function buildUrl(pathSegments, query) {
  const rawPath = pathSegments.join('/');
  const queryStr = query && query.length ? '?' + query.map((q) => `${q.key}=${q.value}`).join('&') : '';
  const url = {
    raw: `{{prod_base_url}}/${rawPath}${queryStr}`,
    host: ['{{prod_base_url}}'],
    path: pathSegments,
  };
  if (query && query.length) url.query = query;
  return url;
}

function bearer(tokenVar) {
  return { key: 'Authorization', value: `Bearer {{${tokenVar}}}`, type: 'text' };
}

// tests: array of raw JS lines (pm.test(...) blocks) as strings
function req({ name, method, path, query, headers = [], body, tests = [], description }) {
  const isFormData = body && body.mode === 'formdata';
  const defaultHeaders = isFormData ? [] : [{ key: 'Content-Type', value: 'application/json', type: 'text' }];
  const item = {
    name,
    event: [],
    request: {
      method,
      header: [...defaultHeaders, ...headers],
      url: buildUrl(path, query),
    },
    response: [],
  };
  if (description) item.request.description = description;
  if (body) item.request.body = body;
  if (tests.length) {
    item.event.push({ listen: 'test', script: { type: 'text/javascript', exec: tests } });
  }
  return item;
}

function folder(name, items) {
  return { name, item: items };
}

// --- reusable test snippet builders ---

const statusIs = (code) =>
  `pm.test("Status code is ${code}", function () { pm.response.to.have.status(${code}); });`;

const isJson = () =>
  `pm.test("Response is JSON", function () { pm.response.to.be.json; });`;

const bodyHasStatus = (status) =>
  `pm.test("Body status field is '${status}'", function () { pm.expect(pm.response.json().status).to.eql("${status}"); });`;

const saveVar = (name, jsonPath) =>
  `pm.collectionVariables.set("${name}", pm.response.json()${jsonPath});`;

const fieldEquals = (label, jsonPath, expected) =>
  `pm.test("${label}", function () { pm.expect(pm.response.json()${jsonPath}).to.eql(${JSON.stringify(
    expected
  )}); });`;

const fieldExists = (label, jsonPath) =>
  `pm.test("${label}", function () { pm.expect(pm.response.json()${jsonPath}).to.exist; });`;

const messageContains = (label, substring) =>
  `pm.test("${label}", function () { pm.expect(pm.response.json().message).to.include(${JSON.stringify(
    substring
  )}); });`;

module.exports = {
  uuid,
  jsonBody,
  formDataBody,
  buildUrl,
  bearer,
  req,
  folder,
  statusIs,
  isJson,
  bodyHasStatus,
  saveVar,
  fieldEquals,
  fieldExists,
  messageContains,
};
