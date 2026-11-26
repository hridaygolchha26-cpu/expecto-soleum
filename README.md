# Expecto Soleum

Expecto Soleum is a prototype football-boot fit discovery app. It helps users compare football boots using manually entered foot length and forefoot width, with a visual 3D foot model and a small demonstration catalogue.

**Demo:** https://expecto-soleum.vercel.app

## What the prototype includes

- Foot-length and forefoot-width input
- A 3D visual representation of the entered measurements
- A searchable football-boot catalogue with configured fit information
- Estimated fit comparisons based on the catalogue data
- Cart and simulated checkout
- Supabase email authentication
- Saved measurement profiles and favourite boots
- Demo order history for signed-in users

## Important limitations

This is a demonstration project, not a live retailer. Catalogue availability, prices and fit information are illustrative and must be verified with the manufacturer or retailer. Fit scores are estimates, not a guarantee of comfort or suitability.

Checkout does not collect payment information, book a courier, or dispatch products. Do not enter real shipping or payment details. Demo orders only create a simulated reference in the signed-in user's account.

## Tech stack

- React 18 and Vite
- Tailwind CSS
- Three.js
- Supabase Auth and Postgres with Row Level Security
- Vercel hosting

## Local development

Requirements: Node.js and npm.

```bash
npm install
```

Create a `.env.local` file in the project root with the Supabase project URL and publishable key:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Then run:

```bash
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Project status

The current hosted version is a preview/demo deployment. A production release requires final end-to-end testing, production environment configuration, security settings review and an explicit release decision.
