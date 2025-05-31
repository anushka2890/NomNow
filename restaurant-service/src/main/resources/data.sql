-- Insert sample restaurants
INSERT INTO restaurant (id, name, address, rating) VALUES
(1, 'Pizza Palace', '123 Pepperoni Lane', NULL),
(2, 'Sushi Central', '456 Wasabi Street', NULL),
(3, 'Curry Kingdom', '789 Masala Avenue', NULL);

-- Insert sample menu items with availableQuantity
INSERT INTO menu_item (id, name, description, price, available_quantity, restaurant_id) VALUES
(1, 'Margherita Pizza', 'Classic tomato and cheese pizza', 8.99, 20, 1),
(2, 'Pepperoni Pizza', 'Spicy pepperoni with cheese', 10.99, 15, 1),
(3, 'California Roll', 'Crab, avocado, and cucumber', 7.50, 30, 2),
(4, 'Spicy Tuna Roll', 'Tuna with a kick of spice', 8.50, 25, 2),
(5, 'Butter Chicken', 'Creamy tomato-based chicken curry', 9.99, 10, 3),
(6, 'Paneer Tikka Masala', 'Grilled paneer in rich curry', 8.49, 12, 3);
