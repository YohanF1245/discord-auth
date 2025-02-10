<!-- frontend/src/routes/admin/debug/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { getAllUsers, validateUser, invalidateUser, getPromos, createChannel } from '$lib/services/api';

  let loading = true;
  let error = '';
  let success = '';
  let users: Array<{
    snowflake: string;
    discordUsername: string;
    firstName: string;
    lastName: string;
    email: string;
    status: boolean;
    promo?: { snowflake: string; name: string };
  }> = [];
  let promos: Array<{ snowflake: string; name: string }> = [];

  // Filtres
  let selectedPromo = '';
  let showValidated = true;
  let showPending = true;

  // Formulaire de création de channel
  let channelForm = {
    snowflake: '',
    nom: '',
    is_public: false,
    promos_snowflakes: [] as string[],
  };

  async function checkAccess() {
    try {
      loading = true;
      
      // Attendre que l'authentification soit chargée
      if ($auth.isLoading) {
        return;
      }

      // Vérifier si l'utilisateur est connecté
      if (!$auth.isAuthenticated || !$auth.user) {
        error = "Vous devez être connecté pour accéder à cette page.";
        goto('/');
        return;
      }

      await loadData();
    } catch (err) {
      console.error('Error in checkAccess:', err);
      error = "Une erreur est survenue lors du chargement de la page.";
    } finally {
      loading = false;
    }
  }

  onMount(checkAccess);

  // Surveiller les changements d'authentification
  $: if ($auth.isLoading === false) {
    checkAccess();
  }

  async function loadData() {
    try {
      const [usersResponse, promosResponse] = await Promise.all([getAllUsers(), getPromos()]);
      if (usersResponse && promosResponse) {
        users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        promos = Array.isArray(promosResponse.data) ? promosResponse.data : [];
        console.log('Users loaded:', users);
        console.log('Promos loaded:', promos);
      } else {
        console.error('No response from API');
        error = "Erreur lors du chargement des données";
      }
    } catch (err) {
      console.error('Error loading data:', err);
      error = "Erreur lors du chargement des données";
    }
  }

  async function handleValidate(snowflake: string) {
    try {
      loading = true;
      const response = await validateUser(snowflake);
      await loadData();
      success = "Utilisateur validé avec succès";
    } catch (err) {
      console.error('Error validating user:', err);
      error = "Erreur lors de la validation de l'utilisateur.";
    } finally {
      loading = false;
    }
  }

  async function handleInvalidate(snowflake: string) {
    try {
      loading = true;
      const response = await invalidateUser(snowflake);
      await loadData();
      success = "Utilisateur invalidé avec succès";
    } catch (err) {
      console.error('Error invalidating user:', err);
      error = "Erreur lors de l'invalidation de l'utilisateur.";
    } finally {
      loading = false;
    }
  }

  async function handleCreateChannel() {
    try {
      loading = true;
      const response = await createChannel(channelForm);
      success = "Channel créé avec succès";
      // Reset form
      channelForm = {
        snowflake: '',
        nom: '',
        is_public: false,
        promos_snowflakes: [],
      };
    } catch (err) {
      console.error('Error creating channel:', err);
      error = "Erreur lors de la création du channel.";
    } finally {
      loading = false;
    }
  }

  async function populateDatabase() {
    try {
      loading = true;
      const response = await fetch('http://localhost:3000/admin/populate', {
        method: 'POST',
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors du peuplement de la base de données');
      }
      
      console.log('Database populated:', result);
      await loadData();
      success = "Base de données peuplée avec succès";
    } catch (err: any) {
      console.error('Error populating database:', err);
      error = err.message || "Erreur lors du peuplement de la base de données.";
    } finally {
      loading = false;
    }
  }

  $: filteredUsers = users ? users.filter(user => {
    const matchPromo = !selectedPromo || user.promo?.snowflake === selectedPromo;
    const matchStatus = (showValidated && user.status) || (showPending && !user.status);
    return matchPromo && matchStatus;
  }) : [];

  // Reset les messages après 5 secondes
  $: if (success || error) {
    setTimeout(() => {
      success = '';
      error = '';
    }, 5000);
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-discord-blurple to-discord-blurple-dark py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <div class="bg-white rounded-xl shadow-xl overflow-hidden">
      <div class="p-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Debug Administration</h1>
          <button
            on:click={populateDatabase}
            class="px-6 py-3 border-2 border-discord-blurple rounded-full text-lg font-semibold text-white bg-discord-blurple hover:bg-discord-blurple-dark transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Peupler la base de données
          </button>
        </div>

        {#if loading}
          <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-discord-blurple"></div>
          </div>
        {:else}
          {#if error}
            <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          {/if}
          {#if success}
            <div class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          {/if}

          <!-- Création de channel -->
          <div class="bg-gray-50 rounded-xl overflow-hidden mb-8 border border-gray-200">
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Créer un nouveau channel</h2>
              <form on:submit|preventDefault={handleCreateChannel} class="space-y-6">
                <div>
                  <label for="snowflake" class="block text-sm font-medium text-gray-700">Snowflake</label>
                  <input
                    type="text"
                    id="snowflake"
                    bind:value={channelForm.snowflake}
                    required
                    class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-discord-blurple focus:border-discord-blurple"
                  />
                </div>

                <div>
                  <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    bind:value={channelForm.nom}
                    required
                    class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-discord-blurple focus:border-discord-blurple"
                  />
                </div>

                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="is_public"
                    bind:checked={channelForm.is_public}
                    class="h-5 w-5 text-discord-blurple focus:ring-discord-blurple border-gray-300 rounded"
                  />
                  <label for="is_public" class="ml-2 block text-sm text-gray-700">
                    Channel public
                  </label>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700" for="promos">Promotions</label>
                  <div class="mt-4 grid grid-cols-2 gap-4">
                    {#each promos as promo}
                      <label class="flex items-center p-3 bg-white rounded-lg border border-gray-200" for={`promo-${promo.snowflake}`}>
                        <input
                          type="checkbox"
                          id={`promo-${promo.snowflake}`}
                          value={promo.snowflake}
                          checked={channelForm.promos_snowflakes.includes(promo.snowflake)}
                          on:change={(e) => {
                            if (e.currentTarget.checked) {
                              channelForm.promos_snowflakes = [...channelForm.promos_snowflakes, promo.snowflake];
                            } else {
                              channelForm.promos_snowflakes = channelForm.promos_snowflakes.filter(
                                (s) => s !== promo.snowflake
                              );
                            }
                          }}
                          class="h-5 w-5 text-discord-blurple focus:ring-discord-blurple border-gray-300 rounded"
                        />
                        <span class="ml-2 text-sm text-gray-700">{promo.name}</span>
                      </label>
                    {/each}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    class="w-full flex justify-center py-3 px-4 border-2 border-discord-blurple rounded-full text-lg font-semibold text-white bg-discord-blurple hover:bg-discord-blurple-dark transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Créer le channel
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Filtres -->
          <div class="bg-gray-50 rounded-xl overflow-hidden mb-8 border border-gray-200">
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Filtres</h2>
              <div class="flex flex-wrap gap-6">
                <div class="flex-1 min-w-[200px]">
                  <label for="promo" class="block text-sm font-medium text-gray-700">Promotion</label>
                  <select
                    id="promo"
                    bind:value={selectedPromo}
                    class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-discord-blurple focus:border-discord-blurple"
                  >
                    <option value="">Toutes les promotions</option>
                    {#each promos as promo}
                      <option value={promo.snowflake}>{promo.name}</option>
                    {/each}
                  </select>
                </div>

                <div class="flex items-center gap-6">
                  <label class="flex items-center" for="show-validated">
                    <input
                      type="checkbox"
                      id="show-validated"
                      bind:checked={showValidated}
                      class="h-5 w-5 text-discord-blurple focus:ring-discord-blurple border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Validés</span>
                  </label>

                  <label class="flex items-center" for="show-pending">
                    <input
                      type="checkbox"
                      id="show-pending"
                      bind:checked={showPending}
                      class="h-5 w-5 text-discord-blurple focus:ring-discord-blurple border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">En attente</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Liste des utilisateurs -->
          <div class="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Utilisateurs ({filteredUsers.length})</h2>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discord Username
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom complet
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promotion
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {#each filteredUsers as user}
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.discordUsername}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.firstName} {user.lastName}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.email}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.promo?.name || 'Non assignée'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status
                                ? 'bg-discord-green text-white'
                                : 'bg-yellow-400 text-gray-900'
                            }`}
                          >
                            {user.status ? 'Validé' : 'En attente'}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {#if user.status}
                            <button
                              on:click={() => handleInvalidate(user.snowflake)}
                              class="text-red-600 hover:text-red-900 transition-colors"
                            >
                              Invalider
                            </button>
                          {:else}
                            <button
                              on:click={() => handleValidate(user.snowflake)}
                              class="text-green-600 hover:text-green-900 transition-colors"
                            >
                              Valider
                            </button>
                          {/if}
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div> 