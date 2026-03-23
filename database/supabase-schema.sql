-- Afri Processors Limited - Supabase Database Schema
-- Created: 2024-01-20
-- Description: Complete Supabase database schema with RLS policies and functions

-- =============================================
-- EXTENSIONS
-- =============================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable moddatetime for automatic timestamp updates
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- =============================================
-- TYPES AND ENUMS
-- =============================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('admin', 'super_admin', 'editor');

-- Product status enum
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'discontinued');

-- Message status enum
CREATE TYPE message_status AS ENUM ('unread', 'read', 'replied', 'archived');

-- Priority enum
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- News status enum
CREATE TYPE news_status AS ENUM ('draft', 'published', 'archived');

-- Setting type enum
CREATE TYPE setting_type AS ENUM ('string', 'number', 'boolean', 'json');

-- =============================================
-- TABLES
-- =============================================

-- Admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'admin',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    slug VARCHAR(50) UNIQUE NOT NULL,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    weight DECIMAL(8,2),
    dimensions VARCHAR(50),
    image_url VARCHAR(255),
    images JSONB DEFAULT '[]',
    status product_status DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    tags JSONB DEFAULT '[]',
    seo_title VARCHAR(100),
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product reviews
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News articles
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    author_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    category VARCHAR(50) DEFAULT 'Company News',
    tags JSONB DEFAULT '[]',
    image_url VARCHAR(255),
    status news_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(200),
    seo_description TEXT,
    read_time INTEGER,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article views
CREATE TABLE article_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status message_status DEFAULT 'unread',
    priority priority_level DEFAULT 'medium',
    notes TEXT,
    replied_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message replies
CREATE TABLE message_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
    reply_content TEXT NOT NULL,
    replied_by UUID NOT NULL REFERENCES admin_users(id) ON DELETE RESTRICT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    status order_status DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'UGX',
    payment_method VARCHAR(50),
    payment_status payment_status DEFAULT 'pending',
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    shipped_date TIMESTAMPTZ,
    delivered_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type setting_type DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

-- Activity logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Products indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));

