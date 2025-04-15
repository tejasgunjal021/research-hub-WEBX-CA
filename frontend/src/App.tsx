import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Footer from "./components/Footer";
import ResearchPapers from "./pages/ResearchPapers";
import DiscussionPage from "./pages/Discussions";
import DatasetsPage from "./pages/Datasets";
import DatasetDetailsPage from "./components/DatasetDetails";
import SignupPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import { Toaster } from "react-hot-toast";

import "./index.css";

// ✅ Type for each dataset item
type Dataset = {
  id: number;
  title: string;
  source: string;
  category: string;
  description: string;
  downloadLink: string;
};

function App() {
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: 1,
      title: "House Price Prediction Dataset",
      source: "Kaggle",
      category: "Real Estate",
      description: "A dataset containing housing market data for price prediction.",
      downloadLink: "https://www.kaggle.com/datasets",
    },
    {
      id: 2,
      title: "Twitter Sentiment Analysis",
      source: "Kaggle",
      category: "Social Media",
      description: "A dataset of tweets labeled as positive, neutral, or negative.",
      downloadLink: "https://www.kaggle.com/datasets",
    },
    {
      id: 3,
      title: "COVID-19 Global Cases",
      source: "Johns Hopkins University",
      category: "Health",
      description: "Worldwide COVID-19 cases and vaccination statistics.",
      downloadLink: "https://github.com/CSSEGISandData/COVID-19",
    },
    {
      id: 4,
      title: "Stock Market Data",
      source: "Yahoo Finance",
      category: "Finance",
      description: "Historical stock prices and market trends.",
      downloadLink: "https://finance.yahoo.com",
    },
  ]);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Router>
        <Navbar />
        <div className="mt-20"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/research-papers" element={<ResearchPapers />} />
          <Route path="/discussions" element={<DiscussionPage />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route
            path="/datasets/:id"
            element={<DatasetDetailsPage />}
          />
        </Routes>
        <Footer />
        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </div>
  );
}

export default App;
