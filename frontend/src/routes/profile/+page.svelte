<!-- frontend/src/routes/profile/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { promoStore } from '$lib/stores/promo';
  import { profileStore } from '$lib/stores/user';
  import { goto } from '$app/navigation';

  let formData = {
    firstName: $auth.user?.firstName || '',
    lastName: $auth.user?.lastName || '',
    email: $auth.user?.email || '',
    promoSnowflake: $auth.user?.promo?.snowflake || null,
  };

  let messageTimer: ReturnType<typeof setTimeout> | null = null;
  let showDeleteModal = false;
  let isDeleting = false;

  onMount(async () => {
    await promoStore.fetchPromos();
  });

  async function handleSubmit() {
    await profileStore.updateProfile(formData);
  }

  async function handleDeleteAccount() {
    try {
      isDeleting = true;
      const response = await fetch('http://localhost:3000/users/me', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du compte');
      }

      // Déconnexion et redirection vers la page d'accueil
      window.location.href = 'http://localhost:3000/auth/logout';
    } catch (err) {
      console.error('Error deleting account:', err);
      profileStore.setError('Erreur lors de la suppression du compte');
    } finally {
      isDeleting = false;
      showDeleteModal = false;
    }
  }

  // Réinitialiser les messages après 5 secondes
  $: if ($profileStore.success || $profileStore.error) {
    if (messageTimer) clearTimeout(messageTimer);
    messageTimer = setTimeout(() => {
      profileStore.clearMessages();
    }, 5000);
  }

  onMount(() => {
    return () => {
      if (messageTimer) clearTimeout(messageTimer);
    };
  });
</script>

<div class="min-h-screen bg-gradient-to-b from-discord-blurple to-discord-blurple-dark py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
    {#if $auth.user}
      <div class="p-8">
        <!-- Informations Discord -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Mon Profil Discord</h2>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
            <p class="text-gray-700">Nom d'utilisateur: <span class="font-semibold">{$auth.user.discordUsername}</span></p>
            <p class="text-gray-700">
              Status: 
              <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${$auth.user.status ? 'bg-discord-green text-white' : 'bg-yellow-400 text-gray-900'}`}>
                {$auth.user.status ? 'Validé' : 'En attente de validation'}
              </span>
            </p>
          </div>
        </div>

        <!-- Formulaire de mise à jour -->
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              bind:value={formData.firstName}
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-discord-blurple focus:border-discord-blurple"
              required
            />
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              id="lastName"
              bind:value={formData.lastName}
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-discord-blurple focus:border-discord-blurple"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-discord-blurple focus:border-discord-blurple"
              required
            />
          </div>

          <div>
            <label for="promo" class="block text-sm font-medium text-gray-700">
              Promotion
            </label>
            {#if $promoStore.isLoading}
              <div class="mt-1 text-sm text-gray-500">Chargement des promotions...</div>
            {:else if $promoStore.error}
              <div class="mt-1 text-sm text-red-600">{$promoStore.error}</div>
            {:else if $promoStore.promos.length === 0}
              <div class="mt-1 text-sm text-gray-500">Aucune promotion disponible pour le moment</div>
            {:else}
              <select
                id="promo"
                bind:value={formData.promoSnowflake}
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-discord-blurple focus:border-discord-blurple"
              >
                <option value={null}>Sélectionnez une promotion</option>
                {#each $promoStore.promos as promo}
                  <option value={promo.snowflake}>{promo.nom}</option>
                {/each}
              </select>
            {/if}
          </div>

          <!-- Messages d'erreur et de succès -->
          {#if $profileStore.error}
            <div class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{$profileStore.error}</div>
          {/if}
          {#if $profileStore.success}
            <div class="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">{$profileStore.success}</div>
          {/if}

          <!-- Bouton de soumission -->
          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border-2 border-discord-blurple rounded-full text-lg font-semibold text-white bg-discord-blurple hover:bg-discord-blurple-dark transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={$profileStore.isUpdating || $promoStore.isLoading}
          >
            {#if $profileStore.isUpdating}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mise à jour...
            {:else}
              Mettre à jour le profil
            {/if}
          </button>
        </form>

        <!-- Bouton de suppression du compte -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <h3 class="text-lg font-medium text-red-600">Zone dangereuse</h3>
          <p class="mt-1 text-sm text-gray-500">
            Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
          </p>
          <button
            type="button"
            on:click={() => showDeleteModal = true}
            class="mt-4 inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Supprimer mon compte
          </button>
        </div>
      </div>
    {:else}
      <div class="p-8 text-center">
        <p class="text-red-600">Vous devez être connecté pour accéder à cette page</p>
        <a
          href="/"
          class="mt-4 inline-block px-6 py-3 border-2 border-discord-blurple rounded-full text-lg font-semibold text-white bg-discord-blurple hover:bg-discord-blurple-dark transition-all duration-200 transform hover:scale-105"
        >
          Retour à l'accueil
        </a>
      </div>
    {/if}
  </div>
</div>

<!-- Modale de confirmation de suppression -->
{#if showDeleteModal}
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Fond semi-transparent -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <!-- Centre la modale -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Contenu de la modale -->
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Supprimer votre compte
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront définitivement supprimées.
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            on:click={handleDeleteAccount}
            disabled={isDeleting}
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isDeleting}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Suppression...
            {:else}
              Supprimer définitivement
            {/if}
          </button>
          <button
            type="button"
            on:click={() => showDeleteModal = false}
            disabled={isDeleting}
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-discord-blurple sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
{/if} 