<!-- frontend/src/routes/auth/callback/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  onMount(() => {
    if (browser) {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        // Stocke le token dans le localStorage
        localStorage.setItem('token', token);
        // Redirige vers le profil
        goto('/profile');
      } else {
        // En cas d'erreur, redirige vers la page d'accueil
        goto('/');
      }
    }
  });
</script>

<div class="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
  <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
  <p class="mt-4 text-lg text-gray-600">Authentification en cours...</p>
</div> 