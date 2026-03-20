/**
 * API SERVICE LAYER
 * Centralized place for all data operations.
 * Currently uses localStorage but designed for easy backend swap.
 */

import { User, Invitation, StoreConfig, Product } from '@/types';

const USERS_KEY = 'superozono_users';
const INVITES_KEY = 'superozono_invites';
const CONFIG_KEY = 'superozono_store_config';

// --- UTILS ---
const getItem = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

const setItem = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// --- AUTH & USERS ---
export const api = {
  users: {
    getAll: (): User[] => getItem<User>(USERS_KEY),
    getById: (id: string) => getItem<User>(USERS_KEY).find(u => u.id === id),
    getByEmail: (email: string) => getItem<User>(USERS_KEY).find(u => u.email === email),
    create: (user: User) => {
      const users = getItem<User>(USERS_KEY);
      users.push(user);
      setItem(USERS_KEY, users);
      return user;
    },
    getCurrentUser: (): User | null => {
      const saved = localStorage.getItem('superozono_current_user');
      return saved ? JSON.parse(saved) : null;
    },
    logout: () => {
      localStorage.removeItem('superozono_current_user');
    }
  },

  invites: {
    getAll: (): Invitation[] => getItem<Invitation>(INVITES_KEY),
    create: (invite: Invitation) => {
      const invites = getItem<Invitation>(INVITES_KEY);
      invites.push(invite);
      setItem(INVITES_KEY, invites);
      return invite;
    },
    getById: (id: string) => getItem<Invitation>(INVITES_KEY).find(i => i.id === id),
    remove: (id: string) => {
      const invites = getItem<Invitation>(INVITES_KEY).filter(i => i.id !== id);
      setItem(INVITES_KEY, invites);
    }
  },

  store: {
    getConfig: (): StoreConfig | null => {
      if (typeof window === 'undefined') return null;
      const saved = localStorage.getItem(CONFIG_KEY);
      return saved ? JSON.parse(saved) : null;
    },
    saveConfig: (config: StoreConfig) => {
      setItem(CONFIG_KEY, config);
    }
  }
};
