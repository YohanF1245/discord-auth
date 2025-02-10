import { writable } from 'svelte/store';
import type { User } from '$lib/types/user';
import { goto } from '$app/navigation';

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