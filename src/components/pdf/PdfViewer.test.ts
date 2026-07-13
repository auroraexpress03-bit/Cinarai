import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldNotifyPageChange, markNextDocumentLoadAsInitial } from './pdfViewerProgress';

test('does not notify on the first document load', () => {
  const initialLoadRef = { current: true };

  assert.equal(shouldNotifyPageChange({ numPages: 5, initialLoadRef }), false);
  assert.equal(initialLoadRef.current, false);
});

test('notifies on subsequent page changes', () => {
  const initialLoadRef = { current: false };

  assert.equal(shouldNotifyPageChange({ numPages: 5, initialLoadRef }), true);
});

test('resets the initial-load guard for a new document', () => {
  const initialLoadRef = { current: false };

  markNextDocumentLoadAsInitial(initialLoadRef);

  assert.equal(initialLoadRef.current, true);
  assert.equal(shouldNotifyPageChange({ numPages: 5, initialLoadRef }), false);
});
