import helmet from "helmet";

export const Helmet = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": [
        "https://*.googletagmanager.com",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://*.g.doubleclick.net",
        "https://*.google.com",
      ],
      "connect-src": [
        "https://*.googletagmanager.com",
        "https://*.google-analytics.com",
        "https://*.analytics.google.com",
        "https://*.g.doubleclick.net",
        "https://*.google.com",
      ],
      "script-src": [
        "'self'",
        "'unsafe-inline'",
        "https://*.googletagmanager.com",
      ],
    },
  },
});
