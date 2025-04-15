import React, { useState, useEffect } from "react";
import axios from "axios";
import DatasetList from "../components/DatasetList";
import { useNavigate } from "react-router-dom";

interface Dataset {
  id: string;
  title: string;
  description: string;
  category: string;
  download_link: string;
}

interface NewDataset {
  title: string;
  source: string;
  category: string;
  description: string;
  file: File | null;
}

interface ApiResponse {
  result: {
    results: Array<{
      id: string;
      title: string;
      notes?: string;
      tags?: Array<{ name: string }>;
      resources?: Array<{ url: string }>;
    }>;
  };
}

const DatasetsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);
      const url = `https://ckan.publishing.service.gov.uk/api/3/action/package_search?q=${searchTerm}`;

      try {
        const response = await axios.get<ApiResponse>(url);
        console.log("API Response:", response.data);

        if (response.data?.result?.results) {
          const formattedDatasets: Dataset[] = response.data.result.results.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.notes || "No description available",
            category: item.tags?.[0]?.name || "Uncategorized",
            download_link: item.resources?.[0]?.url || "#",
          }));
          setDatasets(formattedDatasets);
        } else {
          console.error("Invalid response format: results field is missing");
          setDatasets([]);
        }
      } catch (error) {
        console.error("Error fetching datasets:", error);
        
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
          });
        } else if (error instanceof Error) {
          console.error("Native error:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [searchTerm, selectedCategory]);

  const handleViewDataset = (dataset: Dataset) => {
    navigate(`/datasets/${dataset.id}`, { state: { dataset } });
  };

  const filteredDatasets = datasets.filter((dataset) => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const matchesCategory = selectedCategory === "All" || dataset.category === selectedCategory;
    const matchesSearch =
      dataset.title?.toLowerCase().includes(lowerSearchTerm) ||
      dataset.description?.toLowerCase().includes(lowerSearchTerm);

    return matchesCategory && matchesSearch;
  });

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [newDataset, setNewDataset] = useState<NewDataset>({
    title: "",
    source: "",
    category: "Real Estate",
    description: "",
    file: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDataset({ ...newDataset, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDataset({ ...newDataset, file: e.target.files ? e.target.files[0] : null });
  };

  const handleUpload = () => {
    if (!newDataset.title || !newDataset.source || !newDataset.file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    const uploadedDataset: Dataset = {
      id: (datasets.length + 1).toString(),
      title: newDataset.title,
      description: newDataset.description,
      category: newDataset.category,
      download_link: URL.createObjectURL(newDataset.file),
    };

    setDatasets([...datasets, uploadedDataset]);
    setIsUploadOpen(false);
    setNewDataset({
      title: "",
      source: "",
      category: "Real Estate",
      description: "",
      file: null,
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Research Datasets</h1>

        <div className="mb-6 flex items-center bg-gray-800 rounded-lg p-2">
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-400 transition mr-4"
          >
            + Upload Dataset
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 bg-gray-800 text-white rounded-lg border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="All">All Categories</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Social Media">Social Media</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <DatasetList datasets={filteredDatasets} onViewDataset={handleViewDataset} />
        )}

        {isUploadOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
              <h2 className="text-2xl font-semibold mb-4">Upload Dataset</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={newDataset.title}
                  onChange={handleInputChange}
                  placeholder="Dataset Title"
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />

                <input
                  type="text"
                  name="source"
                  value={newDataset.source}
                  onChange={handleInputChange}
                  placeholder="Source (e.g., Kaggle, GitHub)"
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />

                <select
                  name="category"
                  value={newDataset.category}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="Real Estate">Real Estate</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                </select>

                <textarea
                  name="description"
                  value={newDataset.description}
                  onChange={handleInputChange}
                  placeholder="Short Description"
                  rows={3}
                  className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />

                <div className="border border-dashed border-gray-600 rounded p-4">
                  <label className="block mb-2 text-sm font-medium">Dataset File</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="bg-green-500 px-4 py-2 rounded text-black font-semibold hover:bg-green-400 transition"
                >
                  Upload Dataset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetsPage;