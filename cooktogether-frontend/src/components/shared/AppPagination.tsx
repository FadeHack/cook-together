// src/components/shared/AppPagination.tsx

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useMemo } from 'react';

interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// This is a helper function to generate the page numbers to display
// e.g., for 10 pages, on page 5, it might show [1, '...', 4, 5, 6, '...', 10]
const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export function AppPagination({ currentPage, totalPages, onPageChange }: AppPaginationProps) {
  const paginationRange = useMemo(() => generatePagination(currentPage, totalPages), [currentPage, totalPages]);

  // If there's only one page or no pages, don't render the pagination controls
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* Page Number Links */}
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return <PaginationEllipsis key={`ellipsis-${index}`} />;
          }
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNumber as number);
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}