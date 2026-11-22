/**
 * Path-based location endpoint for clients that remove credentials from
 * nested query strings while importing configuration files.
 */

import { DEFAULT_LOC, deriveConfigKey, jsonResponse, errorResponse, corsHeaders } from '../_utils.js';

export async function onRequestGet(context) {
  const { env, params } = context;

  if (env.TOKEN && params.key !== await deriveConfigKey(env.TOKEN)) {
    return errorResponse('unauthorized', 401);
  }

  let loc = DEFAULT_LOC;
  if (env.SPOOFER_DATA) {
    loc = await env.SPOOFER_DATA.get('loc', { type: 'json' }) || DEFAULT_LOC;
  }

  return jsonResponse(loc);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}
