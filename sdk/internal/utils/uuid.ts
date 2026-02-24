// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * https://stackoverflow.com/a/2117523
 */
export let uuid4 = function () {
  // crypto is a Web Crypto API global available in browsers and Node.js 19+
  const _crypto = typeof crypto !== 'undefined' ? crypto : undefined;
  if (_crypto?.randomUUID) {
    uuid4 = _crypto.randomUUID.bind(_crypto);
    return _crypto.randomUUID();
  }
  const u8 = new Uint8Array(1);
  const randomByte = _crypto ? () => _crypto.getRandomValues(u8)[0]! : () => (Math.random() * 0xff) & 0xff;
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (+c ^ (randomByte() & (15 >> (+c / 4)))).toString(16),
  );
};
