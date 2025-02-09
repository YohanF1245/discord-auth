import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Role = {
  snowflake: string;
  nom: string;
  type: 'admin' | 'formateur' | 'charge_projet' | 'etudiant';
};

type User = {
  snowflake: string;
  discord_username: string;
  nom?: string;
  prenom?: string;
  email?: string;
  status: boolean;
  roles?: Role[];
  promo?: {
    snowflake: string;
    nom: string;
  };
};

function createAuthStore() {
  const { subscribe, set, update } = writable<{
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
  }>({
    isAuthenticated: false,
    user: null,
    token: browser ? localStorage.getItem('token') : null,
  });

  return {
    subscribe,
    setToken: (token: string) => {
      if (browser) {
        localStorage.setItem('token', token);
        update(state => ({ ...state, token, isAuthenticated: true }));
      }
    },
    setUser: (user: User) => {
      update(state => ({ ...state, user }));
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('token');
        set({ isAuthenticated: false, user: null, token: null });
      }
    },
  };
}

export const auth = createAuthStore(); 