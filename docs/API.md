# Car Shop Management System - API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

The API uses JWT tokens stored in HTTP-only cookies for authentication.

### Authentication Endpoints

#### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

#### POST /auth/logout

Logout user and clear JWT token.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET /auth/me

Get current authenticated user information.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Customer Management

### Customer Endpoints

#### GET /customers

Get all customers.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "(555) 123-4567",
      "address": "123 Main St, City, State",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "vehicles": [
        {
          "id": "clx1234567891",
          "make": "Toyota",
          "model": "Camry",
          "year": 2020
        }
      ],
      "services": []
    }
  ]
}
```

#### GET /customers/:id

Get a specific customer by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "address": "123 Main St, City, State",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "vehicles": [
      {
        "id": "clx1234567891",
        "make": "Toyota",
        "model": "Camry",
        "year": 2020,
        "vin": "1HGBH41JXMN109186"
      }
    ],
    "services": [
      {
        "id": "clx1234567892",
        "type": "Oil Change",
        "status": "COMPLETED",
        "scheduledAt": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

#### POST /customers

Create a new customer.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "(555) 234-5678",
  "address": "456 Oak Ave, City, State"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": "clx1234567893",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "(555) 234-5678",
    "address": "456 Oak Ave, City, State",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### PUT /customers/:id

Update an existing customer.

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "phone": "(555) 234-5679",
  "address": "789 Pine St, City, State"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer updated successfully",
  "data": {
    "id": "clx1234567893",
    "name": "Jane Smith Updated",
    "email": "jane.updated@example.com",
    "phone": "(555) 234-5679",
    "address": "789 Pine St, City, State",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

#### DELETE /customers/:id

Delete a customer.

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

## Vehicle Management

### Vehicle Endpoints

#### GET /vehicles

Get all vehicles.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `customerId` (optional): Filter by customer ID
- `make` (optional): Filter by vehicle make
- `model` (optional): Filter by vehicle model

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567891",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "vin": "1HGBH41JXMN109186",
      "licensePlate": "ABC123",
      "color": "Silver",
      "mileage": 25000,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "customer": {
        "id": "clx1234567890",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "services": []
    }
  ]
}
```

#### GET /vehicles/:id

