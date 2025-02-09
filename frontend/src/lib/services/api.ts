import { browser } from '$app/environment';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  if (!browser) return null;

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getCurrentUser() {
  return fetchWithAuth('/api/users/me');
}

export async function updateProfile(data: {
  nom: string;
  prenom: string;
  email: string;
  promo_snowflake: string;
}) {
  return fetchWithAuth('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getAllUsers() {
  return fetchWithAuth('/api/users');
}

export async function validateUser(snowflake: string) {
  return fetchWithAuth(`/api/users/${snowflake}/validate`, {
    method: 'PUT',
  });
}

export async function invalidateUser(snowflake: string) {
  return fetchWithAuth(`/api/users/${snowflake}/invalidate`, {
    method: 'PUT',
  });
}

export async function getPromos() {
  return fetchWithAuth('/api/promos');
}

export async function getPromo(snowflake: string) {
  return fetchWithAuth(`/api/promos/${snowflake}`);
}

export async function createPromo(data: {
  snowflake: string;
  nom: string;
  roles_snowflakes: string[];
  channels_snowflakes: string[];
}) {
  return fetchWithAuth('/api/promos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePromo(
  snowflake: string,
  data: {
    nom: string;
    roles_snowflakes: string[];
    channels_snowflakes: string[];
  },
) {
  return fetchWithAuth(`/api/promos/${snowflake}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePromo(snowflake: string) {
  return fetchWithAuth(`/api/promos/${snowflake}`, {
    method: 'DELETE',
  });
}

export async function getChannels() {
  return fetchWithAuth('/api/channels');
}

export async function getChannel(snowflake: string) {
  return fetchWithAuth(`/api/channels/${snowflake}`);
}

export async function createChannel(data: {
  snowflake: string;
  nom: string;
  is_public: boolean;
  promos_snowflakes: string[];
}) {
  return fetchWithAuth('/api/channels', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateChannel(
  snowflake: string,
  data: {
    nom: string;
    is_public: boolean;
    promos_snowflakes: string[];
  },
) {
  return fetchWithAuth(`/api/channels/${snowflake}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteChannel(snowflake: string) {
  return fetchWithAuth(`/api/channels/${snowflake}`, {
    method: 'DELETE',
  });
} 