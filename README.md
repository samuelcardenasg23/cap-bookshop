# CAP Bookshop Project

A simple bookshop application built using SAP Cloud Application Programming Model (CAP).

## Project Overview

This project implements a basic bookshop service with the following features:
- Book catalog management
- Author management
- Order processing
- Stock management

## Key Features

### Services

1. **Catalog Service (`/browse`)**
   - Public book catalog viewing
   - Book ordering functionality
   - Stock management
   - Requires authentication for orders

2. **Admin Service**
   - Complete book management
   - Author management
   - Requires authentication

### Data Models

- **Books**: Manages book information including stock and pricing
- **Authors**: Manages author information
- **Genres**: Hierarchical organization of book genres

### Available Endpoints

Refer to `test.http` for the available endpoints

1. **Browse Books (Public)**
   ```http
   GET http://localhost:4004/browse/Books
   ```

2. **Submit Order (Authenticated)**
   ```http
   POST http://localhost:4004/browse/submitOrder
   ```

3. **Admin Operations (Authenticated)**
   ```http
   GET http://localhost:4004/odata/v4/admin/Books
   POST http://localhost:4004/odata/v4/admin/Books
   ```

### Authentication

The project uses basic authentication with predefined users:
- `alice` (admin access)
- `bob` (restricted access)