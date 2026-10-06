import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeTextFields } from '../src/middlewares/sanitize.middleware.js';

test('text sanitization removes HTML and trims user-provided text', () => {
  const req = { body: { name: '  <script>alert(1)</script><b>Playlist</b>  ' } };
  let nextCalled = false;

  sanitizeTextFields('name')(req, {}, () => {
    nextCalled = true;
  });

  assert.equal(req.body.name, 'Playlist');
  assert.equal(nextCalled, true);
});
