import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  time: string;
  category: string;
}

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHackerNews = async () => {
    try {
      const hnResponse = await fetch('/hn-api/topstories.json');
      if (!hnResponse.ok) {
        throw new Error(`HTTP error! status: ${hnResponse.status}`);
      }
      const storyIds = await hnResponse.json();
      
      const storyPromises = storyIds.slice(0, 20).map(async (id: number) => {
        const response = await fetch(`/hn-api/item/${id}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      });

      const stories = await Promise.all(storyPromises);
      
      return stories
        .filter((story: any) => {
          const keywords = ['security', 'hack', 'vulnerability', 'breach', 'cyber', 'malware', 'ransomware', 'exploit', 'attack', 'threat'];
          return story && story.url && keywords.some(keyword => 
            story.title.toLowerCase().includes(keyword) ||
            (story.text && story.text.toLowerCase().includes(keyword))
          );
        })
        .map((story: any) => ({
          title: story.title,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          source: 'Hacker News',
          time: formatDistanceToNow(new Date(story.time * 1000), { addSuffix: true }),
          category: getCategoryFromTitle(story.title)
        }));
    } catch (error) {
      console.error('Error fetching from Hacker News:', error);
      return [];
    }
  };

  const fetchSecurityWeekRSS = async () => {
    try {
      // Using a CORS proxy to fetch SecurityWeek RSS feed
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.securityweek.com/feed/');
      const data = await response.json();
      
      if (data.status === 'ok' && data.items) {
        return data.items.map((item: any) => ({
          title: item.title,
          url: item.link,
          source: 'SecurityWeek',
          time: formatDistanceToNow(new Date(item.pubDate), { addSuffix: true }),
          category: getCategoryFromTitle(item.title)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching from SecurityWeek:', error);
      return [];
    }
  };

  const fetchTheHackerNewsRSS = async () => {
    try {
      // Using a CORS proxy to fetch The Hacker News RSS feed
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews');
      const data = await response.json();
      
      if (data.status === 'ok' && data.items) {
        return data.items.map((item: any) => ({
          title: item.title,
          url: item.link,
          source: 'The Hacker News',
          time: formatDistanceToNow(new Date(item.pubDate), { addSuffix: true }),
          category: getCategoryFromTitle(item.title)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching from The Hacker News:', error);
      return [];
    }
  };

  const getCategoryFromTitle = (title: string): string => {
    const categories = {
      'Ransomware': ['ransomware', 'ransom'],
      'Malware': ['malware', 'virus', 'trojan'],
      'Data Breach': ['breach', 'leak', 'exposed'],
      'Vulnerability': ['vulnerability', 'exploit', 'flaw', 'bug'],
      'Cyber Attack': ['attack', 'hack', 'compromise'],
      'Privacy': ['privacy', 'gdpr', 'data protection'],
      'Cloud Security': ['cloud', 'aws', 'azure', 'gcp'],
      'Network Security': ['network', 'firewall', 'router'],
      'Mobile Security': ['android', 'ios', 'mobile'],
      'IoT Security': ['iot', 'device', 'smart']
    };

    const titleLower = title.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        return category;
      }
    }
    return 'Cybersecurity';
  };

  const fetchAllNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hnNews, swNews, thnNews] = await Promise.all([
        fetchHackerNews(),
        fetchSecurityWeekRSS(),
        fetchTheHackerNewsRSS()
      ]);

      // Combine and sort news by time
      const allNews = [...hnNews, ...swNews, ...thnNews]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 12); // Show top 12 most recent news

      setNews(allNews);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
    // Refresh news every 5 minutes
    const interval = setInterval(fetchAllNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
        <button 
          onClick={fetchAllNews}
          className="ml-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Newspaper className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold">Latest Cyber News</h2>
        </div>
        <button 
          onClick={fetchAllNews}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          Refresh News
        </button>
      </div>
      {news.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No security news available at the moment
          <button 
            onClick={fetchAllNews}
            className="ml-4 text-blue-400 hover:text-blue-300 transition"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <button
              key={index}
              onClick={(e) => handleNewsClick(item.url, e)}
              className="text-left bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
                  {item.category}
                </span>
                <span className="text-sm text-gray-400">{item.source}</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-400 transition flex items-start">
                <span>{item.title}</span>
                <ExternalLink className="inline-block ml-2 w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
              </h3>
              <div className="text-sm text-gray-400">
                {item.time}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;