/**
 * Common interface for filters.
 * Every filter has to implement this interface.
 */
export interface Filter {
    initByUrl(queryParam: any): void;
    getUrlValues(): any;
    notify(): void;
    clear(): void;
}