# Ecomerce Frontend (Next.js App Router)

Modern ecommerce storefront frontend with runtime survey triggers integrated to `surveyaibackend`.

## Requirements

- Node.js 18+
- npm 9+

## Local setup

1. Install dependencies:
	- `npm install`
2. Copy `.env.example` to `.env` and set values.
3. Start development server:
	- `npm run dev`

Open `http://localhost:3000`.

## Environment variables

- `NEXT_PUBLIC_SURVEY_API_BASE_URL` (required)
- `NEXT_PUBLIC_SURVEY_PROJECT_ID` (optional but recommended for production)

## Production build

- `npm run build`
- `npm run start`

## Deploy (Vercel recommended)

1. Import this repository into Vercel.
2. Set environment variables from `.env.example`.
3. Deploy.

### Notes

- If `NEXT_PUBLIC_SURVEY_PROJECT_ID` is not set, the app auto-resolves a project from backend `/projects`.
- For deterministic production behavior, always set `NEXT_PUBLIC_SURVEY_PROJECT_ID` explicitly.
