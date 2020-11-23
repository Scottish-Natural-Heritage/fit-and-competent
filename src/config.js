// Grab our config from the env vars, or set some defaults if they're missing.
const config = Object.freeze({
  port: process.env.FC_PORT || '3008',
  sessionSecret: process.env.FC_SESSION_SECRET || 'override_this_value',
  apiEndpoint: process.env.FC_API_URL ||'http://localhost:3009/fit-and-competent-api/v1',
  hostPrefix: process.env.FC_HOST_PREFIX || `http://localhost:${process.env.FC_PORT}`,
  pathPrefix: process.env.FC_PATH_PREFIX ? `/${process.env.FC_PATH_PREFIX}` : '/fit-and-competent',
  cookiePrefix: process.env.COOKIE_PREFIX || '__Secure'
});

export {config as default};
