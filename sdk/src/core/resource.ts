// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { LlamaCloud } from '../client';

export abstract class APIResource {
  protected _client: LlamaCloud;

  constructor(client: LlamaCloud) {
    this._client = client;
  }
}
