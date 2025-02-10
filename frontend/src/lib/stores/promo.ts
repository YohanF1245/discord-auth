import { writable } from 'svelte/store';

export type Promo = {
  snowflake: string;
  nom: string;
};

type PromoState = {
  promos: Promo[];
  isLoading: boolean;
  error: string | null;
};

function createPromoStore() {
  const { subscribe, set, update } = writable<PromoState>({
    promos: [],
    isLoading: false,
    error: null,
  });

  return {
    subscribe,
    fetchPromos: async () => {
      update(state => ({ ...state, isLoading: true }));
      try {
        const response = await fetch('http://localhost:3000/promos', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const promos = await response.json();
          update(state => ({ ...state, promos, isLoading: false, error: null }));
        } else {
          update(state => ({ 
            ...state, 
            error: 'Erreur lors du chargement des promotions',
            isLoading: false 
          }));
        }
      } catch (error) {
        console.error('Error fetching promos:', error);
        update(state => ({ 
          ...state, 
          error: 'Erreur lors du chargement des promotions',
          isLoading: false 
        }));
      }
    },
  };
}

export const promoStore = createPromoStore(); 