Get a specific vehicle by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567891",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "vin": "1HGBH41JXMN109186",
    "licensePlate": "ABC123",
    "color": "Silver",
    "mileage": 25000,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "customer": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "services": [
      {
        "id": "clx1234567892",
        "type": "Oil Change",
        "status": "COMPLETED",
        "scheduledAt": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

#### POST /vehicles

Create a new vehicle.

**Request Body:**
```json
{
  "make": "Honda",
  "model": "Civic",
  "year": 2018,
  "vin": "2T1BURHE0JC123456",
  "licensePlate": "XYZ789",
  "color": "Blue",
  "mileage": 35000,
  "customerId": "clx1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "id": "clx1234567894",
    "make": "Honda",
    "model": "Civic",
    "year": 2018,
    "vin": "2T1BURHE0JC123456",
    "licensePlate": "XYZ789",
    "color": "Blue",
    "mileage": 35000,
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z",
    "customer": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### PUT /vehicles/:id

Update an existing vehicle.

**Request Body:**
```json
{
  "make": "Honda",
  "model": "Civic",
  "year": 2018,
  "vin": "2T1BURHE0JC123456",
  "licensePlate": "XYZ789",
  "color": "Red",
  "mileage": 40000,
  "customerId": "clx1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": "clx1234567894",
    "make": "Honda",
    "model": "Civic",
    "year": 2018,
    "vin": "2T1BURHE0JC123456",
    "licensePlate": "XYZ789",
    "color": "Red",
    "mileage": 40000,
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:30:00.000Z",
    "customer": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### DELETE /vehicles/:id

Delete a vehicle.

**Response:**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

## Service Management

### Service Endpoints

#### GET /services

Get all services.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `status` (optional): Filter by service status
- `customerId` (optional): Filter by customer ID
- `vehicleId` (optional): Filter by vehicle ID
- `dateFrom` (optional): Filter by start date
- `dateTo` (optional): Filter by end date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567892",
      "type": "Oil Change",
      "description": "Full synthetic oil change",
      "cost": "45.00",
      "status": "COMPLETED",
      "scheduledAt": "2024-01-15T10:00:00.000Z",
      "completedAt": "2024-01-15T11:00:00.000Z",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z",
      "customer": {
        "id": "clx1234567890",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "vehicle": {
        "id": "clx1234567891",
        "make": "Toyota",
        "model": "Camry",
        "year": 2020
      },
      "user": {
        "id": "clx1234567895",
        "name": "Mechanic Name",
        "email": "mechanic@example.com"
      }
    }
  ]
}
```

#### GET /services/:id

Get a specific service by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567892",
    "type": "Oil Change",
    "description": "Full synthetic oil change",
    "cost": "45.00",
    "status": "COMPLETED",
    "scheduledAt": "2024-01-15T10:00:00.000Z",
    "completedAt": "2024-01-15T11:00:00.000Z",
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "customer": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "vehicle": {
      "id": "clx1234567891",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020
    },
    "user": {
      "id": "clx1234567895",
      "name": "Mechanic Name",
      "email": "mechanic@example.com"
    }
  }
}
```

#### POST /services

Create a new service appointment.

**Request Body:**
```json
{
  "type": "Brake Inspection",
  "description": "Complete brake system inspection",
  "cost": "75.00",
  "scheduledAt": "2024-01-16T14:00:00.000Z",
  "customerId": "clx1234567890",
  "vehicleId": "clx1234567891"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "id": "clx1234567896",
    "type": "Brake Inspection",
    "description": "Complete brake system inspection",
    "cost": "75.00",
    "status": "SCHEDULED",
    "scheduledAt": "2024-01-16T14:00:00.000Z",
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z",
    "customer": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "vehicle": {
      "id": "clx1234567891",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020
    }
  }
}
```

#### PUT /services/:id

Update an existing service.

**Request Body:**
```json
{
  "type": "Brake Inspection",
  "description": "Complete brake system inspection and repair",
  "cost": "150.00",
  "scheduledAt": "2024-01-16T15:00:00.000Z",
  "customerId": "clx1234567890",
  "vehicleId": "clx1234567891"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service updated successfully",
  "data": {
    "id": "clx1234567896",
    "type": "Brake Inspection",
    "description": "Complete brake system inspection and repair",
    "cost": "150.00",
    "status": "SCHEDULED",
    "scheduledAt": "2024-01-16T15:00:00.000Z",
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:30:00.000Z",
    "customer": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "vehicle": {
      "id": "clx1234567891",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020
    }
  }
}
```

#### PATCH /services/:id/status

Update service status.

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service status updated successfully",
  "data": {
    "id": "clx1234567896",
    "type": "Brake Inspection",
    "description": "Complete brake system inspection and repair",
    "cost": "150.00",
    "status": "IN_PROGRESS",
    "scheduledAt": "2024-01-16T15:00:00.000Z",
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z",
    "customer": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "vehicle": {
      "id": "clx1234567891",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020
    }
  }
}
```

#### DELETE /services/:id

Delete a service.

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Name must be at least 2 characters",
      "path": "name",
      "location": "body"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Customer not found"
}
```

### Unauthorized Error (401)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  vehicles: Vehicle[];
  services: Service[];
}
```

### Vehicle
```typescript
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate?: string;
  color?: string;
  mileage?: number;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer;
  services: Service[];
}
```

### Service
```typescript
interface Service {
  id: string;
  type: string;
  description?: string;
  cost: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledAt: Date;
  completedAt?: Date;
  customerId: string;
  vehicleId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer;
  vehicle: Vehicle;
  user: User;
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit information is included in response headers
- **Response**: 429 status code when limit is exceeded

## CORS

The API is configured to accept requests from the frontend origin:

- **Origin**: http://localhost:3000 (development)
- **Credentials**: true (for cookie-based authentication)
- **Methods**: GET, POST, PUT, PATCH, DELETE
- **Headers**: Content-Type, Authorization

## Health Check

### GET /health

Check API health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
``` 