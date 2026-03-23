-- Afri Processors Limited - Database Schema
-- Created: 2024-01-20
-- Description: Complete database schema for the Afri Processors web application

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- =============================================
-- USERS AND AUTHENTICATION TABLES
-- =============================================

-- Admin users table
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'editor')),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- =============================================
-- PRODUCTS TABLES
-- =============================================

-- Product categories
CREATE TABLE product_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    slug VARCHAR(50) UNIQUE NOT NULL,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category_id INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    weight DECIMAL(8,2),
    dimensions VARCHAR(50),
    image_url VARCHAR(255),
    images JSON, -- Array of additional image URLs
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    is_featured BOOLEAN DEFAULT FALSE,
    tags JSON, -- Array of tags
    seo_title VARCHAR(100),
    seo_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE RESTRICT
);

-- Product reviews
CREATE TABLE product_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =============================================
-- NEWS AND CONTENT TABLES
-- =============================================

-- News articles
CREATE TABLE news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    author_id INTEGER,
    category VARCHAR(50) DEFAULT 'Company News',
    tags JSON, -- Array of tags
    image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(200),
    seo_description TEXT,
    read_time INTEGER, -- Estimated reading time in minutes
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- News article views/tracking
CREATE TABLE article_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES news_articles(id) ON DELETE CASCADE
);

-- =============================================
-- CONTACT AND MESSAGES TABLES
-- =============================================

-- Contact messages
CREATE TABLE contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    notes TEXT,
    replied_at DATETIME,
    archived_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Message replies
CREATE TABLE message_replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    reply_content TEXT NOT NULL,
    replied_by INTEGER NOT NULL, -- Admin user ID
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES contact_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (replied_by) REFERENCES admin_users(id) ON DELETE RESTRICT
);

-- =============================================
-- ORDERS AND E-COMMERCE TABLES
-- =============================================

-- Customers
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'UGX',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    shipped_date DATETIME,
    delivered_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

-- Order items
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- =============================================
-- SYSTEM SETTINGS TABLES
-- =============================================

-- System settings
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Whether this setting can be accessed by public API
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at DATETIME
);

-- =============================================
-- ACTIVITY LOGS TABLES
-- =============================================

-- Admin activity logs
CREATE TABLE activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
    resource_type VARCHAR(50) NOT NULL, -- 'product', 'news', 'order', etc.
    resource_id INTEGER,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Products indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_sku ON products(sku);

-- News indexes
CREATE INDEX idx_news_status ON news_articles(status);
CREATE INDEX idx_news_published ON news_articles(published_at);
CREATE INDEX idx_news_featured ON news_articles(is_featured);
CREATE INDEX idx_news_author ON news_articles(author_id);

-- Contact messages indexes
CREATE INDEX idx_messages_status ON contact_messages(status);
CREATE INDEX idx_messages_priority ON contact_messages(priority);
CREATE INDEX idx_messages_created ON contact_messages(created_at);

-- Orders indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Activity logs indexes
CREATE INDEX idx_logs_user ON activity_logs(user_id);
CREATE INDEX idx_logs_created ON activity_logs(created_at);
CREATE INDEX idx_logs_action ON activity_logs(action);

-- Sessions indexes
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Update updated_at timestamp for products
CREATE TRIGGER update_products_updated_at 
    AFTER UPDATE ON products
    FOR EACH ROW
    BEGIN
        UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Update updated_at timestamp for news articles
CREATE TRIGGER update_news_updated_at 
    AFTER UPDATE ON news_articles
    FOR EACH ROW
    BEGIN
        UPDATE news_articles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Update updated_at timestamp for contact messages
CREATE TRIGGER update_messages_updated_at 
    AFTER UPDATE ON contact_messages
    FOR EACH ROW
    BEGIN
        UPDATE contact_messages SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Update updated_at timestamp for orders
CREATE TRIGGER update_orders_updated_at 
    AFTER UPDATE ON orders
    FOR EACH ROW
    BEGIN
        UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Update updated_at timestamp for admin users
CREATE TRIGGER update_users_updated_at 
    AFTER UPDATE ON admin_users
    FOR EACH ROW
    BEGIN
        UPDATE admin_users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for active products with category info
CREATE VIEW active_products_view AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.sku,
    p.price,
    p.stock_quantity,
    p.image_url,
    p.status,
    p.is_featured,
    p.created_at,
    c.name as category_name,
    c.slug as category_slug
FROM products p
JOIN product_categories c ON p.category_id = c.id
WHERE p.status = 'active';

