### Epic 1  Identity & Access(AUTH)

**1. What Was Done**
* Implemented delegated authentication (OAuth) using Auth.js (NextAuth v5).
* Registered a secure Developer Application within GitHub to obtain Client ID and Client Secret keys.
* Upgraded the Prisma database schema to include mandatory Auth.js tables (Account, Session) alongside custom User fields.
* Engineered a Next.js catch-all API route (app/api/auth/[...nextauth]/route.ts) to handle all authentication callbacks seamlessly.
* Verified end-to-end data flow by capturing a live GitHub profile and storing it in the Neon PostgreSQL database.

**2. What Was Learned**
* **OAuth Architecture:** Delegating login to trusted providers (GitHub) eliminates the massive security liability of storing and hashing user passwords.
* **Catch-All Routing:** Next.js uses bracket syntax ([...folderName]) to intercept multi-level dynamic URLs, allowing a single API file to process dozens of different authentication endpoints (signin, signout, callbacks).
* **Package Management:** Understanding the difference between package.json (the high-level grocery list) and package-lock.json (the exact dependency tree receipt) is crucial for environment stability.
* **Atomic Commits:** Separating dependency installations from logic changes in Git creates a clean, readable version history.

**3. Problems Encountered & Resolved**
* **Blocker:** VS Code highlighted a missing PrismaClient export.
  * **Root Cause:** The TypeScript compiler was reading a cached, empty shell of the @prisma/client package.
  * **Solution:** Manually ran `npx prisma generate` to rebuild the customized types based on our schema, followed by restarting the VS Code TypeScript server.
* **Blocker:** Triggering the login route resulted in a PrismaClientInitializationError.
  * **Root Cause:** Prisma v7 strictly enforces database connection decoupling. The constructor no longer accepts an empty initialization when the URL is removed from the schema.
  * **Solution:** Installed the official PostgreSQL adapter (@prisma/adapter-pg and pg), explicitly initialized the driver with our connection string, and passed it into the PrismaClient constructor.