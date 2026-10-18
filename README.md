# CloudCart E-Commerce Platform 🛒☁️

A full-stack, enterprise-grade cloud e-commerce platform architected with **React (Vite)**, **Node.js (Express)**, and **PostgreSQL**, with automated **Terraform AWS Infrastructure** and **Docker Compose** containerization.

---

## 🌟 Key Features

### 🛍️ 1. Customer Shopping Experience
- **Dynamic Storefront**: Hero banner with live stats, category pills carousel, and handpicked featured hardware.
- **Product Catalog**: Live search, category filtering, min/max price range sliders, in-stock toggle, and multi-option sorting (price, rating, newest).
- **Product Detail Pages**: High-resolution image preview, stock availability badges, discount tags, quantity selector, and instant buy-now triggers.
- **Shopping Bag (Cart)**: Real-time quantity adjustment, persistent storage, free express shipping progress bar, promo code engine (`CLOUDCART10`), and tax/shipping breakdown.
- **Responsive Aesthetics**: Modern dark glassmorphism design system using modern typography (`Outfit` and `Plus Jakarta Sans`), subtle micro-animations, and fluid responsive grids.

### 👤 2. Customer Accounts & Orders
- **Authentication**: Secure JWT-based authentication with salted Bcrypt password hashing.
- **Quick Demo Login**: 1-click login buttons for instant evaluation:
  - **Demo Customer**: `demo@cloudcart.com` / `Customer123!`
  - **Administrator**: `admin@cloudcart.com` / `Admin123!`
- **Checkout Flow**: 2-step checkout with recipient shipping address collection, delivery instructions, and payment mode selection.
- **Order History & Milestone Tracker**: Live visual 5-step milestone tracking (Pending ➔ Confirmed ➔ Processing ➔ Shipped ➔ Delivered).
- **Self-Service Order Cancellation**: Customers can cancel eligible pending/processing orders, automatically restocking product inventory.

### 💳 3. Payments & Notifications
- **Cash on Delivery (COD)**: Supports post-delivery cash payment workflow.
- **Test Mode Card Gateway**: Instant test card simulation (`4242 •••• •••• 4242`) with real-time transaction reference generation (`TXN_TEST_...`).
- **Order Confirmations & Notifications**: Instant order confirmation screen and automated simulated notification receipt dispatch with tracking references.

### 🛡️ 4. Administrator Dashboard
- **Command Metrics**: Real-time KPI summaries for total revenue, lifetime orders, active hardware count, and registered customers.
- **Inventory & Restock Warnings**: Proactive restock badges for products with low remaining stock.
- **Hardware Management**: Add new products, edit price/stock/descriptions, and remove products.
- **Order Status Operations**: Live status dropdowns allowing store managers to advance orders from `pending` to `delivered` or `cancelled`.
- **Customer Directory**: View customer profiles, contact numbers, and access roles.

---

## 📂 Project Directory Structure

```
cloudcart-ecommerce/
│
├── frontend/                       # React 18 SPA (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation with live search, cart counter, and user menu
│   │   │   ├── Footer.jsx          # Trust badges, category links, and newsletter
│   │   │   ├── ProductCard.jsx     # Responsive card with hover effects and quick cart trigger
│   │   │   ├── SearchBar.jsx       # Search input with clear and submit triggers
│   │   │   └── ProtectedRoute.jsx  # Route authorization gate (Customer / Admin)
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Hero section, categories, and featured hardware
│   │   │   ├── Products.jsx        # Product catalog with sidebar filters and sort
│   │   │   ├── ProductDetails.jsx  # Detailed specifications, reviews, and buy-now flow
│   │   │   ├── Cart.jsx            # Cart item manager, promo codes, and summary
│   │   │   ├── Login.jsx           # Sign in with 1-click demo presets
│   │   │   ├── Register.jsx        # Customer account creation
│   │   │   ├── Checkout.jsx        # Shipping address & test payment selector
│   │   │   ├── MyOrders.jsx        # Order history with milestone status tracker
│   │   │   └── AdminDashboard.jsx  # Overview metrics, inventory CRUD, and order manager
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Session and JWT state
│   │   │   └── CartContext.jsx     # Cart items, calculation, and toast notifications
│   │   ├── services/
│   │   │   └── api.js              # Fetch client with auto auth header injection
│   │   ├── App.jsx                 # Route definitions and layout
│   │   ├── main.jsx                # DOM mount & Context wrappers
│   │   └── index.css               # Design system, glassmorphism tokens, and responsive utilities
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend/                        # Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # PostgreSQL pool with zero-config local store fallback
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT bearer verification middleware
│   │   │   └── admin.js            # Administrator role guard
│   │   ├── routes/
│   │   │   ├── auth.routes.js      # Register, login, profile routes
│   │   │   ├── product.routes.js   # Products, categories, search routes
│   │   │   ├── cart.routes.js      # Cart retrieval, add, update, remove routes
│   │   │   ├── order.routes.js     # Checkout, order tracking, order cancellation
│   │   │   └── admin.routes.js     # Admin metrics, product CRUD, and order updates
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── order.controller.js
│   │   │   └── admin.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── product.service.js
│   │   │   ├── cart.service.js
│   │   │   ├── order.service.js
│   │   │   └── admin.service.js
│   │   ├── app.js                  # Express middleware configuration
│   │   └── server.js               # Entry point and port listener
│   ├── tests/
│   │   ├── auth.test.js            # User registration and login tests
│   │   ├── product.test.js         # Catalog filtering and search tests
│   │   ├── order.test.js           # Checkout and cancellation tests
│   │   └── test-runner.js          # Native automated test suite runner
│   ├── .env.example
│   ├── .dockerignore
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   ├── schema.sql                  # PostgreSQL DDL table definitions
│   └── seed.sql                    # Initial seed data for users, categories, products, orders
│
├── infrastructure/                 # Terraform / AWS
│   ├── main.tf                     # Root Terraform module
│   ├── variables.tf                # Environment configuration variables
│   ├── outputs.tf                  # VPC, RDS, and Load Balancer outputs
│   └── modules/
│       ├── vpc/                    # Multi-AZ VPC, Public & Private Subnets
│       ├── rds/                    # AWS RDS PostgreSQL managed database
│       └── ecs/                    # AWS ECS Fargate cluster and ALB
│
├── .github/workflows/
│   ├── ci.yml                      # Automated linting, test suites, and frontend build
│   └── deploy.yml                  # Container image build and deployment pipeline
├── docker-compose.yml              # Production container orchestration
└── README.md
```

