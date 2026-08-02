import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompareResultSet, MetaSearchQuery, SearchVertical, SortMode } from './types';
import { runMetaSearch, sortOffers } from './services/searchService';
import { generateAiPlan, type AiPlanResult } from './services/aiPlanner';

type RecentSearch = MetaSearchQuery & { at: string };

type MetaSearchState = {
  query: MetaSearchQuery;
  results: CompareResultSet | null;
  sort: SortMode;
  loading: boolean;
  error: string | null;
  recent: RecentSearch[];
  aiPlan: AiPlanResult | null;
  setVertical: (vertical: SearchVertical) => void;
  patchQuery: (patch: Partial<MetaSearchQuery>) => void;
  setSort: (sort: SortMode) => void;
  search: () => Promise<void>;
  planWithAi: (days: number) => void;
  clearResults: () => void;
};

const defaultQuery: MetaSearchQuery = {
  vertical: 'flights',
  origin: 'London',
  destination: 'Dubai',
  departDate: '',
  returnDate: '',
  adults: 1,
  children: 0,
  cabin: 'economy',
  nationality: 'United Kingdom',
  travelStyle: 'family',
  rooms: 1,
};

export const useMetaSearchStore = create<MetaSearchState>()(
  persist(
    (set, get) => ({
      query: defaultQuery,
      results: null,
      sort: 'best',
      loading: false,
      error: null,
      recent: [],
      aiPlan: null,

      setVertical: (vertical) => set((s) => ({ query: { ...s.query, vertical } })),

      patchQuery: (patch) => set((s) => ({ query: { ...s.query, ...patch } })),

      setSort: (sort) => {
        const { results } = get();
        if (!results) {
          set({ sort });
          return;
        }
        set({
          sort,
          results: { ...results, offers: sortOffers(results.offers, sort) },
        });
      },

      search: async () => {
        const { query, recent } = get();
        if (!query.destination.trim()) {
          set({ error: 'Please enter a destination.' });
          return;
        }
        set({ loading: true, error: null });
        try {
          const results = await runMetaSearch(query);
          const entry: RecentSearch = { ...query, at: new Date().toISOString() };
          set({
            results,
            loading: false,
            recent: [entry, ...recent.filter((r) => r.destination !== query.destination)].slice(0, 8),
          });
          window.dispatchEvent(
            new CustomEvent('navigateToPage', { detail: { page: 'compare' } })
          );
        } catch (err) {
          set({
            loading: false,
            error: err instanceof Error ? err.message : 'Search failed. Please try again.',
          });
        }
      },

      planWithAi: (days) => {
        const { query } = get();
        const aiPlan = generateAiPlan({
          destination: query.destination,
          days,
          style: query.travelStyle,
          nationality: query.nationality,
          budgetMax: query.budgetMax,
        });
        set({ aiPlan });
      },

      clearResults: () => set({ results: null, error: null }),
    }),
    {
      name: 'synergy-metasearch-v1',
      partialize: (s) => ({ recent: s.recent, query: s.query }),
    }
  )
);
