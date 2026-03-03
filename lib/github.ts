export async function fetchGithubStats(username: string) {
    // Safety Gate: Check for the token before making the request
    if (!process.env.GITHUB_ACCESS_TOKEN) {
        throw new Error("GITHUB_ACCESS_TOKEN is not defined in environment variables");
    }


    const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
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
        body: JSON.stringify({
            query,
            variables: { username },
        }),
    });

    const data = await response.json();

    if (data.errors) {
        throw new Error(data.errors[0].message);
    }

    // Digging into the GraphQL response object to return just the number
    return data.data.user.contributionsCollection.contributionCalendar.totalContributions;
}