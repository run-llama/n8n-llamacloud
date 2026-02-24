// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * Read an environment variable.
 *
 * Trims beginning and trailing whitespace.
 *
 * Will return undefined if the environment variable doesn't exist or cannot be accessed.
 * In n8n, credentials are always passed explicitly so this returns undefined by default.
 */
export const readEnv = (_env: string): string | undefined => {
  return undefined;
};
