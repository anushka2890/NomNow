-- Insert sample restaurants
INSERT INTO restaurants (id, name, address) VALUES (1, 'Pizza Palace', '123 Pepperoni Lane');
INSERT INTO restaurants (id, name, address) VALUES (2, 'Sushi Central', '456 Wasabi Street');
INSERT INTO restaurants (id, name, address) VALUES (3, 'Curry Kingdom', '789 Masala Avenue');

-- Insert sample menu items
INSERT INTO menu_item (id, name, description, price, restaurant_id) VALUES
(1, 'Margherita Pizza', 'Classic tomato and cheese pizza', 8.99, 1),
(2, 'Pepperoni Pizza', 'Spicy pepperoni with cheese', 10.99, 1),
(3, 'California Roll', 'Crab, avocado, and cucumber', 7.50, 2),
(4, 'Spicy Tuna Roll', 'Tuna with a kick of spice', 8.50, 2),
(5, 'Butter Chicken', 'Creamy tomato-based chicken curry', 9.99, 3),
(6, 'Paneer Tikka Masala', 'Grilled paneer in rich curry', 8.49, 3);
