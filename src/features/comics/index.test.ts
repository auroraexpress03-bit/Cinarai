import test from 'node:test';
import assert from 'node:assert/strict';
import { getComicModule, loadComicModule } from './index';

test('getComicModule returns a module for comic 1', () => {
  const comicModule = getComicModule(1);
  assert.equal(comicModule.metadata.comicId, 1);
  assert.equal(comicModule.navigation.learningObjects.length > 0, true);
});

test('loadComicModule returns the same module instance for comic 2', () => {
  const first = loadComicModule(2);
  const second = loadComicModule(2);
  assert.equal(first.metadata.comicId, 2);
  assert.equal(second.metadata.comicId, 2);
  assert.equal(first.identification.questions.length, second.identification.questions.length);
});