-- News indexes
CREATE INDEX idx_news_status ON news_articles(status);
CREATE INDEX idx_news_published ON news_articles(published_at);
CREATE INDEX idx_news_featured ON news_articles(is_featured);
CREATE INDEX idx_news_author ON news_articles(author_id);
CREATE INDEX idx_news_search ON news_articles USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || content));

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
-- TRIGGERS AND FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(MICROSECONDS FROM NOW())::text, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_logs (user_id, action, resource_type, resource_id, new_values)
        VALUES (COALESCE(current_setting('app.current_user_id', true)::UUID, '00000000-0000-0000-0000-000000000000'::UUID), 'create', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO activity_logs (user_id, action, resource_type, resource_id, old_values, new_values)
        VALUES (COALESCE(current_setting('app.current_user_id', true)::UUID, '00000000-0000-0000-0000-000000000000'::UUID), 'update', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO activity_logs (user_id, action, resource_type, resource_id, old_values)
        VALUES (COALESCE(current_setting('app.current_user_id', true)::UUID, '00000000-0000-0000-0000-000000000000'::UUID), 'delete', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Activity logging triggers
CREATE TRIGGER log_products_activity AFTER INSERT OR UPDATE OR DELETE ON products FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_news_activity AFTER INSERT OR UPDATE OR DELETE ON news_articles FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_contact_messages_activity AFTER INSERT OR UPDATE OR DELETE ON contact_messages FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER log_orders_activity AFTER INSERT OR UPDATE OR DELETE ON orders FOR EACH ROW EXECUTE FUNCTION log_activity();

-- =============================================
-- VIEWS
-- =============================================

-- Active products with category info
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
    p.tags,
    p.created_at,
    c.name as category_name,
    c.slug as category_slug
FROM products p
JOIN product_categories c ON p.category_id = c.id
WHERE p.status = 'active';

-- Published news articles
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
    tags,
    published_at,
    created_at,
    read_time
FROM news_articles
WHERE status = 'published' AND published_at IS NOT NULL
ORDER BY published_at DESC;

-- Unread contact messages
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

-- Recent orders
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

-- Public system settings
CREATE VIEW public_settings_view AS
SELECT 
    setting_key,
    setting_value,
    setting_type
FROM system_settings
WHERE is_public = TRUE;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can view all users" ON admin_users FOR SELECT USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY "Admins can update users" ON admin_users FOR UPDATE USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY "Super admins can insert users" ON admin_users FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'super_admin');
CREATE POLICY "Super admins can delete users" ON admin_users FOR DELETE USING (auth.jwt()->>'role' = 'super_admin');

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own sessions" ON user_sessions FOR DELETE USING (user_id = auth.uid());

-- Products policies
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (auth.jwt()->>'role' IN ('admin', 'super_admin', 'editor'));

-- Product categories policies
CREATE POLICY "Public can view active categories" ON product_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage categories" ON product_categories FOR ALL USING (auth.jwt()->>'role' IN ('admin', 'super_admin', 'editor'));

-- News articles policies
CREATE POLICY "Public can view published articles" ON news_articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage articles" ON news_articles FOR ALL USING (auth.jwt()->>'role' IN ('admin', 'super_admin', 'editor'));

-- Contact messages policies
CREATE POLICY "Admins can manage messages" ON contact_messages FOR ALL USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- Orders policies
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- System settings policies
CREATE POLICY "Public can view public settings" ON system_settings FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Admins can manage settings" ON system_settings FOR ALL USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));

-- Activity logs policies
CREATE POLICY "Admins can view logs" ON activity_logs FOR SELECT USING (auth.jwt()->>'role' IN ('admin', 'super_admin'));
CREATE POLICY "System can insert logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@afriprocessors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'System Administrator', 'super_admin');

-- Insert product categories
INSERT INTO product_categories (name, description, slug, sort_order) VALUES 
('Flours', 'Nutritious flours from various African crops', 'flours', 1),
('Oils', 'Natural oils for cooking and cosmetic use', 'oils', 2),
('Seeds', 'High-quality seeds for planting and consumption', 'seeds', 3),
('Powders', 'Fine powders from natural ingredients', 'powders', 4);

-- Insert sample products
INSERT INTO products (name, description, sku, category_id, price, stock_quantity, image_url, status, is_featured, tags) VALUES 
('Moringa Flour', 'Premium quality moringa flour, rich in vitamins and minerals', 'MF001', (SELECT id FROM product_categories WHERE slug = 'flours'), 15000.00, 150, '/images/moringa-flour.jpg', 'active', TRUE, '["superfood", "organic", "nutritious"]'),
('Baobab Flour', 'Nutrient-dense baobab flour packed with vitamin C and fiber', 'BF001', (SELECT id FROM product_categories WHERE slug = 'flours'), 18000.00, 85, '/images/baobab-flour.jpg', 'active', TRUE, '["superfood", "vitamin-c", "fiber"]'),
('Castor Oil', 'Pure, cold-pressed castor oil for cosmetic and industrial use', 'CO001', (SELECT id FROM product_categories WHERE slug = 'oils'), 25000.00, 60, '/images/castor-oil.jpg', 'active', FALSE, '["cosmetic", "industrial", "natural"]'),
('Moringa Seeds', 'High-quality moringa seeds for planting and consumption', 'MS001', (SELECT id FROM product_categories WHERE slug = 'seeds'), 8000.00, 200, '/images/moringa-seeds.jpg', 'active', FALSE, '["seeds", "planting", "edible"]');

-- Insert sample news articles
INSERT INTO news_articles (title, slug, excerpt, content, author, category, image_url, status, is_featured, published_at, read_time) VALUES 
('Afri Processors Launches New Moringa Flour Production Line', 'moringa-flour-production-launch', 'We are excited to announce the launch of our new state-of-the-art moringa flour production line.', 'We are excited to announce the launch of our new state-of-the-art moringa flour production line, doubling our capacity to serve the growing demand for nutritious superfoods across East Africa.', 'Sarah Kimani', 'Company News', '/images/moringa-production.jpg', 'published', TRUE, NOW(), 5),
('New Partnership with Local Farmers Boosts Sustainable Agriculture', 'local-farmers-partnership', 'Afri Processors has established a groundbreaking partnership with over 200 local farmers.', 'Afri Processors has established a groundbreaking partnership with over 200 local farmers to promote sustainable agricultural practices and ensure fair trade principles.', 'John Okello', 'Sustainability', '/images/farmers-partnership.jpg', 'published', TRUE, NOW(), 4);

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
-- SUPABASE FUNCTIONS FOR AUTHENTICATION
-- =============================================

-- Function to handle user login
CREATE OR REPLACE FUNCTION authenticate_user(username_param TEXT, password_param TEXT)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    email TEXT,
    full_name TEXT,
    role user_role,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.role,
        u.is_active
    FROM admin_users u
    WHERE u.username = username_param 
    AND u.password_hash = crypt(password_param, u.password_hash)
    AND u.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user session
CREATE OR REPLACE FUNCTION create_user_session(user_id_param UUID, session_token_param TEXT, expires_at_param TIMESTAMPTZ, ip_address_param INET DEFAULT NULL, user_agent_param TEXT DEFAULT NULL)
RETURNS UUID AS $$
BEGIN
    INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
    VALUES (user_id_param, session_token_param, expires_at_param, ip_address_param, user_agent_param)
    RETURNING id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate session
CREATE OR REPLACE FUNCTION validate_session(session_token_param TEXT)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    email TEXT,
    full_name TEXT,
    role user_role,
    expires_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.role,
        s.expires_at
    FROM user_sessions s
    JOIN admin_users u ON s.user_id = u.id
    WHERE s.session_token = session_token_param 
    AND s.expires_at > NOW()
    AND u.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions WHERE expires_at <= NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- COMPLETION
-- =============================================

-- This Supabase schema provides:
-- - UUID primary keys for better security
-- - Row Level Security (RLS) for fine-grained access control
-- - PostgreSQL enums for data integrity
-- - JSONB for flexible data storage
-- - Full-text search capabilities
-- - Automatic timestamp updates
-- - Activity logging
-- - Authentication functions
-- - Optimized indexes
-- - Sample data for testing

-- The schema is designed to work seamlessly with Supabase's
-- authentication, real-time subscriptions, and edge functions.
