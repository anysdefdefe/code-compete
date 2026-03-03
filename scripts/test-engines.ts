// scripts/test-engines.ts
import { fetchGithubStats } from "../lib/github";
import * as dotenv from "dotenv";

dotenv.config();

async function runTest() {
  const username = "anysdefdefe"; // Ensure your username is here
  console.log(`🚀 Testing Upgraded GitHub Engine for: ${username}...`);

  try {
    const stats = await fetchGithubStats(username);
    console.log(`✅ Success! Extracted Stats:`);
    console.table(stats); // Use console.table for a beautiful terminal output!
  } catch (error) {
    console.error(`❌ Test Failed:`, error);
  }
}

runTest();