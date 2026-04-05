-- Afri Processors Limited - Clean Database Schema
-- This schema is designed to work correctly with Supabase

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
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
    category_id UUID REFERENCES product_categories(id) ON DELETE RESTRICT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News articles
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_news_status ON news_articles(status);
CREATE INDEX idx_messages_status ON contact_messages(status);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Simple authentication function
CREATE OR REPLACE FUNCTION authenticate_user(username_param TEXT, password_param TEXT)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id::UUID,
        u.username::TEXT,
        u.email::TEXT,
        u.full_name::TEXT,
        u.role::TEXT,
        u.is_active::BOOLEAN
    FROM admin_users u
    WHERE u.username = username_param 
    AND u.password_hash = crypt(password_param, u.password_hash)
    AND u.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get all admin users
CREATE OR REPLACE FUNCTION get_all_admin_users()
RETURNS TABLE (
    id UUID,
    username TEXT,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username::TEXT,
        u.email::TEXT,
        u.full_name::TEXT,
        u.role::TEXT,
        u.is_active::BOOLEAN,
        u.last_login,
        u.created_at
    FROM admin_users u
    ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new admin user
CREATE OR REPLACE FUNCTION create_admin_user(
    username_param TEXT,
    email_param TEXT,
    password_param TEXT,
    full_name_param TEXT,
    role_param TEXT DEFAULT 'admin'
)
RETURNS TABLE (
    id UUID,
    username TEXT,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN
) AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Check if username already exists
    IF EXISTS (SELECT 1 FROM admin_users WHERE username = username_param) THEN
        RAISE EXCEPTION 'Username already exists';
    END IF;
    
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM admin_users WHERE email = email_param) THEN
        RAISE EXCEPTION 'Email already exists';
    END IF;
    
    -- Insert new user
    INSERT INTO admin_users (username, email, password_hash, full_name, role)
    VALUES (
        username_param,
        email_param,
        crypt(password_param, gen_salt('bf')),
        full_name_param,
        role_param
    )
    RETURNING id INTO new_user_id;
    
    -- Return the created user
    RETURN QUERY
    SELECT 
        u.id,
        u.username::TEXT,
        u.email::TEXT,
        u.full_name::TEXT,
        u.role::TEXT,
        u.is_active::BOOLEAN
    FROM admin_users u
    WHERE u.id = new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update admin user
CREATE OR REPLACE FUNCTION update_admin_user(
    user_id_param UUID,
    username_param TEXT DEFAULT NULL,
    email_param TEXT DEFAULT NULL,
    full_name_param TEXT DEFAULT NULL,
    role_param TEXT DEFAULT NULL,
    is_active_param BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    username TEXT,
    email TEXT,
    full_name TEXT,
    role TEXT,
    is_active BOOLEAN
) AS $$
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = user_id_param) THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Update user if parameters are provided
    UPDATE admin_users
    SET 
        username = COALESCE(username_param, username),
        email = COALESCE(email_param, email),
        full_name = COALESCE(full_name_param, full_name),
        role = COALESCE(role_param, role),
        is_active = COALESCE(is_active_param, is_active)
    WHERE id = user_id_param;
    
    -- Return updated user
    RETURN QUERY
    SELECT 
        u.id,
        u.username::TEXT,
        u.email::TEXT,
        u.full_name::TEXT,
        u.role::TEXT,
        u.is_active::BOOLEAN
    FROM admin_users u
    WHERE u.id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Delete admin user
CREATE OR REPLACE FUNCTION delete_admin_user(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = user_id_param) THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Delete user
    DELETE FROM admin_users WHERE id = user_id_param;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert admin user (password: admin123)
INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@afriprocessors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'System Administrator', 'super_admin');

-- Insert product categories
INSERT INTO product_categories (name, description, slug, sort_order) VALUES 
('Flours', 'Nutritious flours from various African crops', 'flours', 1),
('Oils', 'Natural oils for cooking and cosmetic use', 'oils', 2),
('Seeds', 'High-quality seeds for planting and consumption', 'seeds', 3);

-- Insert sample products
INSERT INTO products (name, description, sku, category_id, price, stock_quantity, status) VALUES 
('Moringa Flour', 'Premium quality moringa flour, rich in vitamins and minerals', 'MF001', (SELECT id FROM product_categories WHERE slug = 'flours'), 15000.00, 150, 'active'),
('Baobab Flour', 'Nutrient-dense baobab flour packed with vitamin C and fiber', 'BF001', (SELECT id FROM product_categories WHERE slug = 'flours'), 18000.00, 85, 'active');

-- Insert sample news
INSERT INTO news_articles (title, slug, excerpt, content, author, status, published_at) VALUES 
('Afri Processors Launches New Moringa Flour Production Line', 'moringa-flour-production-launch', 'We are excited to announce the launch of our new state-of-the-art moringa flour production line.', 'We are excited to announce the launch of our new state-of-the-art moringa flour production line, doubling our capacity to serve the growing demand for nutritious superfoods across East Africa.', 'Sarah Kimani', 'published', NOW());

-- Insert sample settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES 
('site_name', 'Afri Processors Limited', 'Website name'),
('site_description', 'Premium African agricultural products and processing solutions', 'Website description'),
('contact_email', 'info@afriprocessors.com', 'Contact email address');

-- =============================================
-- TEST THE AUTHENTICATION
-- =============================================

-- Test the authentication function
SELECT * FROM authenticate_user('admin', 'admin123');
