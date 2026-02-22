import { create } from 'zustand';

export interface Breadcrumb {
  label: string;
  path?: string;
}

interface LayoutState {
  title: string;
  breadcrumbs: Breadcrumb[];
  
  setTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  setPageContext: (title: string, breadcrumbs?: Breadcrumb[]) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  title: 'Overview',
  breadcrumbs: [],
  
  setTitle: (title) => set({ title }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  setPageContext: (title, breadcrumbs = []) => set({ title, breadcrumbs }),
}));