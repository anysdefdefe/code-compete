// scripts/test-engines.ts
import { fetchGithubStats } from "../lib/github";
import { fetchLeetCodeStats } from "../lib/leetcode";
import * as dotenv from "dotenv";

dotenv.config();

async function runTest() {
  const githubUsername = "anysdefdefe"; // Change this to your GitHub username
  const leetcodeUsername = "JmJVGuQHs4"; // Change this to your LeetCode username

  console.log(`\n Firing up Data Engines...`);

  try {
    console.log(`\nfetching GitHub stats for [${githubUsername}]...`);
    const githubData = await fetchGithubStats(githubUsername);
    console.table(githubData);

    console.log(`\nfetching LeetCode stats for [${leetcodeUsername}]...`);
    const leetcodeData = await fetchLeetCodeStats(leetcodeUsername);
    console.table(leetcodeData);

    console.log(`\n All engines green.`);
  } catch (error) {
    console.error(`\n Engine Failure:`, error);
  }
}

runTest();