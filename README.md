# Kitchen Dashboard 🍽️

A real-time kitchen order management system built with SvelteKit frontend and NestJS backend, featuring PostgreSQL database and RabbitMQ integration for order processing. Part 2 of a two-part application for an Ordering and Order Management system. 

View Part 1 [here](https://github.com/shanicetanhui/ordering-app).

## 🚀 Features

### Core Features
- **Real-time Order Management**: View and manage kitchen orders with live updates via Server-Sent Events (SSE)
- **Order Status Tracking**: Track orders through Pending → Received → Completed states
- **Order Processing**: Process and complete orders with one-click buttons
- **RabbitMQ Integration**: Receive new orders and send status updates via message queues
- **Persistent Storage**: Orders stored in PostgreSQL database with full data persistence
- **Server-Side Rendering**: Fast initial page loads with SvelteKit SSR
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Docker Support**: Complete containerized deployment with Docker Compose

### Advanced Features
- **Server-Sent Events (SSE)**: Real-time order updates without polling for instant UI synchronization
- **Order Soft Delete**: Hide completed orders from view with both frontend-only and database-backed options
- **Order Visibility Control**: Toggle order visibility with persistent state management
- **Modular Backend Architecture**: Separated services for better maintainability:
  - OrderCreationService: Handle new order creation
  - OrderRetrievalService: Manage order fetching and filtering
  - OrderUpdateService: Process order status changes
  - OrderStreamService: Handle real-time SSE streaming
  - OrderVisibilityService: Manage order visibility state
- **Responsive UI**: Modern, clean interface with smooth animations and transitions
- **Completed Orders Page**: Dedicated view for completed orders with visibility controls

## 🛠️ Tech Stack

### Frontend
- **SvelteKit** - Modern web framework with SSR
- **TypeScript** - Type-safe JavaScript

### Backend
- **Node.js** - JavaScript runtime
- **NestJS** - Enterprise-grade Node.js framework
- **TypeORM** - TypeScript ORM for database operations
- **TypeScript** - Type-safe JavaScript

### Database
- **PostgreSQL** - Robust relational database
- **Docker** - Containerized database deployment

### Message Queue
- **RabbitMQ** - Message broker for order processing
- **Docker** - Containerized message broker

### DevOps
- **Docker** - Container platform
- **Docker Compose** - Multi-container orchestration

## 🏗️ Architecture

### Frontend (SvelteKit + TypeScript)
- **Framework**: SvelteKit with Server-Side Rendering (SSR)
- **Features**: Auto-polling, smooth transitions, responsive layout, optimistic UI updates
- **Port**: 3001
- **API Integration**: Direct HTTP calls to NestJS backend with proxy support

### Backend (NestJS + TypeScript)
- **Framework**: NestJS with TypeScript decorators and dependency injection
- **Database**: PostgreSQL with TypeORM for entity management
- **Message Queue**: RabbitMQ integration with amqplib
- **Features**: REST API, order management, real-time updates, data persistence, Server-Sent Events
- **Architecture**: Modular design with specialized services:
  - **OrderCreationService**: Handles new order creation and validation
  - **OrderRetrievalService**: Manages order fetching, filtering, and visibility
  - **OrderUpdateService**: Processes order status changes and notifications
  - **OrderStreamService**: Manages real-time SSE connections and broadcasts
  - **OrderVisibilityService**: Controls order visibility and soft delete functionality
  - **RabbitMQService**: Handles message queue operations
- **Port**: 3000

### Database (PostgreSQL)
- **Engine**: PostgreSQL 15 with Alpine Linux
- **ORM**: TypeORM with entity-based models
- **Features**: JSONB support for complex order data, auto-generated migrations
- **Persistence**: Docker volume for data persistence
- **Port**: 5432

### Message Queue (RabbitMQ)
- **Broker**: RabbitMQ with management interface
- **Queues**: `orders` (incoming), `orderStatus` (outgoing)
- **Features**: Message acknowledgment, error handling, connection resilience
- **Ports**: 5672 (AMQP), 15672 (Management UI)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd kitchen-dashboard

# Start all services (PostgreSQL, RabbitMQ, NestJS backend, SvelteKit frontend)
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 2: Development Mode
```bash
# Prerequisites: PostgreSQL and RabbitMQ running locally

# Clone the repository
git clone <repository-url>
cd kitchen-dashboard

# Start NestJS backend (runs on port 3000)
cd nestjs-backend
npm install
npm run start:dev

# Start SvelteKit frontend (runs on port 3001)
cd ../frontend
npm install
npm run dev
```

## 🗄️ Database Management

### Quick Commands
```bash
# Connect to database
docker exec -it kitchen-postgres psql -U kitchen_user -d kitchen_db

# View all orders
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT * FROM orders;"

# Clear all data and reset ID sequence
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;"

# Backup database
docker exec kitchen-postgres pg_dump -U kitchen_user kitchen_db > backup.sql
```

### Database Schema
```sql
-- Orders table structure
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  items JSONB NOT NULL,  -- {"name": "Coffee", "quantity": 2}
  status orders_status_enum DEFAULT 'Pending',  -- Pending/Received/Completed
  "isVisible" BOOLEAN DEFAULT true,  -- Controls order visibility (soft delete)
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

## 🔗 RabbitMQ Configuration

### Docker Deployment (Included)
RabbitMQ is automatically started with Docker Compose:
```bash
# RabbitMQ is included in docker-compose.yml
docker-compose up -d
```

### External RabbitMQ Server
To connect to an external RabbitMQ server:
```bash
# Set environment variable
export RABBITMQ_URL=amqp://username:password@your-rabbitmq-host:5672

# Or update docker-compose.yml environment section
RABBITMQ_URL: amqp://username:password@your-rabbitmq-host:5672
```

### Message Format
```json
// Incoming orders (to 'orders' queue)
{
  "name": "Cappuccino",
  "quantity": 2
}

// Or new format
{
  "items": {
    "name": "Cappuccino", 
    "quantity": 2
  }
}

// Outgoing status updates (to 'orderStatus' queue)
{
  "orderId": 123,
  "status": "Completed"
}
```

## 🌐 Access Points

```bash
# Application URLs
Frontend:         http://localhost:3001
Backend API:      http://localhost:3000
Database:         localhost:5432 (kitchen_user/kitchen_pass)
RabbitMQ AMQP:    localhost:5672
RabbitMQ Web UI:  http://localhost:15672 (guest/guest)
```

## 📡 API Endpoints

### Orders API
```bash
# Get all orders
GET http://localhost:3000/api/orders

# Get all visible orders only
GET http://localhost:3000/api/orders?visibleOnly=true

# Create new order
POST http://localhost:3000/api/orders
Content-Type: application/json
{
  "items": {
    "name": "Latte",
    "quantity": 1
  }
}

# Update order status
PATCH http://localhost:3000/api/orders/123/update
Content-Type: application/json
{
  "status": "Completed"
}

# Hide order (soft delete)
PATCH http://localhost:3000/api/orders/123/hide

# Server-Sent Events stream
GET http://localhost:3000/api/orders/stream
# Returns: text/event-stream for real-time order updates
```

## 🆕 New Features & Usage

### Server-Sent Events (SSE)
Real-time order updates without polling:
```javascript
// Frontend automatically connects to SSE stream
// Updates are received instantly when orders change
// No manual refresh needed - orders update in real-time
```

### Order Soft Delete (Hide/Show)
Hide completed orders while preserving database records:
```bash
# Hide an order (makes it invisible in UI)
PATCH http://localhost:3000/api/orders/123/hide

# Orders remain in database but are filtered from normal views
# Can be toggled between frontend-only and database-backed hiding
```

### Modular Backend Services
Separated concerns for better maintainability:
- **OrderCreationService**: Validates and creates new orders
- **OrderRetrievalService**: Fetches and filters orders with visibility control
- **OrderUpdateService**: Handles status changes and notifications
- **OrderStreamService**: Manages SSE connections and real-time broadcasts
- **OrderVisibilityService**: Controls order visibility state

### Completed Orders Page
Dedicated view for managing completed orders:
```
# Access completed orders at:
http://localhost:3001/completed

# Features:
- View all completed orders
- Hide/show individual orders
- Real-time updates via SSE
- Persistent visibility state
```

### Order Visibility Controls
Two modes of operation:
1. **Frontend-only**: Orders hidden in UI but remain in API responses
2. **Database-backed**: Orders filtered at database level with `isVisible` column

## 🔄 Migration Guide

### Upgrading from Previous Version

If you're upgrading from a previous version, you'll need to add the new `isVisible` column to your database:

```bash
# Add isVisible column to existing orders table
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "ALTER TABLE orders ADD COLUMN IF NOT EXISTS \"isVisible\" BOOLEAN DEFAULT true;"

# Verify column was added
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "\d orders"
```

### Docker Compose Update
```bash
# Stop existing containers
docker-compose down

# Pull latest images and rebuild
docker-compose up -d --build

# Check that all services are running
docker-compose ps
```

### Frontend Updates
The frontend now uses SSE instead of polling:
- Remove any manual refresh logic
- The UI will update automatically via Server-Sent Events
- Order visibility is managed through stores

### Backend Updates
The backend is now modular:
- OrdersService has been split into specialized services
- New endpoints for SSE streaming and order visibility
- Enhanced error handling and logging

## 🛠️ Development

### Project Structure
```
kitchen-dashboard/
├── docker-compose.yml          # Multi-container orchestration
├── frontend/                   # SvelteKit application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.ts         # API client functions
│   │   │   ├── OrderList.svelte # Order list component
│   │   │   └── stores/
│   │   │       └── orders.ts   # Order state management with visibility
│   │   ├── routes/
│   │   │   ├── +page.svelte   # Main dashboard
│   │   │   └── completed/
│   │   │       └── +page.svelte # Completed orders page
│   │   └── hooks.server.ts    # SSR API proxy
│   └── Dockerfile
└── nestjs-backend/            # NestJS application
    ├── src/
    │   ├── entities/
    │   │   └── order.entity.ts    # Database models with isVisible
    │   ├── orders/
    │   │   ├── orders.controller.ts    # API endpoints
    │   │   ├── orders.module.ts        # NestJS module
    │   │   ├── order-creation.service.ts   # Order creation logic
    │   │   ├── order-retrieval.service.ts  # Order fetching logic
    │   │   ├── order-update.service.ts     # Order update logic
    │   │   ├── order-stream.service.ts     # SSE streaming service
    │   │   └── order-visibility.service.ts # Order visibility management
    │   ├── rabbitmq/
    │   │   └── rabbitmq.service.ts  # Message queue
    │   ├── app.module.ts           # Root module
    │   └── main.ts                 # Application entry
    └── Dockerfile
```

### Environment Variables
```bash
# Backend (.env)
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=kitchen_user
DB_PASSWORD=kitchen_pass
DB_NAME=kitchen_db
RABBITMQ_URL=amqp://rabbitmq:5672
```

## 🧪 Testing

### Manual Testing
```bash
# Test order creation via API
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items": {"name": "Test Coffee", "quantity": 1}}'

# Test via RabbitMQ (send message to orders queue)
# Use RabbitMQ Management UI at http://localhost:15672
```

### Database Testing
```bash
# Check order count
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT COUNT(*) FROM orders;"

# View recent orders
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT * FROM orders ORDER BY \"createdAt\" DESC LIMIT 5;"
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View database logs
docker logs kitchen-postgres

# Reset database (nuclear option)
docker-compose down -v && docker-compose up -d
```

**RabbitMQ Connection Issues:**
```bash
# Check RabbitMQ status
docker logs kitchen-rabbitmq

# Verify queues exist
# Visit http://localhost:15672 and check Queues tab
```

**Frontend/Backend Communication:**
```bash
# Check if backend is responding
curl http://localhost:3000/api/orders

# Check backend logs
docker logs kitchen-nestjs-backend

# Check frontend logs
docker logs kitchen-frontend
```

**Server-Sent Events Issues:**
```bash
# Check if SSE endpoint is working
curl -N http://localhost:3000/api/orders/stream

# Should return: text/event-stream content type
# Events should be received when orders change

# Check browser console for SSE connection errors
# EventSource connection should be established automatically
```

**Order Visibility Issues:**
```bash
# Check if isVisible column exists in database
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "\d orders"

# View all orders including hidden ones
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT id, status, \"isVisible\" FROM orders;"

# Reset all orders to visible
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "UPDATE orders SET \"isVisible\" = true;"
```

**Modular Services Issues:**
```bash
# Check if all services are properly registered
docker logs kitchen-nestjs-backend | grep -i "service"

# Verify dependency injection is working
# All services should be instantiated at startup
```

### Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep -E "(3000|3001|5432|5672|15672)"

# Stop conflicting services
docker-compose down
```

## 🚀 Deployment

### Production Deployment
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d --build

# Or build individual services
docker build -t kitchen-frontend ./frontend
docker build -t kitchen-backend ./nestjs-backend
```

### Environment Configuration
```yaml
# docker-compose.prod.yml example
environment:
  - NODE_ENV=production
  - DB_HOST=your-production-db
  - RABBITMQ_URL=amqp://your-production-rabbitmq
```

## 📋 Features Status

### ✅ Implemented
- [x] Real-time order management with Server-Sent Events (SSE)
- [x] PostgreSQL data persistence with order visibility control
- [x] RabbitMQ message processing
- [x] Server-side rendering (SSR)
- [x] Docker containerization
- [x] TypeScript throughout
- [x] Modular backend architecture with specialized services
- [x] Order soft delete functionality (hide/show orders)
- [x] Real-time UI updates without polling
- [x] Order status tracking (Pending → Received → Completed)
- [x] Completed orders page with visibility controls
- [x] Responsive UI with smooth animations

### 🔄 Future Enhancements
- [ ] User authentication and authorization
- [ ] Order history and analytics dashboard
- [ ] Push notifications for mobile devices
- [ ] Multi-restaurant/kitchen support
- [ ] Order filtering and search functionality
- [ ] Performance monitoring and metrics
- [ ] Automated testing suite
- [ ] Order priority management
- [ ] Kitchen staff assignment
- [ ] Order preparation time tracking

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Happy cooking! 👨‍🍳👩‍🍳**