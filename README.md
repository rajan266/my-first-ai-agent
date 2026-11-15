# PDF Agent

## Deploy

The frontend is deployed to Vercel and the Express API to Render.

1. In Render, create a Blueprint from this repository and provide `GROQ_API_KEY`
   as a secret. After deployment, copy the API service URL.
2. In Vercel, import this repository and set the Root Directory to `client`.
   Set `VITE_API_BASE_URL` to the Render API service URL (for example,
   `https://my-first-ai-agent-api.onrender.com`) and deploy.
3. Copy the Vercel site URL and set `CLIENT_ORIGIN` on the Render service to
   that exact origin (for example, `https://my-first-ai-agent.vercel.app`).
   Redeploy the Render service after changing the environment variable.

For local development, leave `VITE_API_BASE_URL` unset; Vite proxies `/api`
requests to `http://localhost:3000`. Start the API with `npm start` from
`server`, and the frontend with `npm run dev` from `client`.

The API downloads its embedding model at runtime. The first PDF question may
take longer while the model is downloaded and initialized. Do not commit API
keys or `.env` files.
