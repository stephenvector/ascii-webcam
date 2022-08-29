import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://01e3fd1915cd49bab2c8902e86b5750b@o64982.ingest.sentry.io/6697134",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.2,
});

import WebcamApp from "./WebcamApp";
import "./styles.css";

const rootElement = document.getElementById("root");
if (rootElement && rootElement instanceof HTMLDivElement) {
  new WebcamApp(rootElement);
}
