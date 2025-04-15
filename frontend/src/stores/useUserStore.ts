import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Types for user and form inputs
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  affiliation?: string;
  expertise?: string;
  researchInterests?: string;
  // Add more if your backend returns more
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
  signup: (data: SignupInput) => Promise<void>;
  login: (data: LoginInput) => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({
    name,
    email,
    password,
    confirmPassword,
    affiliation,
    role,
    expertise,
    researchInterests,
  }: SignupInput): Promise<void> => {
    set({ loading: true });

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
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
      toast.success("Signed up successfully");
    } catch (error: any) {
      set({ loading: false });
      console.error("Error signing up:", error.response?.data);
      toast.error(error.response?.data?.message || "An error occurred during signup");
    }
  },

  login: async ({ email, password }: LoginInput): Promise<boolean> => {
    set({ loading: true });
    try {
      const res = await axios.post<User>("/users/login", { email, password });
      set({ user: res.data, loading: false });
      toast.success("Logged in successfully");
      return true;
    } catch (error: any) {
      set({ loading: false });

      if (error.response) {
        console.error("Error logging in:", error.response?.data);
        toast.error(error.response?.data?.message || "Invalid email or password");
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response received from server");
      } else {
        console.error("Error in request setup:", error.message);
        toast.error("Error in request setup: " + error.message);
      }

      return false;
    }
  },
}));
