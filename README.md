# PDF Agent

## Deploy

The frontend is deployed to Vercel and the Express API to Render.

1. In Render, create a Blueprint from this repository and provide `GROQ_API_KEY`
   as a secret.
2. In Vercel, import this repository and set the Root Directory to `client`.
   Set `VITE_API_BASE_URL` to the Render API service URL and deploy.

The Render Blueprint sets `CLIENT_ORIGIN` to the current Vercel production
domain. If that domain changes, update `CLIENT_ORIGIN` in `render.yaml` and
push the change so Render can sync the service.

For local development, leave `VITE_API_BASE_URL` unset; Vite proxies `/api`
requests to `http://localhost:3000`. Start the API with `npm start` from
`server`, and the frontend with `npm run dev` from `client`.

The API downloads its embedding model at runtime. The first PDF question may
take longer while the model is downloaded and initialized. Do not commit API
keys or `.env` files.
