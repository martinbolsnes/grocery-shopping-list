# List App

A Next.js application for managing grocery lists with Prisma Postgres, and Pusher for real-time updates and sharing functionality.

## 🚀 Features

- ✅ User Authentication (Session-based authentication using auth.js)
- ✅ Create & Manage Lists (CRUD operations with Prisma)
- ✅ Share Lists (Invite others via email to collaborate on lists)
- ✅ Real-Time Updates (Pusher WebSockets for instant list updates)
- ✅ Prisma Accelerate (Optimized database queries with caching)

## 🛠️ Tech Stack

- Frontend: Next.js (App Router & Server Actions)
- Backend: Prisma Postgres
- Real-Time Updates: Pusher
- Authentication: Auth.js
- Deployment: Vercel

## 📦 Installation & Setup

1️⃣ Clone the Repository

```bash
git clone https://github.com/martinbolsnes/grocery-shopping-list.git
cd grocery-shopping-list
```

2️⃣ Install Dependencies

```bash
npm install
```

3️⃣ Configure Environment Variables

Create a .env file in the root directory and add the following:

```bash
DATABASE_URL="postgresql://your-prisma-postgres-db-url"
NEXTAUTH_SECRET="your-auth-secret"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"
```

4️⃣ Run Database Migrations

```bash
npx prisma migrate dev --name init
```

5️⃣ Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
