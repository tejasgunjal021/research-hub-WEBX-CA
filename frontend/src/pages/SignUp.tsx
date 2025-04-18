import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

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
  const { sendOtp } = useUserStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    try {
      await sendOtp({ email: formData.email });
      toast.success("OTP sent to email!");
      localStorage.setItem("signupData", JSON.stringify(formData));
      navigate("/signup/verify-otp");
    } catch (err: any) {
      if (err.response?.data?.error === "Email already in use") {
        toast.error("Email is already registered. Please log in instead.");
      } else {
        toast.error("Failed to send OTP");
      }
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full p-3 rounded bg-gray-700" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 rounded bg-gray-700" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 rounded bg-gray-700" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-3 rounded bg-gray-700" />
          <input type="text" name="affiliation" placeholder="Affiliation" value={formData.affiliation} onChange={handleChange} required className="w-full p-3 rounded bg-gray-700" />
          <input type="text" name="role" placeholder="Role / Position" value={formData.role} onChange={handleChange} required className="w-full p-3 rounded bg-gray-700" />
          <input type="text" name="expertise" placeholder="Field of Expertise" value={formData.expertise} onChange={handleChange} required className="w-full p-3 rounded bg-gray-700" />
          <input type="text" name="researchInterests" placeholder="Field of Interest" value={formData.researchInterests} onChange={handleChange} required className="w-full p-3 rounded bg-gray-700" />

          <button type="submit" className="w-full p-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition">
            Send OTP
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
