# Deploy futile.in

This app should be deployed as a Node web service, not a static site.

## Fastest path: Render

1. Push this project to GitHub.
2. In Render, create a new `Web Service`.
3. Select the repo.
4. Render will detect [render.yaml](/Users/rakeshmeesa/Desktop/futile-in/render.yaml).
5. Set any extra environment variables you need.
6. Deploy.

Default commands:

- Build: `pnpm install --frozen-lockfile && pnpm build`
- Start: `pnpm start`

## Minimum environment variables

For a public content-only launch, only this is truly required:

- `JWT_SECRET`

These are optional unless you want those features live:

- `DATABASE_URL`
  Needed for database-backed admin or submission flows.
- `OAUTH_SERVER_URL`
  Needed for OAuth login routes.
- `VITE_APP_ID`
  Needed with OAuth.
- `OWNER_OPEN_ID`
  Needed if you want the owner account auto-marked as admin.
- `BUILT_IN_FORGE_API_URL`
  Needed for owner notifications.
- `BUILT_IN_FORGE_API_KEY`
  Needed for owner notifications.

Use [.env.example](/Users/rakeshmeesa/Desktop/futile-in/.env.example) as the template.

## Domain

After the first successful deploy:

1. Open the Render service settings.
2. Add your custom domain `futile.in` and `www.futile.in`.
3. Update your DNS records where the domain is registered.
4. Wait for SSL to finish provisioning.

## Before you point the domain

Check these on the Render URL first:

1. `/`
2. `/categories`
3. `/about`
4. `/privacy`
5. `/guides/dsa`

## Recommended launch mode

Launch the public guide pages first.

That means:

- Public pages live
- No OAuth dependency
- No database dependency unless you actively need admin/submission features on day one

You can add auth, admin, payments, and submission flows after the public site is stable.
