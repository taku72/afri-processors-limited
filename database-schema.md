# Afri Processors Database Schema

## Overview
This database schema supports a complete admin management system with super admin and admin roles, authentication, content management, and file upload capabilities.

## Database Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 2. Admin Sessions Table
```sql
CREATE TABLE admin_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Content Categories Table
```sql
CREATE TABLE content_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Content Posts Table
```sql
CREATE TABLE content_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category_id INT,
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    featured_image_url VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    published_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES content_categories(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 5. Media Files Table
```sql
CREATE TABLE media_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type ENUM('image', 'document', 'video', 'audio', 'other') NOT NULL,
    alt_text VARCHAR(255),
    description TEXT,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

### 6. Products Table
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    min_order_quantity INT DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'piece',
    is_active BOOLEAN DEFAULT TRUE,
    featured_image_url VARCHAR(500),
    specifications JSON,
    features JSON,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 7. Product Images Table
```sql
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    media_file_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (media_file_id) REFERENCES media_files(id) ON DELETE CASCADE
);
```

### 8. News Articles Table
```sql
CREATE TABLE news_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id INT NOT NULL,
    category VARCHAR(100),
    featured_image_url VARCHAR(500),
    read_time_minutes INT DEFAULT 5,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 9. Contact Messages Table
```sql
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    notes TEXT,
    replied_by INT,
    replied_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (replied_by) REFERENCES users(id)
);
```

### 10. System Settings Table
```sql
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

### 11. Activity Logs Table
```sql
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## Indexes

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Admin sessions indexes
CREATE INDEX idx_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_sessions_user ON admin_sessions(user_id);
CREATE INDEX idx_sessions_expires ON admin_sessions(expires_at);

-- Content posts indexes
CREATE INDEX idx_posts_status ON content_posts(status);
CREATE INDEX idx_posts_category ON content_posts(category_id);
CREATE INDEX idx_posts_author ON content_posts(author_id);
CREATE INDEX idx_posts_published ON content_posts(published_at);

-- Media files indexes
CREATE INDEX idx_media_type ON media_files(file_type);
CREATE INDEX idx_media_uploader ON media_files(uploaded_by);

-- Products indexes
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_creator ON products(created_by);

-- News articles indexes
CREATE INDEX idx_news_status ON news_articles(status);
CREATE INDEX idx_news_author ON news_articles(author_id);
CREATE INDEX idx_news_published ON news_articles(published_at);

-- Activity logs indexes
CREATE INDEX idx_logs_user ON activity_logs(user_id);
CREATE INDEX idx_logs_action ON activity_logs(action);
CREATE INDEX idx_logs_created ON activity_logs(created_at);
```

## Sample Data

### Initial Super Admin
```sql
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
('superadmin', 'superadmin@afriprocessors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Super Administrator', 'super_admin');
```

### Content Categories
```sql
INSERT INTO content_categories (name, slug, description) VALUES 
('Company News', 'company-news', 'Official company announcements and news'),
('Products', 'products', 'Product information and updates'),
('Sustainability', 'sustainability', 'Environmental and sustainability initiatives'),
('Careers', 'careers', 'Job opportunities and company culture');
```

### System Settings
```sql
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES 
('site_name', 'Afri Processors Limited', 'string', 'Website name', TRUE),
('site_description', 'Quality Agricultural Processing Since 1990', 'string', 'Website description', TRUE),
('max_upload_size', '10485760', 'number', 'Maximum file upload size in bytes', FALSE),
('allowed_file_types', '["jpg","jpeg","png","gif","pdf","doc","docx"]', 'json', 'Allowed file extensions for upload', FALSE);
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/auth/refresh` - Refresh session token
- `GET /api/auth/me` - Get current user info

### User Management (Super Admin only)
- `GET /api/admin/users` - List all admin users
- `POST /api/admin/users` - Create new admin user
- `GET /api/admin/users/[id]` - Get specific user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `PUT /api/admin/users/[id]/toggle-status` - Activate/deactivate user

### Content Management
- `GET /api/admin/content/posts` - List all posts
- `POST /api/admin/content/posts` - Create new post
- `GET /api/admin/content/posts/[id]` - Get specific post
- `PUT /api/admin/content/posts/[id]` - Update post
- `DELETE /api/admin/content/posts/[id]` - Delete post
- `PUT /api/admin/content/posts/[id]/publish` - Publish/unpublish post

### Media Management
- `POST /api/admin/media/upload` - Upload file
- `GET /api/admin/media` - List media files
- `GET /api/admin/media/[id]` - Get media file info
- `DELETE /api/admin/media/[id]` - Delete media file
- `PUT /api/admin/media/[id]` - Update media metadata

### Product Management
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/products/[id]/images` - Add product images

### News Management
- `GET /api/admin/news` - List news articles
- `POST /api/admin/news` - Create news article
- `GET /api/admin/news/[id]` - Get news article
- `PUT /api/admin/news/[id]` - Update news article
- `DELETE /api/admin/news/[id]` - Delete news article

### Contact Management
- `GET /api/admin/contact/messages` - List contact messages
- `GET /api/admin/contact/messages/[id]` - Get message
- `PUT /api/admin/contact/messages/[id]/reply` - Mark as replied
- `PUT /api/admin/contact/messages/[id]/status` - Update message status

### System Settings
- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings

## Security Considerations

1. **Password Hashing**: Use bcrypt for password storage
2. **Session Management**: JWT tokens with expiration
3. **File Upload Security**: Validate file types, sizes, and scan for malware
4. **SQL Injection Prevention**: Use parameterized queries
5. **XSS Protection**: Sanitize all user inputs
6. **CSRF Protection**: Implement CSRF tokens for forms
7. **Rate Limiting**: Prevent brute force attacks
8. **Access Control**: Strict role-based permissions

## File Upload Structure

```
/uploads/
├── images/
│   ├── products/
│   ├── news/
│   └── content/
├── documents/
│   ├── pdfs/
│   └── others/
└── temp/
```

## User Roles and Permissions

### Super Admin
- Create, update, delete admin users
- Access all system settings
- Manage all content types
- View activity logs
- Full system access

### Admin
- Manage content (posts, news, products)
- Upload and manage media files
- Handle contact messages
- View their own activity logs
- Limited system access

## Default Credentials

**Super Admin:**
- Username: `superadmin`
- Password: `admin123` (change immediately after first login)

## Implementation Notes

1. **Database Engine**: MySQL 8.0+ or PostgreSQL 13+
2. **Character Set**: UTF-8mb4 for full Unicode support
3. **Storage Engine**: InnoDB for MySQL
4. **Backup Strategy**: Daily automated backups
5. **Monitoring**: Track login attempts and failed operations
6. **Audit Trail**: All changes logged in activity_logs table
