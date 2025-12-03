# South Spice Billing Console

Single-page restaurant billing console for a breakfast counter. It showcases the dishes **idly, dosa, pongal, vada, and kesari** with imagery, lets the cashier build a cart, and provides CRUD flows for both menu items and stored orders.

## Running

Open `index.html` in any modern browser. All data persists inside `localStorage`, so no backend is required.

## Features

- Responsive hero + menu grid with add-to-cart buttons and clear-cart control.
- Checkout flow stores each bill as an order entry (with totals, timestamp, and customer name).
- Admin CRUD panels for menu items (create/update/delete/restore defaults) and orders (edit/delete/clear all).
- LocalStorage-backed persistence with graceful fallbacks.

## Manual Test Checklist

1. Load the page and verify all five starter dishes (idly, dosa, pongal, vada, kesari) render with images and prices.
2. Click “Add to cart” on at least two dishes; ensure the cart list and total update.
3. Use “Clear cart” to ensure all selections disappear.
4. Add dishes again, enter a customer name, and press “Add to bill”; verify the order appears in the Order history panel.
5. Click “Edit” on the new order, change the customer or notes, submit, and confirm the list refreshes.
6. Delete the order and ensure it disappears; then clear all orders to verify bulk deletion.
7. In the Menu manager, edit a dish price, save, and confirm both the grid and table reflect the change.
8. Delete a menu item and ensure it disappears from the grid; restore defaults to bring it back.
9. Reload the page to confirm menu edits and orders persist via localStorage.

