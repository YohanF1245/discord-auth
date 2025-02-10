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
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: Array.isArray(data) ? data : data.data || data };
}

export async function getCurrentUser() {
  const response = await fetchWithAuth('/users/me');
  if (response && response.data) {
    console.log('Current user data:', response.data);
    return response;
  }
  return null;
}

export async function updateProfile(data: {
  firstName: string;
  lastName: string;
  email: string;
  promoSnowflake: string | null;
}) {
  const payload = {
    ...data,
    promoSnowflake: data.promoSnowflake ? Number(data.promoSnowflake) : undefined,
  };

  return fetchWithAuth('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getAllUsers() {
  return fetchWithAuth('/users');
}

export async function validateUser(snowflake: string) {
  return fetchWithAuth(`/users/${snowflake}/validate`, {
    method: 'PUT',
  });
}

export async function invalidateUser(snowflake: string) {
  return fetchWithAuth(`/users/${snowflake}/invalidate`, {
    method: 'PUT',
  });
}

export async function getPromos() {
  return fetchWithAuth('/promos');
}

export async function getPromo(snowflake: string) {
  return fetchWithAuth(`/promos/${snowflake}`);
}

export async function createPromo(data: {
  snowflake: string;
  nom: string;
  roles_snowflakes: string[];
  channels_snowflakes: string[];
}) {
  return fetchWithAuth('/promos', {
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
  return fetchWithAuth(`/promos/${snowflake}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePromo(snowflake: string) {
  return fetchWithAuth(`/promos/${snowflake}`, {
    method: 'DELETE',
  });
}

export async function getChannels() {
  return fetchWithAuth('/channels');
}

export async function getChannel(snowflake: string) {
  return fetchWithAuth(`/channels/${snowflake}`);
}

export async function createChannel(data: {
  snowflake: string;
  nom: string;
  is_public: boolean;
  promos_snowflakes: string[];
}) {
  return fetchWithAuth('/channels', {
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
  return fetchWithAuth(`/channels/${snowflake}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteChannel(snowflake: string) {
  return fetchWithAuth(`/channels/${snowflake}`, {
    method: 'DELETE',
  });
} 