---

## 🚀 Quick Start Guide

### Option 1: Instant Local Run (Zero Configuration)

You can launch both the backend and frontend locally without needing a PostgreSQL daemon running, thanks to the resilient built-in storage fallback:

1. **Start the Backend API:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend will boot up at `http://localhost:5000`.*

2. **Start the Frontend Application:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will launch at `http://localhost:5173`.*

---

### Option 2: Docker Compose (Full Stack with PostgreSQL)

To start the entire platform with PostgreSQL, Express, and React inside isolated containers:

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:80`
- **Backend REST API**: `http://localhost:5000`
- **PostgreSQL Database**: `localhost:5432` (Auto-initialized with `database/schema.sql` and `database/seed.sql`)

---

## 🧪 Running Automated Tests

Run the backend test suite verifying authentication, product search, cart operations, order placement, and cancellation:

```bash
cd backend
npm test
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@cloudcart.com` | `Admin123!` | Full Admin Dashboard, Product CRUD, Order Status Updates, Customer Accounts |
| **Customer** | `demo@cloudcart.com` | `Customer123!` | Catalog Browsing, Cart Management, Checkout, Order Tracking, Cancellations |

*Tip: You can also use the 1-click demo buttons on the [Login Page](http://localhost:5173/login) for instant sign-in.*

---

## 📡 Core REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new customer account
- `POST /api/auth/login` - Authenticate and retrieve JWT token
- `GET /api/auth/profile` - Fetch authenticated user profile
- `PUT /api/auth/profile` - Update customer name or phone

### 📦 Products & Categories (`/api/products`)
- `GET /api/products` - Filter catalog by category, search, min/max price, in-stock, and sort
- `GET /api/products/featured` - Retrieve featured hardware devices
- `GET /api/products/categories` - Fetch category list with product counts
- `GET /api/products/:id` - Fetch single product by ID or slug

### 🛒 Shopping Cart (`/api/cart`)
- `GET /api/cart` - Retrieve current cart items and totals
- `POST /api/cart/add` - Add product with specified quantity
- `PUT /api/cart/update` - Update line item quantity
- `DELETE /api/cart/remove/:productId` - Remove product from cart
- `DELETE /api/cart/clear` - Empty cart contents

### 📋 Orders (`/api/orders`)
- `POST /api/orders/checkout` - Validate stock, create order, deduct inventory, and issue receipt
- `GET /api/orders/my-orders` - Retrieve authenticated customer's order history
- `GET /api/orders/:id` - Fetch order details by order ID
- `PUT /api/orders/:id/cancel` - Cancel eligible pending/processing order & restore stock
- `GET /api/orders/track/:orderNumber` - Public order status lookup

### 🛡️ Admin Operations (`/api/admin`)
- `GET /api/admin/dashboard` - Retrieve revenue, order counts, product counts, and restock alerts
- `POST /api/admin/products` - Create new hardware product
- `PUT /api/admin/products/:id` - Update existing product specifications and inventory
- `DELETE /api/admin/products/:id` - Delete product from catalogue
- `GET /api/admin/orders` - View all customer orders with filtering
- `PUT /api/admin/orders/:id/status` - Advance order lifecycle status (`shipped`, `delivered`, etc.)
- `GET /api/admin/customers` - List registered customer accounts

---

## ☁️ Infrastructure & Deployment

The `infrastructure/` directory contains complete modular Terraform definitions:
- **VPC Module**: Creates high-availability public and private subnets across multiple AZs.
- **RDS Module**: Provisions an encrypted AWS RDS PostgreSQL 15 database with automated subnet groups.
- **ECS Module**: Provisions AWS ECS Fargate task definitions, application services, and an Application Load Balancer with health check targets.

Deploying to AWS:
```bash
cd infrastructure
terraform init
terraform plan -var="db_password=YourSecurePassword123!" -var="jwt_secret=YourJWTSecretKey"
terraform apply
```
