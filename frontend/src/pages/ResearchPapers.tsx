import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Define types for paper and the state variables
interface Author {
  name: string;
}

interface Paper {
  title: string;
  authors: Author[];
  description: string;
  abstract?: string;
  publishedDate?: string;
  downloadUrl: string;
}

interface NewPaper {
  title: string;
  author: string;
  description: string;
  file: File | null;
}

const ResearchPapers: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]); // Store research papers
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search input value
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [showUploadForm, setShowUploadForm] = useState<boolean>(false); // Toggle upload form
  const [newPaper, setNewPaper] = useState<NewPaper>({
    title: "",
    author: "",
    description: "",
    file: null,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Function to fetch research papers
  const fetchPapers = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://api.core.ac.uk/v3/search/works/?q=${searchTerm || "latest"}`
      );
      setPapers(response.data.results || []);
    } catch (error) {
      setError("Error fetching research papers");
      console.error(error);
    }
    setLoading(false);
  };

  // Fetch papers when the component loads or search term changes
  useEffect(() => {
    fetchPapers();
  }, [searchTerm]);

  // Handle form input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewPaper({ ...newPaper, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setNewPaper({ ...newPaper, file: e.target.files[0] });
    }
  };

  // Handle form submission (Mock Upload)
  const handleUpload = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newPaper.title || !newPaper.author || !newPaper.description || !newPaper.file) {
      alert("Please fill all fields and upload a file.");
      return;
    }

    // Mock adding paper (In a real app, send this data to the backend)
    const newEntry: Paper = {
      title: newPaper.title,
      authors: [{ name: newPaper.author }],
      description: newPaper.description,
      publishedDate: new Date().toISOString(),
      downloadUrl: "#",
    };

    setPapers([newEntry, ...papers]); // Add new paper to list
    setShowUploadForm(false); // Hide form
    setNewPaper({ title: "", author: "", description: "", file: null }); // Reset form
    alert("Paper uploaded successfully!");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Research Papers</h1>

        {/* Search Bar */}
        <div className="mb-6 flex items-center bg-gray-800 rounded-lg p-2">
          <input
            type="text"
            placeholder="Search research papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400 mr-3"
          />
          <button
            onClick={fetchPapers}
            className="bg-green-500 text-black px-6 py-2 rounded-lg hover:bg-green-400 transition"
          >
            Search
          </button>
        </div>

        {/* Upload Paper Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-black px-6 py-2 rounded-lg hover:bg-green-400 transition"
          >
            Upload Research Paper
          </button>
        </div>

        {/* Upload Paper Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Upload Research Paper</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
              >
                ✖
              </button>
              <form onSubmit={handleUpload}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={newPaper.title}
                  onChange={handleInputChange}
                  className="w-full p-3 mb-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400"
                  required
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={newPaper.author}
                  onChange={handleInputChange}
                  className="w-full p-3 mb-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newPaper.description}
                  onChange={handleInputChange}
                  className="w-full p-3 mb-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-400"
                  required
                />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full p-3 mb-3 bg-gray-700 text-white rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 text-black px-6 py-2 rounded-lg hover:bg-green-400 transition"
                >
                  Upload Paper
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && <p className="text-center text-lg">Loading...</p>}

        {/* Error Message */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Research Paper Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {papers.length > 0 ? (
            papers.map((paper, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{paper.title || "No Title"}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Authors:</strong>
                  {paper.authors && paper.authors.length > 0
                    ? paper.authors.length > 5
                      ? paper.authors.slice(0, 5).map((a) => a.name).join(", ") +
                        `, +${paper.authors.length - 5} more`
                      : paper.authors.map((a) => a.name).join(", ")
                    : "Unknown"}
                </p>
                <p className="text-gray-300 mb-4 text-sm">
                  {paper.abstract
                    ? paper.abstract.length > 150
                      ? paper.abstract.slice(0, 250) + "..."
                      : paper.abstract
                    : "No Description Available"}
                </p>
                <p className="text-gray-400 text-sm">
                  <strong>Published:</strong> {paper.publishedDate ? new Date(paper.publishedDate).toDateString() : "N/A"}
                </p>
                <a
                  href={paper.downloadUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition duration-300"
                >
                  Read More →
                </a>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No research papers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchPapers;
