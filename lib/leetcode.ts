// lib/leetcode.ts

export interface LeetCodeStats {
  easy: number;
  medium: number;
  hard: number;
  totalSolved: number;
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://leetcode.com",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  const result = await response.json();

  if (result.errors || !result.data?.matchedUser) {
    throw new Error(`LeetCode user "${username}" not found or API error.`);
  }

  const stats = result.data.matchedUser.submitStats.acSubmissionNum;

  const easy = stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
  const medium = stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
  const hard = stats.find((s: any) => s.difficulty === "Hard")?.count || 0;
  const totalSolved = stats.find((s: any) => s.difficulty === "All")?.count || 0;

  return { easy, medium, hard, totalSolved };
}