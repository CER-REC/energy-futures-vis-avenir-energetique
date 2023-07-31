Energy Futures Visualization
============================

Energy Futures visualization for CER.

Quick Start
-----------

1. Make a copy of `.env.example` in root called `.env`
2. Set the URL for `MIDDLEWARE_PROXY_ADDRESS` to a server with the GraphQL API
  - The public *apps2* server can be used if there's no development instance of the server
  - Built *Storybook* points to *apps2* for the GraphQL API, by default CORS will stop API requests
    - Need to allow CORS for *Storybook* hosted domain on the GraphQL API server if hosting *Storybook*
3. Install NPM dependencies `npm install`
4. Run storybook `npm run storybook`
5. Run preview `npm run verifyLazyLoad`

Commands
--------

- Linting: `npm run lint`
- Testing (all): `npm run test`
- Testing (target): `npm run test -- [PATH_TO_FILES]`
- Coverage Report: `npm run test:showcoverage`

PDFs
----

- `.\public\pdf` files are referenced externally

