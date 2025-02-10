<!-- frontend/src/routes/auth/callback/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      auth.setToken(token);
      await goto('/profile');
    } else {
      await goto('/login?error=authentication_failed');
    }
  });
</script>

<div class="flex justify-center items-center h-screen">
  <p>Authenticating...</p>
</div> 