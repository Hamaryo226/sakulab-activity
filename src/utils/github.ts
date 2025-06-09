import { Octokit } from "@octokit/rest";
import { format, subDays, parseISO } from "date-fns";

export interface GitHubConfig {
  org: string;
  token?: string;
}

export interface CommitData {
  date: string;
  commits: number;
  author: string;
  repository: string;
  message: string;
}

export interface RepositoryStats {
  name: string;
  commits: number;
  contributors: number;
  stars: number;
  forks: number;
  language: string;
  lastCommit: string;
  isActive: boolean;
}

export interface ContributorStats {
  login: string;
  name: string;
  avatar_url: string;
  commits: number;
  repositories: string[];
  lastActivity: string;
  isActive: boolean;
}

export interface OrganizationStats {
  totalRepositories: number;
  totalCommits: number;
  totalContributors: number;
  activeRepositories: number;
  activeContributors: number;
  totalStars: number;
  totalForks: number;
}

export class GitHubAnalytics {
  private octokit: Octokit;
  private org: string;
  private isDemo: boolean;
  constructor(config: GitHubConfig) {
    // Use environment variable token if not provided in config
    const token = config.token;

    this.octokit = new Octokit({
      auth: token,
    });
    this.org = config.org;
    this.isDemo = config.org === "demo" || config.org === "sample";
  }

  private getMockRepositories(): any[] {
    return [
      {
        name: "awesome-project",
        stargazers_count: 1250,
        forks_count: 340,
        language: "TypeScript",
        updated_at: "2024-01-15T12:30:00Z",
      },
      {
        name: "web-framework",
        stargazers_count: 890,
        forks_count: 156,
        language: "JavaScript",
        updated_at: "2024-01-14T09:45:00Z",
      },
      {
        name: "data-science-toolkit",
        stargazers_count: 567,
        forks_count: 89,
        language: "Python",
        updated_at: "2024-01-12T16:22:00Z",
      },
      {
        name: "mobile-app",
        stargazers_count: 423,
        forks_count: 78,
        language: "Swift",
        updated_at: "2024-01-10T14:15:00Z",
      },
      {
        name: "machine-learning",
        stargazers_count: 1100,
        forks_count: 230,
        language: "Python",
        updated_at: "2024-01-09T11:30:00Z",
      },
    ];
  }

  private getMockContributors(repo: string): any[] {
    const baseContributors = [
      {
        login: "alice-dev",
        name: "Alice Johnson",
        avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
        contributions: 150,
      },
      {
        login: "bob-coder",
        name: "Bob Smith",
        avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
        contributions: 120,
      },
      {
        login: "charlie-tech",
        name: "Charlie Brown",
        avatar_url: "https://avatars.githubusercontent.com/u/3?v=4",
        contributions: 95,
      },
      {
        login: "diana-dev",
        name: "Diana Wilson",
        avatar_url: "https://avatars.githubusercontent.com/u/4?v=4",
        contributions: 80,
      },
      {
        login: "evan-coder",
        name: "Evan Davis",
        avatar_url: "https://avatars.githubusercontent.com/u/5?v=4",
        contributions: 65,
      },
    ];

    return baseContributors.map((contributor) => ({
      ...contributor,
      contributions: Math.floor(
        contributor.contributions * (0.5 + Math.random())
      ),
    }));
  }

  private getMockCommits(repo: string, since?: Date): any[] {
    const commits = [];
    const now = new Date();
    const days = since
      ? Math.floor((now.getTime() - since.getTime()) / (1000 * 60 * 60 * 24))
      : 30;

    for (let i = 0; i < days; i++) {
      const commitDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const numCommits = Math.floor(Math.random() * 5);

      for (let j = 0; j < numCommits; j++) {
        commits.push({
          commit: {
            author: {
              date: commitDate.toISOString(),
            },
            message: `Fix issue in ${repo} module`,
          },
          author: {
            login: [
              "alice-dev",
              "bob-coder",
              "charlie-tech",
              "diana-dev",
              "evan-coder",
            ][Math.floor(Math.random() * 5)],
          },
        });
      }
    }

    return commits;
  }

  async getOrganizationRepositories(): Promise<any[]> {
    if (this.isDemo) {
      return this.getMockRepositories();
    }

    try {
      const { data } = await this.octokit.repos.listForOrg({
        org: this.org,
        type: "all",
        per_page: 100,
      });
      return data;
    } catch (error) {
      console.error("Error fetching repositories:", error);
      throw error;
    }
  }

  async getRepositoryCommits(repo: string, since?: Date): Promise<any[]> {
    if (this.isDemo) {
      return this.getMockCommits(repo, since);
    }

    try {
      const params: any = {
        owner: this.org,
        repo,
        per_page: 100,
      };

      if (since) {
        params.since = since.toISOString();
      }

      const { data } = await this.octokit.repos.listCommits(params);
      return data;
    } catch (error) {
      console.error(`Error fetching commits for ${repo}:`, error);
      return [];
    }
  }

