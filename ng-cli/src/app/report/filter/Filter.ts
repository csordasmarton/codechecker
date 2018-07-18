/**
 * Common interface for filters.
 * Every filter has to implement this interface.
 */
export interface Filter {
  // Initialize filter state by URL values.
  initByUrl(queryParam: any): void;

  // Get URL query parameters.
  getUrlState(): any;

  // Being notified from filter change events.
  notify(): void;

  // Clears out the filter state.
  clear(): void;
}
