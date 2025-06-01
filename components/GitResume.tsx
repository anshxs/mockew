'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Instagram, Github } from 'lucide-react';

interface DeveloperResumeCardProps {
  githubUsername: string;
  instagramHandle?: string;
  email?: string;
}

export const DeveloperResumeCard: React.FC<DeveloperResumeCardProps> = ({
  githubUsername,
  instagramHandle,
  email
}) => {
  const [userData, setUserData] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [topLanguages, setTopLanguages] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const [userRes, repoRes] = await Promise.all([
          fetch(`https://api.github.com/users/${githubUsername}`),
          fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`)
        ]);

        if (!userRes.ok || !repoRes.ok) throw new Error('GitHub user not found.');

        const userData = await userRes.json();
        const reposData = await repoRes.json();

        const languages: { [key: string]: number } = {};
        for (const repo of reposData) {
          if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
          }
        }

        setUserData(userData);
        setRepos(reposData);
        setTopLanguages(languages);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [githubUsername]);

  if (loading) return <div className="text-center py-10">Loading GitHub profile...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl border">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img src={userData.avatar_url} alt={userData.login} className="w-28 h-28 rounded-full border" />
        <div>
          <h2 className="text-3xl font-bold">{userData.name || userData.login}</h2>
          <p className="text-gray-600">@{userData.login}</p>
          <p className="text-sm mt-2 max-w-md">{userData.bio}</p>

          <div className="mt-3 flex gap-4 text-sm text-gray-500">
            {userData.location && <span>📍 {userData.location}</span>}
            <span>👥 {userData.followers} followers</span>
          </div>

          {/* Social links */}
          <div className="flex gap-4 mt-4 text-gray-600">
            <a href={`https://github.com/${githubUsername}`} target="_blank" className="hover:text-black">
              <Github className="w-5 h-5" />
            </a>
            {instagramHandle && (
              <a href={`https://instagram.com/${instagramHandle}`} target="_blank" className="hover:text-pink-600">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="hover:text-blue-600">
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <hr className="my-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
        <div><strong>Public Repos:</strong> {userData.public_repos}</div>
        <div><strong>Gists:</strong> {userData.public_gists}</div>
        <div><strong>Followers:</strong> {userData.followers}</div>
        <div><strong>Following:</strong> {userData.following}</div>
      </div>

      {/* Top Languages */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Top Languages</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(topLanguages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang, count]) => (
              <span key={lang} className="px-3 py-1 bg-gray-100 rounded-full text-sm border border-gray-300">
                {lang} ({count})
              </span>
            ))}
        </div>
      </div>

      {/* Top Repositories */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Top Repositories</h3>
        <ul className="space-y-3">
          {repos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5)
            .map((repo) => (
              <li key={repo.id} className="border p-3 rounded-lg bg-gray-50">
                <a
                  href={repo.html_url}
                  className="font-semibold text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
                <p className="text-sm text-gray-600">{repo.description}</p>
                <div className="text-xs mt-1 flex gap-4 text-gray-500">
                  ⭐ {repo.stargazers_count} • 🍴 {repo.forks_count}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
