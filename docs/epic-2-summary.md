### Epic 2 Post-Mortem: The Data Engines
**1. What Was Done**
* Engineered a GitHub data fetcher (`lib/github.ts`) using the official GitHub GraphQL API and a Personal Access Token.
* Upgraded the GitHub algorithm to calculate Calendar-Aligned stats (Daily, Weekly, Monthly, Yearly) from the raw contribution graph.
* Engineered a LeetCode data fetcher (`lib/leetcode.ts`) by reverse-engineering their internal GraphQL API.
* Implemented a professional terminal testing suite (`scripts/test-engines.ts`) using `tsx` to test backend utilities without polluting the Next.js UI.

**2. Architectural Decisions**
* **The Cron Model:** Decided to run global stat syncs via a scheduled Cron Job rather than on-demand. With 600 users, syncing 8 times an hour costs ~4,800 points, keeping us safely under GitHub's 5,000 pts/hr global rate limit.
* **Volume over Weight:** Chose to rank LeetCode users by total volume of problems solved rather than a weighted difficulty score to optimize for the behavior of daily consistency.
* **Stat History:** Determined that `User` table columns alone cannot support historical weekly/monthly leaderboards. A separate historical ledger table will be required.