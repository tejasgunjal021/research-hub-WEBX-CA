import React from "react";
import { Link } from "react-router-dom";

// Define types for props
interface SectionProps {
  title: string;
  link: string;
  data: { id: string; title: string; author?: string; source?: string }[];
}

const Section: React.FC<SectionProps> = ({ title, link, data }) => {
  return (
    <div className="max-w-7xl mx-auto my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Link to={link} className="text-green-400 hover:text-green-300 transition duration-300">
          View All → 
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.length > 0 ? (
          data.slice(0, 4).map((item) => (
            <div key={item.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.author || item.source}</p>
              <Link to={`/item/${item.id}`} className="text-green-400 hover:underline mt-2 block">
                Read More →
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default Section;
