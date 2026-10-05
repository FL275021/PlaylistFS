import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const collectionUrl = new URL('../postman/music-playlist-api.postman_collection.json', import.meta.url);

const collectRequests = (items = []) =>
  items.flatMap((item) => [
    ...(item.request ? [item] : []),
    ...collectRequests(item.item ?? []),
  ]);

test('Postman export is a populated v2.1 collection with executable request tests', async () => {
  const collection = JSON.parse(await readFile(collectionUrl, 'utf8'));
  const requests = collectRequests(collection.item);
  const requestsWithTests = requests.filter((item) =>
    item.event?.some((event) => event.listen === 'test' && event.script?.exec?.length)
  );

  assert.equal(
    collection.info.schema,
    'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  );
  assert.ok(requests.length >= 80, `Expected a broad collection, found ${requests.length} requests`);
  assert.ok(requestsWithTests.length > 0, 'Expected executable Postman assertions');
});
