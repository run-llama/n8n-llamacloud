// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { setTimeout } from './timer';

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
