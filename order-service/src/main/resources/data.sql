-- Insert a sample order (let the database handle ID auto-generation)
INSERT INTO orders (id, user_id, order_status, order_date, total_amount, delivery_address)
VALUES (1, 101, 'CONFIRMED', CURRENT_TIMESTAMP, 750.00, '221B Baker Street, London');

-- Assuming the first order got ID = 1 (PostgreSQL starts with 1 by default)
-- Insert related order items for order_id = 1
INSERT INTO order_items (id, order_id, product_id, quantity, price)
VALUES
    (1, 1, 501, 2, 250.00),
    (2, 1, 502, 1, 150.00),
    (3, 1, 503, 2, 50.00);
