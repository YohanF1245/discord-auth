<!-- frontend/src/routes/admin/channels/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { getChannels, getPromos, createChannel, updateChannel, deleteChannel } from '$lib/services/api';
  import { goto } from '$app/navigation';

  let loading = true;
  let error = '';
  let channels: Array<{
    snowflake: string;
    nom: string;
    is_public: boolean;
    promos: Array<{ snowflake: string; nom: string }>;
  }> = [];
  let promos: Array<{ snowflake: string; nom: string }> = [];

  let formData = {
    snowflake: '',
    nom: '',
    is_public: false,
    promos_snowflakes: [] as string[],
  };

  let editingChannel: string | null = null;

  onMount(async () => {
    try {
      // Vérifie si l'utilisateur est admin
      if (!$auth.user || !$auth.user.roles?.some(role => role.type === 'admin')) {
        goto('/');
        return;
      }

      const [channelsData, promosData] = await Promise.all([getChannels(), getPromos()]);
      channels = channelsData;
      promos = promosData;
    } catch (err) {
      error = "Erreur lors du chargement des données.";
    } finally {
      loading = false;
    }
  });

  async function handleSubmit() {
    try {
      loading = true;
      if (editingChannel) {
        await updateChannel(editingChannel, {
          nom: formData.nom,
          is_public: formData.is_public,
          promos_snowflakes: formData.promos_snowflakes,
        });
      } else {
        await createChannel(formData);
      }
      
      channels = await getChannels();
      resetForm();
    } catch (err) {
      error = "Erreur lors de la sauvegarde du channel.";
    } finally {
      loading = false;
    }
  }

  async function handleDelete(snowflake: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce channel ?')) return;

    try {
      loading = true;
      await deleteChannel(snowflake);
      channels = await getChannels();
    } catch (err) {
      error = "Erreur lors de la suppression du channel.";
    } finally {
      loading = false;
    }
  }

  function handleEdit(channel: typeof channels[0]) {
    editingChannel = channel.snowflake;
    formData = {
      snowflake: channel.snowflake,
      nom: channel.nom,
      is_public: channel.is_public,
      promos_snowflakes: channel.promos.map(p => p.snowflake),
    };
  }

  function resetForm() {
    editingChannel = null;
    formData = {
      snowflake: '',
      nom: '',
      is_public: false,
      promos_snowflakes: [],
    };
  }
</script>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div class="px-4 py-6 sm:px-0">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestion des Channels</h1>
    </div>

    {#if loading}
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {:else}
      <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
          <form on:submit|preventDefault={handleSubmit} class="space-y-6">
            {#if !editingChannel}
              <div>
                <label for="snowflake" class="block text-sm font-medium text-gray-700">Snowflake</label>
                <input
                  type="text"
                  id="snowflake"
                  bind:value={formData.snowflake}
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            {/if}

            <div>
              <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                id="nom"
                bind:value={formData.nom}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                bind:checked={formData.is_public}
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="is_public" class="ml-2 block text-sm text-gray-900">
                Channel public
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Promotions</label>
              <div class="mt-2 space-y-2">
                {#each promos as promo}
                  <label class="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      value={promo.snowflake}
                      checked={formData.promos_snowflakes.includes(promo.snowflake)}
                      on:change={(e) => {
                        if (e.currentTarget.checked) {
                          formData.promos_snowflakes = [...formData.promos_snowflakes, promo.snowflake];
                        } else {
                          formData.promos_snowflakes = formData.promos_snowflakes.filter(
                            (s) => s !== promo.snowflake
                          );
                        }
                      }}
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">{promo.nom}</span>
                  </label>
                {/each}
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              {#if editingChannel}
                <button
                  type="button"
                  on:click={resetForm}
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
              {/if}
              <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingChannel ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          {#each channels as channel}
            <li>
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-indigo-600 truncate">
                      {channel.nom}
                    </p>
                    <p class="mt-1 flex items-center text-sm text-gray-500">
                      {channel.is_public ? 'Public' : 'Privé'}
                    </p>
                    <p class="mt-1 flex items-center text-sm text-gray-500">
                      Promotions: {channel.promos.map(p => p.nom).join(', ') || 'Aucune'}
                    </p>
                  </div>
                  <div class="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      on:click={() => handleEdit(channel)}
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Modifier
                    </button>
                    <button
                      on:click={() => handleDelete(channel.snowflake)}
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Supprimer
                    </button>
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