  async getRepositoryContributors(repo: string): Promise<any[]> {
    if (this.isDemo) {
      return this.getMockContributors(repo);
    }

    try {
      const { data } = await this.octokit.repos.listContributors({
        owner: this.org,
        repo,
        per_page: 100,
      });
      return data;
    } catch (error) {
      console.error(`Error fetching contributors for ${repo}:`, error);
      return [];
    }
  }

  async getOrganizationStats(): Promise<OrganizationStats> {
    const repos = await this.getOrganizationRepositories();
    const thirtyDaysAgo = subDays(new Date(), 30);

    let totalCommits = 0;
    let activeRepositories = 0;
    const contributors = new Set<string>();
    const activeContributors = new Set<string>();
    let totalStars = 0;
    let totalForks = 0;

    for (const repo of repos) {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;

      // Check if repository is active (has commits in last 30 days)
      const recentCommits = await this.getRepositoryCommits(
        repo.name,
        thirtyDaysAgo
      );
      if (recentCommits.length > 0) {
        activeRepositories++;
        recentCommits.forEach((commit) => {
          if (commit.author) {
            activeContributors.add(commit.author.login);
          }
        });
      }

      // Get all contributors
      const repoContributors = await this.getRepositoryContributors(repo.name);
      repoContributors.forEach((contributor) => {
        contributors.add(contributor.login);
      });

      // Get total commits (approximate from contributors API)
      totalCommits += repoContributors.reduce(
        (sum, contributor) => sum + contributor.contributions,
        0
      );
    }

    return {
      totalRepositories: repos.length,
      totalCommits,
      totalContributors: contributors.size,
      activeRepositories,
      activeContributors: activeContributors.size,
      totalStars,
      totalForks,
    };
  }

  async getRepositoryStats(): Promise<RepositoryStats[]> {
    const repos = await this.getOrganizationRepositories();
    const thirtyDaysAgo = subDays(new Date(), 30);

    const repoStats: RepositoryStats[] = [];

    for (const repo of repos) {
      const contributors = await this.getRepositoryContributors(repo.name);
      const recentCommits = await this.getRepositoryCommits(
        repo.name,
        thirtyDaysAgo
      );
      const totalCommits = contributors.reduce(
        (sum, contributor) => sum + contributor.contributions,
        0
      );

      repoStats.push({
        name: repo.name,
        commits: totalCommits,
        contributors: contributors.length,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "Unknown",
        lastCommit: repo.updated_at,
        isActive: recentCommits.length > 0,
      });
    }

    return repoStats.sort((a, b) => b.commits - a.commits);
  }

  async getContributorStats(): Promise<ContributorStats[]> {
    const repos = await this.getOrganizationRepositories();
    const contributorMap = new Map<string, ContributorStats>();
    const thirtyDaysAgo = subDays(new Date(), 30);

    for (const repo of repos) {
      const contributors = await this.getRepositoryContributors(repo.name);
      const recentCommits = await this.getRepositoryCommits(
        repo.name,
        thirtyDaysAgo
      );

      for (const contributor of contributors) {
        if (!contributorMap.has(contributor.login)) {
          contributorMap.set(contributor.login, {
            login: contributor.login,
            name: contributor.name || contributor.login,
            avatar_url: contributor.avatar_url,
            commits: 0,
            repositories: [],
            lastActivity: "",
            isActive: false,
          });
        }

        const stats = contributorMap.get(contributor.login)!;
        stats.commits += contributor.contributions;
        stats.repositories.push(repo.name);

        // Check if contributor is active
        const userRecentCommits = recentCommits.filter(
          (commit) => commit.author && commit.author.login === contributor.login
        );
        if (userRecentCommits.length > 0) {
          stats.isActive = true;
          stats.lastActivity = userRecentCommits[0].commit.author.date;
        }
      }
    }

    return Array.from(contributorMap.values()).sort(
      (a, b) => b.commits - a.commits
    );
  }

  async getCommitActivity(days: number = 30): Promise<CommitData[]> {
    const repos = await this.getOrganizationRepositories();
    const since = subDays(new Date(), days);
    const commitData: CommitData[] = [];

    for (const repo of repos) {
      const commits = await this.getRepositoryCommits(repo.name, since);

      for (const commit of commits) {
        commitData.push({
          date: format(parseISO(commit.commit.author.date), "yyyy-MM-dd"),
          commits: 1,
          author: commit.author?.login || "Unknown",
          repository: repo.name,
          message: commit.commit.message,
        });
      }
    }

    return commitData;
  }
}
