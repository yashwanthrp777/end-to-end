-- CloudCart Initial Seed Data

-- 1. Default Users
-- Passwords:
-- admin@cloudcart.com -> Admin123! ($2a$10$H8k8ZJk5oGvX7e5iFvN0eebGqvK9yUjY6wzHwL6Hw66qB5sV6d31y)
-- demo@cloudcart.com  -> Customer123! ($2a$10$Z7d8YJk5oGvX7e5iFvN0eebGqvK9yUjY6wzHwL6Hw66qB5sV6d31y)
INSERT INTO users (id, name, email, password_hash, role, phone) VALUES
(1, 'Admin User', 'admin@cloudcart.com', '$2a$10$QO0j8Oq1a.RjO9Y6Uqv1mO5c9j1uM.Y3E11yV9V5ZkHqGgI1a/2z6', 'admin', '+1 (555) 019-2834'),
(2, 'Sarah Jenkins', 'demo@cloudcart.com', '$2a$10$QO0j8Oq1a.RjO9Y6Uqv1mO5c9j1uM.Y3E11yV9V5ZkHqGgI1a/2z6', 'customer', '+1 (555) 018-9123')
ON CONFLICT (id) DO NOTHING;

-- 2. Categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
(1, 'Audio & Sound', 'audio-sound', 'Premium noise-canceling headphones, studio monitors and spatial earbuds.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'),
(2, 'Wearables & Watches', 'wearables-watches', 'Next-gen smartwatches, titanium fitness trackers, and luxury digital timepieces.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'),
(3, 'Laptops & Computing', 'laptops-computing', 'Ultra-thin workstations, high-refresh rate displays, and creative machines.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'),
(4, 'Smart Home & Office', 'smart-home-office', 'Ergonomic desk gear, ambient lighting, and smart automated essentials.', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80'),
(5, 'Photography & Video', 'photography-video', 'Mirrorless 4K cameras, gimbal stabilizers, and cinematic lens kits.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

-- 3. Products
INSERT INTO products (id, category_id, name, slug, description, price, compare_at_price, stock, image_url, rating, rating_count, is_featured) VALUES
(1, 1, 'Aura ANC Wireless Studio Headphones', 'aura-anc-wireless-studio-headphones', 'Engineered with titanium 40mm drivers and state-of-the-art hybrid active noise cancellation. Enjoy 45 hours of immersive Hi-Res audio with plush memory foam ear cushions.', 299.99, 349.99, 35, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 4.9, 128, TRUE),
(2, 2, 'Chronos Titan GPS Smartwatch', 'chronos-titan-gps-smartwatch', 'Aerospace grade titanium chassis with sapphire crystal glass. Features dual-frequency GPS, heart-rate variability tracking, ECG monitoring and 14-day battery life.', 399.00, 449.00, 22, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 4.8, 94, TRUE),
(3, 3, 'Luminary 16X M-Pro Creator Laptop', 'luminary-16x-m-pro-creator-laptop', 'Powered by a 14-core high-efficiency processor, 32GB unified RAM, 1TB NVMe Gen4 SSD, and a breathtaking 3.2K 120Hz Mini-LED calibrated display.', 1899.00, 2099.00, 15, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', 5.0, 67, TRUE),
(4, 1, 'Pulse Pods Pro Spatial Earbuds', 'pulse-pods-pro-spatial-earbuds', 'True wireless spatial audio with dynamic head tracking, adaptive transparency mode, wireless MagSafe charging case, and IPX5 sweat resistance.', 179.99, 199.99, 50, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', 4.7, 210, TRUE),
(5, 4, 'Halo Ambient Minimalist Desk Lamp', 'halo-ambient-minimalist-desk-lamp', 'Touch-stepless dimmable architectural lamp with 98+ CRI natural light spectrum, wireless charging pad in base, and aluminum alloy construction.', 89.00, 119.00, 40, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', 4.6, 52, FALSE),
(6, 4, 'ErgoGlide Mechanical Keyboard (RGB)', 'ergoglide-mechanical-keyboard-rgb', 'Hot-swappable tactile switches, gasket mounted acoustics, custom dye-sub PBT keycaps, and seamless tri-mode connectivity (2.4G, Bluetooth 5.2, USB-C).', 149.00, 169.00, 28, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', 4.9, 184, TRUE),
(7, 5, 'Apex R7 Mirrorless 4K Camera Body', 'apex-r7-mirrorless-4k-camera-body', 'Full-frame 33MP BSI CMOS sensor capable of 4K 60p 10-bit recording, 8-stop in-body stabilization, and AI deep-learning autofocus system.', 1649.00, 1799.00, 8, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 4.9, 43, FALSE),
(8, 2, 'Horizon Sport Fitness Band', 'horizon-sport-fitness-band', 'Ultra-lightweight 24/7 fitness tracker with continuous SpO2, sleep coaching, stress analytics, and 50m water resistance in an unobtrusive band.', 59.99, 79.99, 65, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80', 4.5, 78, FALSE),
(9, 3, 'Vortex 27-inch 4K HDR Designer Monitor', 'vortex-27-inch-4k-hdr-designer-monitor', 'IPS Black panel offering 2000:1 contrast ratio, 98% DCI-P3 color gamut, 90W USB-C power delivery, and an ergonomic height/pivot adjustable stand.', 549.00, 629.00, 19, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', 4.8, 62, TRUE),
(10, 4, 'AeroPure Smart Hepa Air Purifier', 'aeropure-smart-hepa-air-purifier', 'Quiet whisper-quiet air filtration capturing 99.97% of airborne particles. Real-time air quality ring indicator with smartphone app integration.', 129.00, 149.00, 31, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80', 4.6, 39, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Address for Demo User
INSERT INTO addresses (id, user_id, full_name, street, city, state, postal_code, country, phone, is_default) VALUES
(1, 2, 'Sarah Jenkins', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States', '+1 (555) 018-9123', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. Demo Orders
INSERT INTO orders (id, user_id, order_number, status, total_amount, subtotal, tax_amount, shipping_fee, payment_method, payment_status, transaction_ref, shipping_name, shipping_street, shipping_city, shipping_state, shipping_postal_code, shipping_country, shipping_phone) VALUES
(1, 2, 'ORD-2026-9041', 'delivered', 329.98, 299.99, 29.99, 0.00, 'card_test', 'paid', 'TXN_TEST_994821', 'Sarah Jenkins', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States', '+1 (555) 018-9123'),
(2, 2, 'ORD-2026-9042', 'processing', 197.98, 179.99, 17.99, 0.00, 'cod', 'pending', 'COD_REF_338910', 'Sarah Jenkins', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States', '+1 (555) 018-9123')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, image_url) VALUES
(1, 1, 1, 'Aura ANC Wireless Studio Headphones', 299.99, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'),
(2, 2, 4, 'Pulse Pods Pro Spatial Earbuds', 179.99, 1, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;
