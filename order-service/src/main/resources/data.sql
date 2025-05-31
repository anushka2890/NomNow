-- Insert a sample order
INSERT INTO orders (user_id, order_status, order_date, total_amount, delivery_address)
VALUES (102, 'CONFIRMED', CURRENT_TIMESTAMP, 750.00, '221B Charming Avenue, New York');

-- ⚠️ Refer to the latest inserted order ID dynamically
-- For PostgreSQL, we use `currval('orders_id_seq')` to get the latest generated ID from the sequence

-- Insert order items for the above order
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
    (currval('orders_id_seq'), 501, 2, 250.00),
    (currval('orders_id_seq'), 502, 1, 150.00),
    (currval('orders_id_seq'), 503, 2, 50.00);

-- Optional: check current orders
-- SELECT * FROM orders;

-- Optional: debug locking issues
-- SELECT * FROM pg_locks WHERE NOT granted;
-- SELECT pid, age(clock_timestamp(), query_start), query
-- FROM pg_stat_activity
-- WHERE state != 'idle'
-- ORDER BY query_start;
