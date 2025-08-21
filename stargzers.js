// import axios from "axios";
import { Octokit } from "octokit";

// GitHub personal access token - needs 'repo' scope
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'adamwong246';
const REPO_NAME = 'testeranto';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getStargazersWithContactInfo() {
  try {
    // Get all stargazers with pagination
    const stargazers = await octokit.paginate(
      octokit.rest.activity.listStargazersForRepo,
      {
        owner: REPO_OWNER,
        repo: REPO_NAME,
        per_page: 100,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    // Get detailed user info including email if public
    const usersWithContact = await Promise.all(
      stargazers.map(async ({ login }) => {
        const { data: user } = await octokit.rest.users.getByUsername({
          username: login,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });

        return {
          username: user.login,
          name: user.name,
          email: user.email,
          twitter: user.twitter_username,
          blog: user.blog,
          company: user.company,
          location: user.location,
          bio: user.bio
        };
      })
    );

    // Filter out users with no contact info
    const contactList = usersWithContact.filter(user =>
      user.email || user.twitter || user.blog
    );

    console.log('Users with contact info:');
    console.table(contactList);

    return contactList;
  } catch (error) {
    console.error('Error fetching stargazers:', error.message);
    if (error.response) {
      console.error('GitHub API response:', error.response.data);
    }
    throw error;
  }
}

// Run the script
getStargazersWithContactInfo();
