export interface TableData<T> {
  data: T[];   // Array of data items, generic for flexibility
  meta: Meta;  // Meta information for pagination
  links: Links; // Links for pagination and navigation
}

interface Meta {
  itemsPerPage: number;           // Number of items per page
  totalItems: number;             // Total number of items
  currentPage: number;            // Current page number
  totalPages: number;             // Total number of pages
  sortBy: [string, string][];     // Array of tuples for sorting field and order
}

// Interface for links related to the current page
interface Links {
  current: string;   // Current page URL with pagination and sorting parameters
}

export interface FilterBase {
  page: number;
  limit: number;
}

export const PAGE_SIZE = 10;
export const TABLE_DATA_INITIAL: TableData<any> = {
  data: [],
  meta: {
    itemsPerPage: 10,
    totalItems: 1,
    currentPage: 1,
    totalPages: 1,
    sortBy: [
      [
        "id",
        "DESC"
      ]
    ]
  },
  links: {
    current: ""
  }
};
