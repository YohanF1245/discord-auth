import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

type Role = {
  snowflake: string;
  nom: string;
  type: 'admin' | 'formateur' | 'charge_projet' | 'etudiant';
};

type User = {
  snowflake: string;
  discordUsername: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status: boolean;
  roles?: Role[];
  promo?: {
    snowflake: string;
    nom: string;
  };
};

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  return {
    subscribe,
    setUser: (user: User) => {
      update(state => ({ ...state, user, isAuthenticated: true, isLoading: false, error: null }));
    },
    setError: (error: string) => {
      update(state => ({ ...state, error, isLoading: false }));
    },
    setLoading: (isLoading: boolean) => {
      update(state => ({ ...state, isLoading }));
    },
    logout: async () => {
      try {
        await fetch('http://localhost:3000/auth/logout', {
          credentials: 'include',
        });
        set({ isAuthenticated: false, isLoading: false, user: null, error: null });
        goto('/');
      } catch (error) {
        console.error('Error during logout:', error);
        update(state => ({ ...state, error: 'Erreur lors de la déconnexion' }));
      }
    },
  };
}

export const auth = createAuthStore();

export async function checkAuth() {
  if (!browser) return false;
  
  auth.setLoading(true);
  
  try {
    const response = await fetch('http://localhost:3000/auth/check', {
      credentials: 'include',
    });
    
    if (response.ok) {
      const user = await response.json();
      auth.setUser(user);
      return true;
    } else {
      auth.set({ isAuthenticated: false, isLoading: false, user: null, error: null });
      return false;
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    auth.setError('Erreur lors de la vérification de l\'authentification');
    return false;
  }
} 