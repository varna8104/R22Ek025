# Logging Middleware (Frontend Minimal)

A tiny, readable helper that sends a single POST to the evaluation service with the required fields for a frontend app.

Endpoint: `http://20.244.56.144/evaluation-service/logs`

## API

```
Log(level, pkg, message, token?)
```

- stack is fixed to `"frontend"`.
- `level`: "debug" | "info" | "warn" | "error" | "fatal" (lower case)
- `pkg`: one of frontend/shared packages: "api", "component", "hook", "page", "state", "style", "auth", "config", "middleware", "utils" (lower case)
- `message`: string
- `token` (optional): Bearer token if the route is protected

## Usage

```js
import { Log } from './log.js';

await Log('error', 'api', 'received string, expected bool');
// with token
// await Log('error', 'api', 'something failed', '<BEARER_TOKEN>');
```

That’s it—no build step, just a simple fetch POST.
