<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(async () => {
    // Clear any existing session
    await fetch('http://localhost:3000/auth/logout', {
      credentials: 'include',
    });
  });
</script>

<a href="http://localhost:3000/auth/discord" class="bg-discord-blurple text-white px-4 py-2 rounded">
  Login with Discord
</a> 