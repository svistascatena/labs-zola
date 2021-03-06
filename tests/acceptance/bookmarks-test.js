import {
  visit,
  click,
  fillIn,
  currentURL,
  find,
  waitUntil,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { percySnapshot } from 'ember-percy';
import setupMapMocks from '../helpers/setup-map-mocks';

const SEARCH_INPUT_SELECTOR = '.map-search-input';
const SEARCH_TERM_LOT = '1000477501';

module('Acceptance | bookmarks', function(hooks) {
  setupApplicationTest(hooks);
  setupMapMocks(hooks);

  hooks.beforeEach(function() {
    window.localStorage.clear();
  });

  test('visiting /bookmarks', async function(assert) {
    await visit('/bookmarks');
    await percySnapshot('default bookmarks view');
    assert.equal(currentURL(), '/bookmarks');
  });

  test('visiting /bookmarks, see empty message', async function(assert) {
    await visit('/bookmarks');
    await waitUntil(() => find('.content-area'));
    await percySnapshot('default empty bookmarks view');

    assert.ok(find('.no-bookmarks'));
  });

  test('search lot, save, find result in bookmarks, delete it', async function(assert) {
    await visit('/');
    await fillIn(SEARCH_INPUT_SELECTOR, SEARCH_TERM_LOT);
    await waitUntil(() => find('.has-results'));
    await click('.result');
    await waitUntil(() => (currentURL().indexOf('/lot') >= 0));
    await click('.bookmark-save-button');
    await percySnapshot('save button works');
    await visit('/bookmarks');
    await waitUntil(() => find('.content-area'));
    await percySnapshot('saved bookmark appears');
    await click('.delete-bookmark-button');
    await percySnapshot('bookmark deleted');
    assert.ok(find('.no-bookmarks'));
  });

  test('bookmark lot, see count increase, un-bookmark', async function(assert) {
    await visit('/');
    await fillIn(SEARCH_INPUT_SELECTOR, SEARCH_TERM_LOT);
    await waitUntil(() => find('.has-results'));
    await click('.result');
    await waitUntil(() => (currentURL().indexOf('/lot') >= 0));
    await percySnapshot('no bookmarks counted');
    await click('.bookmark-save-button');

    assert.equal(find('.saved-bookmarks-counter .badge').textContent, '1');
    await percySnapshot('counter has incremented');
    await click('.bookmark-save-button');
    assert.equal(find('.saved-bookmarks-counter .badge'), null);
  });
});