-- View for published news articles
CREATE VIEW published_news_view AS
SELECT 
    id,
    title,
    slug,
    excerpt,
    author,
    category,
    image_url,
    is_featured,
    published_at,
    created_at,
    read_time
FROM news_articles
WHERE status = 'published' AND published_at IS NOT NULL
ORDER BY published_at DESC;

-- View for unread contact messages
CREATE VIEW unread_messages_view AS
SELECT 
    id,
    name,
    email,
    subject,
    priority,
    created_at
FROM contact_messages
WHERE status = 'unread'
ORDER BY priority DESC, created_at DESC;

-- View for recent orders
CREATE VIEW recent_orders_view AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.total_amount,
    o.order_date,
    c.first_name,
    c.last_name,
    c.email
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.order_date DESC;

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@afriprocessors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'System Administrator', 'super_admin');

-- Insert product categories
INSERT INTO product_categories (name, description, slug) VALUES 
('Flours', 'Nutritious flours from various African crops', 'flours'),
('Oils', 'Natural oils for cooking and cosmetic use', 'oils'),
('Seeds', 'High-quality seeds for planting and consumption', 'seeds'),
('Powders', 'Fine powders from natural ingredients', 'powders');

-- Insert sample products
INSERT INTO products (name, description, sku, category_id, price, stock_quantity, image_url, status, is_featured, tags) VALUES 
('Moringa Flour', 'Premium quality moringa flour, rich in vitamins and minerals', 'MF001', 1, 15000.00, 150, '/images/moringa-flour.jpg', 'active', TRUE, '["superfood", "organic", "nutritious"]'),
('Baobab Flour', 'Nutrient-dense baobab flour packed with vitamin C and fiber', 'BF001', 1, 18000.00, 85, '/images/baobab-flour.jpg', 'active', TRUE, '["superfood", "vitamin-c", "fiber"]'),
('Castor Oil', 'Pure, cold-pressed castor oil for cosmetic and industrial use', 'CO001', 2, 25000.00, 60, '/images/castor-oil.jpg', 'active', FALSE, '["cosmetic", "industrial", "natural"]'),
('Moringa Seeds', 'High-quality moringa seeds for planting and consumption', 'MS001', 3, 8000.00, 200, '/images/moringa-seeds.jpg', 'active', FALSE, '["seeds", "planting", "edible"]');

-- Insert sample news articles
INSERT INTO news_articles (title, slug, excerpt, content, author, category, image_url, status, is_featured, published_at, read_time) VALUES 
('Afri Processors Launches New Moringa Flour Production Line', 'moringa-flour-production-launch', 'We are excited to announce the launch of our new state-of-the-art moringa flour production line.', 'We are excited to announce the launch of our new state-of-the-art moringa flour production line, doubling our capacity to serve the growing demand for nutritious superfoods across East Africa.', 'Sarah Kimani', 'Company News', '/images/moringa-production.jpg', 'published', TRUE, '2024-01-20T10:00:00', 5),
('New Partnership with Local Farmers Boosts Sustainable Agriculture', 'local-farmers-partnership', 'Afri Processors has established a groundbreaking partnership with over 200 local farmers.', 'Afri Processors has established a groundbreaking partnership with over 200 local farmers to promote sustainable agricultural practices and ensure fair trade principles.', 'John Okello', 'Sustainability', '/images/farmers-partnership.jpg', 'published', TRUE, '2024-01-18T14:00:00', 4);

-- Insert sample system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES 
('site_name', 'Afri Processors Limited', 'string', 'Website name', TRUE),
('site_description', 'Premium African agricultural products and processing solutions', 'string', 'Website description', TRUE),
('contact_email', 'info@afriprocessors.com', 'string', 'Contact email address', TRUE),
('contact_phone', '+256 784 123 456', 'string', 'Contact phone number', TRUE),
('currency', 'UGX', 'string', 'Default currency', TRUE),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', FALSE),
('email_notifications', 'true', 'boolean', 'Enable email notifications', FALSE);

-- =============================================
-- DATABASE COMPLETION
-- =============================================

-- This schema provides a complete foundation for the Afri Processors web application
-- including:
-- - User authentication and session management
-- - Product catalog with categories and reviews
-- - News and content management system
-- - Contact form and message handling
-- - E-commerce functionality (orders, customers)
-- - System settings and configuration
-- - Activity logging and audit trails
-- - Newsletter subscription management

-- The schema is designed to be:
-- - Scalable for business growth
-- - Secure with proper relationships and constraints
-- - Performant with appropriate indexes
-- - Maintainable with clear structure and documentation
