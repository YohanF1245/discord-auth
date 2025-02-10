<!-- frontend/src/routes/profile/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { promoStore } from '$lib/stores/promo';
  import { profileStore } from '$lib/stores/user';

  let formData = {
    firstName: $auth.user?.firstName || '',
    lastName: $auth.user?.lastName || '',
    email: $auth.user?.email || '',
    promoSnowflake: $auth.user?.promo?.snowflake || null,
  };

  let messageTimer: ReturnType<typeof setTimeout> | null = null;

  onMount(async () => {
    await promoStore.fetchPromos();
  });

  async function handleSubmit() {
    await profileStore.updateProfile(formData);
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

<div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    {#if $auth.user}
      <div class="p-8">
        <!-- Informations Discord -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Profil Discord</h2>
          <p class="text-gray-600">Nom d'utilisateur: {$auth.user.discordUsername}</p>
          <p class="text-gray-600">Status: {$auth.user.status ? 'Validé' : 'En attente de validation'}</p>
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
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              <div class="mt-1 text-sm text-red-500">{$promoStore.error}</div>
            {:else if $promoStore.promos.length === 0}
              <div class="mt-1 text-sm text-gray-500">Aucune promotion disponible pour le moment</div>
            {:else}
              <select
                id="promo"
                bind:value={formData.promoSnowflake}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <div class="text-sm text-red-600">{$profileStore.error}</div>
          {/if}
          {#if $profileStore.success}
            <div class="text-sm text-green-600">{$profileStore.success}</div>
          {/if}

          <!-- Bouton de soumission -->
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
      </div>
    {:else}
      <div class="p-8 text-center">
        <p class="text-red-600">Vous devez être connecté pour accéder à cette page</p>
        <a
          href="/"
          class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Retour à l'accueil
        </a>
      </div>
    {/if}
  </div>
</div> 