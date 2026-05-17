# 7YA Civic Intelligence OS (Modular Blueprint)

## Stack
- Frontend: React + Vite (mobile-first, dark operational UI)
- Auth: Firebase Auth
- Database: Firestore
- Access control: Role-based Firestore rules
- Languages: Hebrew (RTL), Russian, English

## Module Map (`/src`)
- `app/App.tsx`: top-level route shell
- `modules/civic-radar`: public issue reporting and review intake
- `modules/needs-intelligence`: clustering and neutral civic insight generation
- `modules/community-magazine`: daily multilingual draft content
- `modules/starton`: youth/volunteer/mentor/partner flows
- `modules/trust-compliance`: trust policy and data-rights UX
- `modules/admin-ops`: operations console for authorized staff
- `lib/types.ts`: shared domain types
- `lib/firebase-schema.md`: Firestore collections and field contract

## Setup
1. Create Firebase project and enable Email/Google auth providers.
2. Add web app config to `.env` for your Vite frontend.
3. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
4. Implement role claim sync from Firebase Auth to `users/{uid}.role`.
5. Run the app locally with Vite and connect Firestore SDK.

## Governance Notes
- Not designed for political persuasion, targeting, or behavioral manipulation.
- All insight exports must be anonymized and aggregate-first.
- Human review required before actioning sensitive reports.
