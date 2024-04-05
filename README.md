## Before Getting Started

Make sure you already install NodeJS v18+ and NPM Packages

## Getting Started

First, run installation:

```bash
npm install
```

Second, rename .env.example to .env or copy .env.example and name it .env

Third, fill all the .env if needed to change then change it

Fourth, run migration

```bash
npx prisma db push
# if needed to install then install it
```

Fifth, run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
