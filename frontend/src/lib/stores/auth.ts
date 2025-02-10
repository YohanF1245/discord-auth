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
  }>({
    isAuthenticated: false,
    user: null,
  });

  return {
    subscribe,
    setUser: (user: User) => {
      update(state => ({ ...state, user, isAuthenticated: true }));
    },
    logout: async () => {
      try {
        await fetch('http://localhost:3000/auth/logout', {
          credentials: 'include',
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
      set({ isAuthenticated: false, user: null });
    },
  };
}

export const auth = createAuthStore();

export async function checkAuth() {
  try {
    const response = await fetch('http://localhost:3000/auth/check', {
      credentials: 'include',
    });
    
    if (response.ok) {
      const user = await response.json();
      auth.set({ isAuthenticated: true, user });
      return true;
    }
  } catch (error) {
    console.error('Error checking auth:', error);
  }
  
  auth.set({ isAuthenticated: false, user: null });
  return false;
} 