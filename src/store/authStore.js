import { create } from "zustand";
import { seedUsers } from "./seed";
import { uid } from "../lib/helpers";
import { authApi } from "@/api";

export const useUsersStore = create((set, get) => ({
    users: seedUsers,
    addUser: (data) => {
        const id = uid("u");
        const newUser = { id, status: "active", joinedAt: new Date().toISOString().slice(0, 10), ...data };
        set((s) => ({ users: [newUser, ...s.users] }));
        return newUser;
    },
    updateUser: (id, patch) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),
    removeUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
    findByEmail: (email) => get().users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
}));

export const useAuthStore = create((set) => ({
    current: null,
    loading: true,

    login: (user) => set({ current: user }),

    logout: () => set({ current: null }),

    initAuth: async () => {
        try {
            const res = await authApi.getProfile();
            set({ current: res.data.data });
        } catch (error) {
            set({ current: null });
        } finally {
            set({ loading: false });
        }
    },

    updateProfile: (patch) => set((s) => ({ current: s.current ? { ...s.current, ...patch } : null })),
}));

// theme
export const useThemeStore = create((set, get) => ({
    dark: false,
    toggle: () => {
        const next = !get().dark;
        set({ dark: next });
        if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next);
        }
    },
}));
