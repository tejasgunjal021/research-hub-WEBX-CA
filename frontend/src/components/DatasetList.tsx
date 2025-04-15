import React from "react";
import { useNavigate } from "react-router-dom";

// Define the shape of dataset props
interface Dataset {
  id: string;
  title: string;
  category: string;
  description: string;
  download_link: string;
}

interface DatasetListProps {
  datasets: Dataset[];
  onViewDataset: (dataset: Dataset) => void;
}

const DatasetList: React.FC<DatasetListProps> = ({ datasets = [], onViewDataset }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {datasets.map((dataset) => (
        <div
          key={dataset.id}
          tabIndex={0}
          role="button"
          onClick={() => navigate(`${dataset.id}`)} // 👈 Navigate to details page
          onKeyDown={(e) => e.key === "Enter" && navigate(`/datasets/${dataset.id}`)}
          className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-white">
            {dataset.title || "Untitled"}
          </h3>
          <p className="text-sm text-green-400 mb-1">
            Category: {dataset.category || "Uncategorized"}
          </p>
          <p className="text-gray-300 mb-4 truncate">
            {dataset.description || "No description available."}
          </p>
          <p className="text-green-400 hover:text-green-300 transition duration-300">
            View Dataset →
          </p>
        </div>
      ))}
    </div>
  );
};

export default DatasetList;
