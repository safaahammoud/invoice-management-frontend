# Project Framework

Invoices management Frontend part built using:
- Nuxt 3 https://nuxt.com/docs/getting-started/introduction
- Pinia store for statemanagement
- Urql used as graphql client to do mutations and queries and handle errors https://commerce.nearform.com/open-source/urql/docs/
-Vuetify for UI components especially server-side table
-handled cors for better security
## Setup

Make sure to install the dependencies:

```bash

yarn install

```

# Project Structure
The project main directories are: pages and components,and store, and layouts.

All views are lazy loaded modules on router level.
The following folders are found:

Components: contains reusable sections to be added to the pages.

Layouts: there are 2 layouts one containing auth pages like login and signup and the other for pages that requires the user to be already authenticated

## Development Server

Start the development server on `http://localhost:3000`:

```bash

# yarn
yarn dev

```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```