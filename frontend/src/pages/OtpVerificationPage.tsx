import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const OTPVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const {
    verifyOtp,
    signup,
    sendOtp,
    resendEnabled,
    countdown,
  } = useUserStore();

  const signupData = localStorage.getItem("signupData");
  const formData = signupData ? JSON.parse(signupData) : null;

  useEffect(() => {
    if (!formData) {
      toast.error("Signup data not found. Please sign up again.");
      navigate("/signup");
    }
  }, [formData, navigate]);

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await verifyOtp(formData.email, otp);
      await signup(formData);
      toast.success("Signup successful!");
      localStorage.removeItem("signupData");
      navigate("/");
    } catch (err) {
      toast.error("OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    if (!formData) return;

    try {
      await sendOtp({ email: formData.email });
      toast.success("OTP resent successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-6">
          Verify OTP
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
            required
            className="w-full p-3 rounded bg-gray-700"
          />
          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition"
          >
            Verify & Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={!resendEnabled}
            className={`text-sm font-medium ${
              resendEnabled
                ? "text-green-400 hover:underline"
                : "text-gray-500 cursor-not-allowed"
            }`}
          >
            {resendEnabled ? "Resend OTP" : `Resend available in ${countdown}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
