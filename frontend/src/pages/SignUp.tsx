import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

// Define types for form data
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  affiliation: string;
  role: string;
  expertise: string;
  researchInterests: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    affiliation: "",
    role: "",
    expertise: "",
    researchInterests: "",
  });

  const navigate = useNavigate();
  const { signup, loading } = useUserStore();

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match!");
      return;
    }

    try {
      console.log("Sending signup data:", formData); // Debugging log
      await signup(formData);
      navigate("/");
    } catch (error: any) {
      console.error("Error during signup:", error);
      // Handle error, you can use `toast.error` if you're using a toast notification library
      console.error(error.response?.data?.message || "An error occurred during signup.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="affiliation"
            placeholder="Affiliation (University, Company, etc.)"
            value={formData.affiliation}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="role"
            placeholder="Role / Position"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="expertise"
            placeholder="Field of Expertise"
            value={formData.expertise}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="researchInterests"
            placeholder="Field of Interest"
            value={formData.researchInterests}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
