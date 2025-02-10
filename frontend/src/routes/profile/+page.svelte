<!-- frontend/src/routes/profile/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { user, fetchUser, updateProfile, deleteAccount } from '$lib/stores/user';
  import type { Promo } from '$lib/types/user';
  import { goto } from '$app/navigation';

  let loading = true;
  let error: string | null = null;
  let success: string | null = null;
  let promos: Promo[] = [];
  let formData = {
    firstName: '',
    lastName: '',
    email: '',
    promoSnowflake: 0
  };

  onMount(async () => {
    try {
      const userData = await fetchUser();
      if (!userData) {
        goto('/');
        return;
      }
      
      // Pré-remplir le formulaire avec les données existantes
      formData = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        promoSnowflake: userData.promo?.snowflake || 0
      };

      // Charger les promos
      const response = await fetch('http://localhost:3000/api/promos', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch promos');
      }
      promos = await response.json();
    } catch (err) {
      error = 'Erreur lors du chargement du profil';
      goto('/');
    } finally {
      loading = false;
    }
  });

  async function handleSubmit() {
    try {
      error = null;
      success = null;
      await updateProfile(formData);
      success = 'Profil mis à jour avec succès';
    } catch (err) {
      error = 'Erreur lors de la mise à jour du profil';
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    try {
      await deleteAccount();
      goto('/');
    } catch (err) {
      error = 'Erreur lors de la suppression du compte';
    }
  }
</script>

<div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    {#if loading}
      <div class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement du profil...</p>
      </div>
    {:else if $user}
      <div class="p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Profil Discord</h2>
          <p class="text-gray-600">Nom d'utilisateur: {$user.discordUsername}</p>
          <p class="text-gray-600">Status: {$user.status ? 'Validé' : 'En attente de validation'}</p>
        </div>

        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              id="firstName"
              bind:value={formData.firstName}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              id="lastName"
              bind:value={formData.lastName}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="promo" class="block text-sm font-medium text-gray-700">Promotion</label>
            <select
              id="promo"
              bind:value={formData.promoSnowflake}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez une promotion</option>
              {#each promos as promo}
                <option value={promo.snowflake}>{promo.name}</option>
              {/each}
            </select>
          </div>

          {#if error}
            <p class="text-red-600 text-sm">{error}</p>
          {/if}

          {#if success}
            <p class="text-green-600 text-sm">{success}</p>
          {/if}

          <div class="flex justify-between items-center">
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Mettre à jour
            </button>

            <button
              type="button"
              on:click={handleDeleteAccount}
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Supprimer le compte
            </button>
          </div>
        </form>
      </div>
    {:else}
      <div class="p-8 text-center">
        <p class="text-red-600">Vous devez être connecté pour accéder à cette page</p>
        <a
          href="/"
          class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Se connecter
        </a>
      </div>
    {/if}
  </div>
</div> 