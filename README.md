# Terrarium

A modern web application built with **Next.js**, **Tailwind CSS**, and **TypeScript**.

## Stack

| Tool | Version |
|---|---|
| [Next.js](https://nextjs.org) | 16 (App Router) |
| [Tailwind CSS](https://tailwindcss.com) | 4 |
| [TypeScript](https://www.typescriptlang.org) | 5 |
| [React](https://react.dev) | 19 |

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
└── app/
    ├── layout.tsx   # Root layout with fonts and metadata
    ├── page.tsx     # Home page
    └── globals.css  # Global styles and Tailwind import
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Lint source files |

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com/new). See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other options.
