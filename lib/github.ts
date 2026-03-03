export interface GithubStats {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number; // Rolling 365 days
}

export async function fetchGithubStats(username: string): Promise<GithubStats> {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    throw new Error("CRITICAL: GITHUB_ACCESS_TOKEN is missing from .env");
  }

  // 1. Upgraded Query: Now asking for day-by-day data
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GitHub user "${username}" not found or API denied access.`);
  }

  const calendar = result.data.user.contributionsCollection.contributionCalendar;
  
  // 2. The Algorithm: Flattening the nested weeks into a single array of days
  const allDays = calendar.weeks.flatMap((week: any) => week.contributionDays);
  
// 3. Time Parsing (Calendar-Aligned)
  const todayData = allDays[allDays.length - 1]; // e.g., "2026-03-03"
  const daily = todayData.contributionCount;

  // Calculate Monthly: Calendar Month (e.g., "2026-03")
  const currentMonthPrefix = todayData.date.substring(0, 7); 
  const monthly = allDays
    .filter((day: any) => day.date.startsWith(currentMonthPrefix))
    .reduce((sum: number, day: any) => sum + day.contributionCount, 0);

  // Calculate Yearly: Calendar Year (e.g., "2026")
  const currentYearPrefix = todayData.date.substring(0, 4);
  const yearly = allDays
    .filter((day: any) => day.date.startsWith(currentYearPrefix))
    .reduce((sum: number, day: any) => sum + day.contributionCount, 0);

  // Calculate Weekly: Resets every Monday
  const todayDateObj = new Date(todayData.date);
  const dayOfWeek = todayDateObj.getUTCDay(); // 0 is Sunday, 1 is Monday...
  
  // Find out how many days it has been since Monday. 
  // If today is Tuesday (2), it's been 1 day. If Sunday (0), it's been 6 days.
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
  
  // Slice only the days from this current week
  const thisWeekDays = allDays.slice(-(daysSinceMonday + 1));
  const weekly = thisWeekDays.reduce((sum: number, day: any) => sum + day.contributionCount, 0);

    // 4. Return the structured object
    return { daily, weekly, monthly, yearly };
  }