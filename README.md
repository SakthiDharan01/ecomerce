# SurveySense Ecommerce Demo (Next.js)

Minimal deployable ecommerce demo that integrates with SurveySense and renders survey templates dynamically using questions returned by backend APIs.

## Stack

- Next.js (App Router)
- React + TypeScript
- TailwindCSS

## Key behavior

- Product page with demo shopping actions
- Actions send events to backend:
   - `product_view`, `page_scroll`, `add_to_cart`, `checkout`
- Survey appears only when backend returns one
- Survey question text comes from backend payload
- Response submits back to backend, then survey auto-hides
- Template showcase can load backend survey list and preview each template style

## Environment

Create `.env.local` (or update `.env`) with:

- `NEXT_PUBLIC_BACKEND_URL=https://YOUR_BACKEND_URL`
- `NEXT_PUBLIC_PROJECT_ID=1`
- `NEXT_PUBLIC_USER_IDENTIFIER=demo_user`

Example is available in `.env.example`.

## Local run

1. Install deps: `npm install`
2. Start dev server: `npm run dev`
3. Open `http://localhost:3000`

## Deploy

Use Vercel (or any Next.js host) and set the same `NEXT_PUBLIC_*` env variables in project settings.

## API contracts used

### Event call

`POST /events`

```json
{
   "project_id": 1,
   "user_identifier": "demo_user",
   "event_name": "product_view"
}
```

### Response call

`POST /responses`

```json
{
   "survey_id": 123,
   "user_identifier": "demo_user",
   "response_value": "YES",
   "context_event": "nextjs_demo"
}
```

