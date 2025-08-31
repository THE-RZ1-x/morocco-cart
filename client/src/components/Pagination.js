import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const PaginationButton = styled(Button)(({ theme, active }) => ({
  minWidth: 40,
  height: 40,
  margin: theme.spacing(0, 0.5),
  borderRadius: 8,
  fontWeight: active ? 'bold' : 'normal',
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <PaginationContainer>
      <Stack spacing={2} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem} of {totalItems} products
        </Typography>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <PaginationButton
            onClick={handlePrevious}
            disabled={currentPage === 1}
            variant="outlined"
          >
            Previous
          </PaginationButton>

          {startPage > 1 && (
            <>
              <PaginationButton onClick={() => onPageChange(1)}>
                1
              </PaginationButton>
              {startPage > 2 && <Typography variant="body2">...</Typography>}
            </>
          )}

          {pageNumbers.map((number) => (
            <PaginationButton
              key={number}
              onClick={() => onPageChange(number)}
              active={number === currentPage}
            >
              {number}
            </PaginationButton>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <Typography variant="body2">...</Typography>}
              <PaginationButton onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationButton>
            </>
          )}

          <PaginationButton
            onClick={handleNext}
            disabled={currentPage === totalPages}
            variant="outlined"
          >
            Next
          </PaginationButton>
        </Stack>
      </Stack>
    </PaginationContainer>
  );
};

export default Pagination;
