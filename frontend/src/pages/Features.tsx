import React from "react";

const Features: React.FC = () => {
  return (
    <div className="bg-black text-white py-16">
      <h2 className="text-center text-4xl font-bold text-neonGreen">Why Choose Research Hub?</h2>
      <div className="grid md:grid-cols-3 gap-6 mt-10 px-6">
        
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl text-center shadow-neon">
          <h3 className="text-xl font-bold text-neonPink">Secure Data</h3>
          <p className="text-gray-300 mt-2">All research papers and discussions are securely stored.</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl text-center shadow-neon">
          <h3 className="text-xl font-bold text-neonGreen">Real-time Collaboration</h3>
          <p className="text-gray-300 mt-2">Work with researchers in real-time using AI-powered tools.</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl text-center shadow-neon">
          <h3 className="text-xl font-bold text-neonPink">AI Recommendations</h3>
          <p className="text-gray-300 mt-2">Get AI-powered suggestions for relevant research papers.</p>
        </div>

      </div>
    </div>
  );
};

export default Features;
