import { useState, useMemo } from "react";

export interface FilterState {
  dateFrom: string;
  dateTo: string;
}

interface UseTransactionFilterProps<T> {
  data: T[];
  getDate: (item: T) => string | Date;
  initialFilters?: FilterState;
}

export const useTransactionFilter = <T>({
  data,
  getDate,
  initialFilters,
}: UseTransactionFilterProps<T>) => {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      dateFrom: "",
      dateTo: "",
    },
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  }, [filters]);

  // Check if any filter is active
  const hasActiveFilters = activeFilterCount > 0;

  // Filter the data based on current filters
  const filteredData = useMemo(() => {
    if (!hasActiveFilters) return data;

    return data.filter((item) => {
      const itemDate = new Date(getDate(item));
      itemDate.setHours(0, 0, 0, 0); // Reset time for date-only comparison

      // Date from filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (itemDate < fromDate) return false;
      }

      // Date to filter
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (itemDate > toDate) return false;
      }

      return true;
    });
  }, [data, filters, hasActiveFilters, getDate]);

  // Apply filter
  const applyFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  // Reset filter to show all (clear all dates)
  const resetFilter = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
    });
    setIsFilterOpen(false);
  };

  // Open filter bottom sheet
  const openFilter = () => setIsFilterOpen(true);

  // Close filter bottom sheet
  const closeFilter = () => setIsFilterOpen(false);

  // Get filter summary text
  const getFilterSummary = () => {
    if (!hasActiveFilters) return null;

    const parts: string[] = [];

    if (filters.dateFrom && filters.dateTo) {
      const fromDate = new Date(filters.dateFrom).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const toDate = new Date(filters.dateTo).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      parts.push(`${fromDate} - ${toDate}`);
    } else if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      parts.push(`Dari ${fromDate}`);
    } else if (filters.dateTo) {
      const toDate = new Date(filters.dateTo).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      parts.push(`Sampai ${toDate}`);
    }

    return parts.join(" • ");
  };

  return {
    filters,
    filteredData,
    activeFilterCount,
    hasActiveFilters,
    isFilterOpen,
    applyFilter,
    resetFilter,
    openFilter,
    closeFilter,
    getFilterSummary,
  };
};
