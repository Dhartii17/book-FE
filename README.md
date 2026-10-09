# Book Management React Client

React + TypeScript single-page app using Vite, Material UI, React Router, and Axios. It works with the Book Management API.

## Features
- Public book browsing and search
- Register and login
- JWT session handling
- Add books when signed in
- Edit/delete books you created
- Admin can edit/delete any book and view registered users
- Search and pagination
- Role-aware UI with server-side permission enforcement

## Setup

Requirements: Node.js 18+, npm, and the backend running.

1. Open a terminal in this client project directory.
2. Run `npm install`.
3. Copy `.env.example` to `.env` if you need to customize the API URL.
4. Run `npm run dev`.

Default URL: `http://localhost:5173`

### Environment

```env
VITE_API_URL=http://localhost:4000/api
```

## Scripts
- `npm run dev` — start Vite
- `npm run build` — TypeScript check and production build
- `npm run preview` — preview production build

## Authorization notes

The client hides controls the current user cannot use, but the backend independently enforces every permission. Public registration always creates a standard `user`; it cannot grant admin privileges.
