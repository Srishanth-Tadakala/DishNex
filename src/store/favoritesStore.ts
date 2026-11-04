// ==============================================================================
// EMBER FAVOURITES STORE (Zustand + AsyncStorage Persistence)
// Isolates user favourites and persists selections reliably across sessions
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuItem } from '../types';

interface FavoritesState {
  favoriteDishIds: string[];
  favoriteRestaurantIds: string[];
  activeTab: 'dishes' | 'restaurants';

  // Actions
  toggleFavoriteDish: (item: MenuItem) => void;
  isDishFavorite: (dishId: string) => boolean;
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  isRestaurantFavorite: (restaurantId: string) => boolean;
  setActiveTab: (tab: 'dishes' | 'restaurants') => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Seed with the 4 dishes shown in Reference Screen 11:
      // Hyderabadi Chicken Biryani, Chocolate Lava Cake, Paneer Butter Masala, Mango Shake
      favoriteDishIds: [
        'm-hyd-chicken-biryani',
        'm-choco-lava-cake',
        'm-paneer-butter-masala',
        'm-mango-shake',
      ],
      favoriteRestaurantIds: ['e0000000-0000-0000-0000-000000000001'],
      activeTab: 'dishes',

      toggleFavoriteDish: (item) => {
        set((state) => {
          const exists = state.favoriteDishIds.includes(item.id);
          return {
            favoriteDishIds: exists
              ? state.favoriteDishIds.filter((id) => id !== item.id)
              : [...state.favoriteDishIds, item.id],
          };
        });
      },

      isDishFavorite: (dishId) => {
        return get().favoriteDishIds.includes(dishId);
      },

      toggleFavoriteRestaurant: (restaurantId) => {
        set((state) => {
          const exists = state.favoriteRestaurantIds.includes(restaurantId);
          return {
            favoriteRestaurantIds: exists
              ? state.favoriteRestaurantIds.filter((id) => id !== restaurantId)
              : [...state.favoriteRestaurantIds, restaurantId],
          };
        });
      },

      isRestaurantFavorite: (restaurantId) => {
        return get().favoriteRestaurantIds.includes(restaurantId);
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },
    }),
    {
      name: 'ember-favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteDishIds: state.favoriteDishIds,
        favoriteRestaurantIds: state.favoriteRestaurantIds,
      }),
    }
  )
);
