import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaDatabase } from "react-icons/fa";
import axios from "axios";

// Define the type for the API response
interface ApiResponse {
  result: Dataset;
}

// Define dataset state type
interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  download_link: string;
  tags?: { name: string }[];
  resources?: { url: string }[];
  notes?: string;
  [key: string]: any;
}

// Define route params type
interface RouteParams extends Record<string, string | undefined> {
  id: string;
}

const DatasetDetailsPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatasetDetails = async () => {
      if (!id) {
        setError("Dataset ID not provided");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(
          `https://ckan.publishing.service.gov.uk/api/3/action/package_show?id=${id}`
        );
        console.log("API Response:", response.data);

        const datasetData = response.data.result;

        setDataset({
          id: datasetData.id,
          title: datasetData.title || "Untitled Dataset",
          description: datasetData.notes || "No description available",
          category: datasetData.tags?.[0]?.name || "Uncategorized",
          download_link: datasetData.resources?.[0]?.url || "#",
          tags: datasetData.tags || [],
          resources: datasetData.resources || [],
          notes: datasetData.notes,
        });
      } catch (error) {
        console.error("Error fetching dataset details:", error);
        setError("Failed to fetch dataset details");
      } finally {
        setLoading(false);
      }
    };

    fetchDatasetDetails();
  }, [id]);

  if (loading) {
    return <p className="text-white text-center">Loading dataset details...</p>;
  }

  if (error) {
    return <p className="text-white text-center">{error}</p>;
  }

  if (!dataset) {
    return (
      <p className="text-white text-center">Dataset not found or unavailable</p>
    );
  }

  const handleDownload = () => {
    if (dataset.download_link && dataset.download_link !== "#") {
      window.open(dataset.download_link, "_blank");
    } else {
      alert("Download link not available");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center p-8 text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center text-center">
          <FaDatabase className="text-4xl text-green-400 mb-3" />
          <h2 className="text-2xl font-bold mb-2">{dataset.title}</h2>
          <p className="text-sm text-gray-400 mb-4">
            Category: {dataset.category}
          </p>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-3 bg-green-500 text-black text-center rounded-lg hover:bg-green-400 transition"
          >
            <FaDownload /> Download Dataset
          </button>
        </div>

        <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Dataset Details</h3>
          <p className="text-gray-300 leading-relaxed">
            {dataset.description}
          </p>

          {/* Tags */}
          {dataset.tags && dataset.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {dataset.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extra resources */}
          {dataset.resources && dataset.resources.length > 1 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-2">Additional Resources:</h4>
              <ul className="list-disc list-inside text-gray-300">
                {dataset.resources.slice(1).map((res, index) => (
                  <li key={index}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Resource {index + 2}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Placeholder for visual preview */}
          <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p className="text-gray-500 italic">
              [Dataset preview visualization will go here]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailsPage;
