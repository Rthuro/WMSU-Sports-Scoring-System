import { create } from 'zustand'
 
const usePageStore = create((set) => ({
  currentPage: window.location.pathname.includes("") ? "Home" : window.location.pathname.replace("/", ""),
  setCurrentPage: (page) => set({ currentPage: page }),
}))

export default usePageStore

