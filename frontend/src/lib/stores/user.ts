import { writable } from 'svelte/store';
import type { User } from '$lib/types/user';
import { goto } from '$app/navigation';
import { auth } from './auth';

export const user = writable<User | null>(null);

export const fetchUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/check', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.status === 401) {
      user.set(null);
      goto('/');
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const userData = await response.json();
    user.set(userData);
    return userData;
  } catch (error) {
    console.error('Error fetching user:', error);
    user.set(null);
    return null;
  }
};

export const updateProfile = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  promoSnowflake: number;
}) => {
  try {
    const response = await fetch('http://localhost:3000/api/users/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      user.set(null);
      goto('/');
      throw new Error('Session expirée');
    }

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await response.json();
    user.set(updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users/me', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (response.status === 401) {
      user.set(null);
      goto('/');
      throw new Error('Session expirée');
    }

    if (!response.ok) {
      throw new Error('Failed to delete account');
    }

    user.set(null);
    goto('/');
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  promoSnowflake: string | null;
}

interface ProfileState {
  isUpdating: boolean;
  error: string | null;
  success: string | null;
}

function createProfileStore() {
  const { subscribe, set, update } = writable<ProfileState>({
    isUpdating: false,
    error: null,
    success: null,
  });

  return {
    subscribe,
    
    async updateProfile(data: UpdateProfileData) {
      update(state => ({ ...state, isUpdating: true, error: null, success: null }));
      
      try {
        const response = await fetch('http://localhost:3000/users/me', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du profil');
        }

        update(state => ({ 
          ...state, 
          isUpdating: false,
          success: 'Profil mis à jour avec succès',
        }));
      } catch (err) {
        console.error('Error updating profile:', err);
        update(state => ({ 
          ...state, 
          isUpdating: false,
          error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil',
        }));
      }
    },

    setError(message: string) {
      update(state => ({ ...state, error: message, success: null }));
    },

    clearMessages() {
      update(state => ({ ...state, error: null, success: null }));
    },
  };
}

export const profileStore = createProfileStore(); 