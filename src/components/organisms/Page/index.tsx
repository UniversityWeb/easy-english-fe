import React from 'react';
import {
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Box,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const Pagination = ({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  showItemsPerPage = true,
}) => {
  const maxVisiblePages = 5;

  const pageNumbers = React.useMemo(() => {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const pages = new Array(maxVisiblePages).fill(null);

    for (let i = 0; i < maxVisiblePages; i++) {
      const pageNum = startPage + i;
      if (pageNum <= endPage) {
        pages[i] = pageNum;
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
      <HStack spacing={4} justify={showItemsPerPage ? 'space-between' : 'center'} width="100%">
        {showItemsPerPage && (
          <HStack>
            <Text>Items per page:</Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="outline"
              >
                {itemsPerPage}
              </MenuButton>
              <MenuList>
                {[8, 12, 16, 20].map((item) => (
                  <MenuItem key={item} onClick={() => setItemsPerPage(item)}>
                    {item}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
        )}

        <HStack spacing={2}>
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            aria-label="Previous Page"
            variant="outline"
            colorScheme="blue"
          />

          {pageNumbers.map((page, index) =>
            page ? (
              <Button
                key={`${page}-${index}`}
                onClick={() => handlePageChange(page)}
                colorScheme="blue"
                variant={currentPage === page ? 'solid' : 'outline'}
              >
                {page}
              </Button>
            ) : null,
          )}

          <IconButton
            icon={<ChevronRightIcon />}
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
            aria-label="Next Page"
            variant="outline"
            colorScheme="blue"
          />
        </HStack>
      </HStack>
  );
};

export default Pagination;
