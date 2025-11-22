import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Lightweight pagination hook for infinite scroll
 * @param {Array} allItems - All items to paginate
 * @param {number} itemsPerPage - Number of items to load per page
 * @param {number} initialItemsCount - Number of items to show initially
 * @returns {Object} - Pagination state and handlers
 */
export const usePagination = (allItems = [], itemsPerPage = 10, initialItemsCount = 10) => {
  // Ensure allItems is always an array
  const safeItems = Array.isArray(allItems) ? allItems : [];
  
  const [displayedItems, setDisplayedItems] = useState(() => 
    safeItems.slice(0, initialItemsCount)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasMoreRef = useRef(true);
  const prevItemsLengthRef = useRef(safeItems.length);

  // Recalculate when allItems changes
  const totalPages = Math.ceil(safeItems.length / itemsPerPage);
  const hasMore = currentPage < totalPages;
  hasMoreRef.current = hasMore;

  // Update displayed items when items change (e.g., search results)
  useEffect(() => {
    if (prevItemsLengthRef.current !== safeItems.length) {
      const initialItems = safeItems.slice(0, initialItemsCount);
      setDisplayedItems(initialItems);
      setCurrentPage(1);
      prevItemsLengthRef.current = safeItems.length;
    }
  }, [safeItems.length, initialItemsCount]);

  // Load more items
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    
    // Simulate network delay for better UX
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const endIndex = Math.min(nextPage * itemsPerPage, safeItems.length);
      const newItems = safeItems.slice(0, endIndex);
      
      setDisplayedItems(newItems);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 300);
  }, [safeItems, currentPage, itemsPerPage, isLoadingMore, hasMore]);

  // Reset pagination when allItems changes
  const reset = useCallback(() => {
    const initialItems = safeItems.slice(0, initialItemsCount);
    setDisplayedItems(initialItems);
    setCurrentPage(1);
    setIsLoadingMore(false);
    prevItemsLengthRef.current = safeItems.length;
  }, [safeItems, initialItemsCount]);

  return {
    displayedItems,
    currentPage,
    totalPages,
    hasMore,
    isLoadingMore,
    loadMore,
    reset,
    totalItems: safeItems.length,
    displayedCount: displayedItems.length,
  };
};

