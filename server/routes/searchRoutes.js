import express from 'express';
import {
  searchProducts,
  getSearchSuggestions,
  getSearchFilters,
} from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/filters', getSearchFilters);

export default router;
