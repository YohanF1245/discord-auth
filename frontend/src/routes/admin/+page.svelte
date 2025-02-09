<!-- frontend/src/routes/admin/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { getAllUsers, validateUser, invalidateUser, getPromos } from '$lib/services/api';
  import { goto } from '$app/navigation';

  let loading = true;
  let error = '';
  let users: Array<{
    snowflake: string;
    discord_username: string;
    nom: string;
    prenom: string;
    email: string;
    status: boolean;
    promo: { nom: string };
  }> = [];
  let promos: Array<{ snowflake: string; nom: string }> = [];

  onMount(async () => {
    try {
      // Vérifie si l'utilisateur est admin
      if (!$auth.user || !$auth.user.roles?.some(role => role.type === 'admin')) {
        goto('/');
        return;
      }

      const [usersData, promosData] = await Promise.all([getAllUsers(), getPromos()]);
      users = usersData;
      promos = promosData;
    } catch (err) {
      error = "Erreur lors du chargement des données.";
    } finally {
      loading = false;
    }
  });

  async function handleValidate(snowflake: string) {
    try {
      loading = true;
      await validateUser(snowflake);
      users = await getAllUsers();
    } catch (err) {
      error = "Erreur lors de la validation de l'utilisateur.";
    } finally {
      loading = false;
    }
  }

  async function handleInvalidate(snowflake: string) {
    try {
      loading = true;
      await invalidateUser(snowflake);
      users = await getAllUsers();
    } catch (err) {
      error = "Erreur lors de l'invalidation de l'utilisateur.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Administration</h1>

    {#if loading}
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {:else}
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          {#each users as user}
            <li>
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-indigo-600 truncate">
                      {user.discord_username}
                    </p>
                    <p class="mt-2 flex items-center text-sm text-gray-500">
                      {user.nom} {user.prenom}
                    </p>
                    <p class="mt-1 flex items-center text-sm text-gray-500">
                      {user.email}
                    </p>
                    <p class="mt-1 flex items-center text-sm text-gray-500">
                      Promotion: {user.promo?.nom || 'Non assignée'}
                    </p>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    {#if user.status}
                      <button
                        on:click={() => handleInvalidate(user.snowflake)}
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Invalider
                      </button>
                    {:else}
                      <button
                        on:click={() => handleValidate(user.snowflake)}
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Valider
                      </button>
                    {/if}
                  </div>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div> 