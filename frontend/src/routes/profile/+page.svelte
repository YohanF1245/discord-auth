<!-- frontend/src/routes/profile/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { getCurrentUser, updateProfile, getPromos } from '$lib/services/api';
  import { goto } from '$app/navigation';

  let loading = true;
  let error = '';
  let promos: Array<{ snowflake: string; nom: string }> = [];
  let formData = {
    nom: '',
    prenom: '',
    email: '',
    promo_snowflake: '',
    acceptConditions: false
  };

  onMount(async () => {
    try {
      const [user, promosData] = await Promise.all([
        getCurrentUser(),
        getPromos()
      ]);

      auth.setUser(user);
      promos = promosData;

      if (user.nom) {
        formData = {
          ...formData,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          promo_snowflake: user.promo?.snowflake || ''
        };
      }
    } catch (err) {
      error = "Erreur lors du chargement des données. Veuillez vous reconnecter.";
      auth.logout();
      goto('/');
    } finally {
      loading = false;
    }
  });

  async function handleSubmit() {
    if (!formData.acceptConditions) {
      error = "Vous devez accepter les conditions d'utilisation.";
      return;
    }

    try {
      loading = true;
      const updatedUser = await updateProfile({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        promo_snowflake: formData.promo_snowflake
      });
      auth.setUser(updatedUser);
      error = '';
    } catch (err) {
      error = "Erreur lors de la mise à jour du profil.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
  <h1 class="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>

  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {:else}
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
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

      <div>
        <label for="prenom" class="block text-sm font-medium text-gray-700">Prénom</label>
        <input
          type="text"
          id="prenom"
          bind:value={formData.prenom}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          bind:value={formData.email}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="promo" class="block text-sm font-medium text-gray-700">Promotion</label>
        <select
          id="promo"
          bind:value={formData.promo_snowflake}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Sélectionnez une promotion</option>
          {#each promos as promo}
            <option value={promo.snowflake}>{promo.nom}</option>
          {/each}
        </select>
      </div>

      <div class="flex items-center">
        <input
          type="checkbox"
          id="conditions"
          bind:checked={formData.acceptConditions}
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label for="conditions" class="ml-2 block text-sm text-gray-900">
          J'accepte les conditions d'utilisation
        </label>
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {$auth.user?.status ? 'Mettre à jour mon profil' : 'Soumettre mon recensement'}
        </button>
      </div>
    </form>
  {/if}
</div> 