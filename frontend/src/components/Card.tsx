import React from "react";
import { Link } from "react-router-dom";

// Define the props using an interface
interface CardProps {
  title: string;
  author: string;
  link?: string; // Optional in case you want to use "#" sometimes
}

// Reusable Card Component
const Card: React.FC<CardProps> = ({ title, author, link = "#" }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{author}</p>
      <Link
        to={link}
        className="text-green-400 hover:text-green-300 transition duration-300"
      >
        Read More →
      </Link>
    </div>
  );
};

export default Card;
