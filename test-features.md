# Maroc-Cart New Features Test Plan

## User Tier System
1. Register a new user and verify:
   - User is assigned Bronze tier by default
   - User receives referral code
   - User starts with 0 points

2. Simulate user progression:
   - Place multiple orders to increase totalSpent and totalOrders
   - Verify tier upgrades correctly (Bronze → Silver → Gold → Platinum)
   - Verify points are awarded for purchases

## Wishlist Feature
1. Test adding products to wishlist:
   - Log in as a user
   - Navigate to product page
   - Click wishlist button (bookmark icon)
   - Verify product appears in wishlist

2. Test removing products from wishlist:
   - From product page, click wishlist button again
   - Verify product is removed from wishlist
   - From wishlist page, use remove button
   - Verify product is removed

3. Test wishlist persistence:
   - Add several products to wishlist
   - Refresh page
   - Verify wishlist items persist

## Referral System
1. Test referral during registration:
   - Register new user with referral code
   - Verify referring user receives bonus points
   - Verify new user receives welcome bonus

2. Test referral info page:
   - Navigate to profile page
   - Click "View Referral Info"
   - Verify referred users are displayed

## Profile Page
1. Verify all new sections display correctly:
   - User tier card with benefits
   - Progress to next tier
   - Referral program with code
   - Wishlist preview

2. Verify all actions work:
   - Copy referral link
   - View referral info
   - Navigate to full wishlist
   - View product details from wishlist preview
