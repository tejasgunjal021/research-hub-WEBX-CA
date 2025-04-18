import { create } from "zustand";
import axios from "../lib/axios";

// Types
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  affiliation?: string;
  expertise?: string;
  researchInterests?: string;
}

interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  affiliation?: string;
  role: string;
  expertise?: string;
  researchInterests?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  otpVerified: boolean;
  resendEnabled: boolean;
  countdown: number;

  signup: (data: SignupInput) => Promise<void>;
  login: (data: LoginInput) => Promise<boolean>;

  sendOtp: (data: { email: string }) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  setOtpVerified: (status: boolean) => void;
  setCountdown: (value: number) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  otpVerified: false,
  resendEnabled: true,
  countdown: 30,

  signup: async ({
    name,
    email,
    password,
    confirmPassword,
    affiliation,
    role,
    expertise,
    researchInterests,
  }: SignupInput) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      throw new Error("Passwords do not match");
    }

    try {
      const res = await axios.post<User>("/users/signup", {
        fullName: name,
        username: email.split("@")[0],
        email,
        password,
        affiliation,
        role,
        expertise,
        researchInterests,
      });

      set({ user: res.data, loading: false });
    } catch (error: any) {
      set({ loading: false });
      console.error("Error signing up:", error.response?.data);
      throw new Error(error.response?.data?.message || "An error occurred during signup");
    }
  },

  login: async ({ email, password }: LoginInput): Promise<boolean> => {
    set({ loading: true });
    try {
      const res = await axios.post<User>("/users/login", { email, password });
      set({ user: res.data, loading: false });
      return true;
    } catch (error: any) {
      set({ loading: false });

      if (error.response) {
        console.error("Error logging in:", error.response?.data);
        throw new Error(error.response?.data?.message || "Invalid email or password");
      } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error("No response received from server");
      } else {
        console.error("Error in request setup:", error.message);
        throw new Error("Error in request setup: " + error.message);
      }
    }
  },

  sendOtp: async ({ email }) => {
    try {
      await axios.post("/users/send-otp", { email });
      set({ resendEnabled: false, countdown: 30 });

      // Start countdown
      const interval = setInterval(() => {
        set((state) => {
          if (state.countdown <= 1) {
            clearInterval(interval);
            return { countdown: 0, resendEnabled: true };
          }
          return { countdown: state.countdown - 1 };
        });
      }, 1000);
    } catch (error: any) {
      console.error("Error sending OTP:", error.response?.data);
      throw new Error(error.response?.data?.message || "Email already in use");
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      await axios.post("/users/verify-otp", { email, otp });
      set({ otpVerified: true });
    } catch (error: any) {
      console.error("Error verifying OTP:", error.response?.data);
      throw new Error(error.response?.data?.message || "Invalid OTP");
    }
  },

  setOtpVerified: (status: boolean) => set({ otpVerified: status }),

  setCountdown: (value: number) => set({ countdown: value }),
}));
