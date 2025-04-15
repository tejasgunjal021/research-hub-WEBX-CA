import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import axios, { AxiosError } from "axios";

interface Paper {
  id: number;
  title: string;
  author: string;
  link: string;
}

const Home: React.FC = () => {
  const [trendingPapers, setTrendingPapers] = useState<Paper[]>([]);
  const [datasets, setDatasets] = useState<Paper[]>([]);
  const [researchPapers, setResearchPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const API_URLS = {
    trending: "https://api.core.ac.uk/v3/search/works/?q=trending",
    datasets: "https://ckan.publishing.service.gov.uk/api/3/action/package_search?q=latest",
    research: "https://api.core.ac.uk/v3/search/works/?q=latest",
  };

  const fetchData = async (
    type: keyof typeof API_URLS,
    setData: React.Dispatch<React.SetStateAction<Paper[]>>
  ) => {
    setLoading(true);
    try {
      const response = await axios.get<{ results: Paper[] }>(API_URLS[type]);

      const validResults = response.data.results.filter((paper: any) =>
        paper.id && paper.title && paper.author && paper.link
      );

      if (validResults.length > 0) {
        setData(validResults.slice(0, 4));
      } else {
        throw new Error("No valid data found");
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setData([]); // Fallback to empty array if there's an error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData("trending", setTrendingPapers);
    fetchData("datasets", setDatasets);
    fetchData("research", setResearchPapers);
  }, []);

  const fallbackTrending: Paper[] = [
    { id: 1, title: "AI in Healthcare", author: "Dr. John Doe", link: "#" },
    { id: 2, title: "Quantum Computing Advances", author: "Dr. Jane Smith", link: "#" },
    { id: 3, title: "Blockchain for Security", author: "Prof. Alan Turing", link: "#" },
    { id: 4, title: "Neural Networks in Robotics", author: "Dr. Ada Lovelace", link: "#" },
  ];

  const fallbackDatasets: Paper[] = [
    { id: 1, title: "Medical Imaging Dataset", author: "OpenAI Dataset", link: "#" },
    { id: 2, title: "COVID-19 Research Data", author: "WHO", link: "#" },
    { id: 3, title: "Satellite Image Dataset", author: "NASA", link: "#" },
    { id: 4, title: "Financial Market Data", author: "Bloomberg", link: "#" },
  ];

  const fallbackResearchPapers: Paper[] = [
    { id: 1, title: "Deep Learning for NLP", author: "Yann LeCun", link: "#" },
    { id: 2, title: "Advances in Computer Vision", author: "Fei-Fei Li", link: "#" },
    { id: 3, title: "Quantum Algorithms Overview", author: "David Deutsch", link: "#" },
    { id: 4, title: "Cybersecurity Trends", author: "Bruce Schneier", link: "#" },
  ];

  return (
    <div className="bg-gray-900 text-white pt-20 px-6 flex flex-col items-center justify-center mt-10">
      {/* Hero Section */}
      <div className="relative w-full">
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-40"></div>
        <div className="relative text-center max-w-3xl mx-auto py-20">
          <h1 className="text-4xl md:text-5xl font-bold">The Future of Research Collaboration</h1>
          <p className="mt-4 text-lg text-gray-300">
            Discover, discuss, and collaborate on research papers, datasets, and trending discussions.
          </p>
          <div className="mt-6 flex space-x-4 justify-center">
            <Link to="/signup" className="px-6 py-2 bg-neonPink text-white rounded-full shadow-neon hover:opacity-80">
              Get Started
            </Link>
            <Link to="/research" className="px-6 py-2 bg-neonGreen text-white rounded-full shadow-neon hover:opacity-80">
              Browse Research
            </Link>
          </div>
        </div>
      </div>

      <Section
        title="Trending Research Papers"
        link="/research-papers"
        papers={trendingPapers.length === 0 ? fallbackTrending : trendingPapers}
      />

      <Section
        title="Datasets"
        link="/datasets"
        papers={datasets.length === 0 ? fallbackDatasets : datasets}
      />

      <Section
        title="Research Papers"
        link="/research-papers"
        papers={researchPapers.length === 0 ? fallbackResearchPapers : researchPapers}
      />
    </div>
  );
};

interface SectionProps {
  title: string;
  link: string;
  papers: Paper[];
}

const Section: React.FC<SectionProps> = ({ title, link, papers }) => {
  return (
    <div className="max-w-7xl mx-auto my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Link to={link} className="text-green-400 hover:text-green-300 transition duration-300">
          View All → 
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {papers.map((paper) => (
          <Card key={paper.id} title={paper.title} author={paper.author} link={paper.link} />
        ))}
      </div>
    </div>
  );
};

export default Home;
