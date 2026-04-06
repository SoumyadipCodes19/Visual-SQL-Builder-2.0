// --- Mock Database Schema & Data ---

export const DB_SCHEMA = {
  employees: [
    { name: 'id',            type: 'uuid'    },
    { name: 'name',          type: 'text'    },
    { name: 'email',         type: 'text'    },
    { name: 'department_id', type: 'uuid'    },
    { name: 'hire_date',     type: 'date'    },
    { name: 'salary',        type: 'numeric' },
  ],
  departments: [
    { name: 'id',       type: 'uuid' },
    { name: 'name',     type: 'text' },
    { name: 'location', type: 'text' },
  ],
  products: [
    { name: 'id',            type: 'uuid'    },
    { name: 'name',          type: 'text'    },
    { name: 'category',      type: 'text'    },
    { name: 'price',         type: 'numeric' },
    { name: 'stock',         type: 'integer' },
    { name: 'department_id', type: 'uuid'    },
  ],
};

export const MOCK_DATA = {
  employees: [
    { id: 'e01', name: 'John Doe',        email: 'john@example.com',    department_id: 'd1', hire_date: '2023-01-15', salary: 85000  },
    { id: 'e02', name: 'Jane Smith',      email: 'jane@example.com',    department_id: 'd2', hire_date: '2022-11-01', salary: 92000  },
    { id: 'e03', name: 'Bob Johnson',     email: 'bob@example.com',     department_id: 'd1', hire_date: '2024-02-10', salary: 78000  },
    { id: 'e04', name: 'Alice Williams',  email: 'alice@example.com',   department_id: 'd3', hire_date: '2021-08-20', salary: 105000 },
    { id: 'e05', name: 'Charlie Brown',   email: 'charlie@example.com', department_id: 'd2', hire_date: '2023-05-12', salary: 65000  },
    { id: 'e06', name: 'Diana Prince',    email: 'diana@example.com',   department_id: 'd1', hire_date: '2022-03-08', salary: 95000  },
    { id: 'e07', name: 'Ethan Hunt',      email: 'ethan@example.com',   department_id: 'd4', hire_date: '2023-09-01', salary: 72000  },
    { id: 'e08', name: 'Fiona Green',     email: 'fiona@example.com',   department_id: 'd3', hire_date: '2021-12-15', salary: 88000  },
    { id: 'e09', name: 'George Miller',   email: 'george@example.com',  department_id: 'd2', hire_date: '2024-01-20', salary: 60000  },
    { id: 'e10', name: 'Hannah Lee',      email: 'hannah@example.com',  department_id: 'd4', hire_date: '2022-07-30', salary: 79000  },
    { id: 'e11', name: 'Ivan Petrov',     email: 'ivan@example.com',    department_id: 'd1', hire_date: '2023-11-05', salary: 91000  },
    { id: 'e12', name: 'Julia Roberts',   email: 'julia@example.com',   department_id: 'd5', hire_date: '2020-06-18', salary: 115000 },
  ],
  departments: [
    { id: 'd1', name: 'Engineering', location: 'New York'  },
    { id: 'd2', name: 'Marketing',   location: 'London'    },
    { id: 'd3', name: 'Sales',       location: 'Chicago'   },
    { id: 'd4', name: 'HR',          location: 'Austin'    },
    { id: 'd5', name: 'Finance',     location: 'Singapore' },
  ],
  // department_id FK: Electronics/Software → Engineering (d1), Furniture/Office → Marketing (d2)
  products: [
    { id: 'p01', name: 'Laptop Pro',          category: 'Electronics', price: 1299.99, stock: 50,  department_id: 'd1' },
    { id: 'p02', name: 'Ergonomic Chair',      category: 'Furniture',   price: 299.50,  stock: 120, department_id: 'd2' },
    { id: 'p03', name: 'Wireless Mouse',       category: 'Electronics', price: 49.99,   stock: 200, department_id: 'd1' },
    { id: 'p04', name: 'Mechanical Keyboard',  category: 'Electronics', price: 149.00,  stock: 85,  department_id: 'd1' },
    { id: 'p05', name: 'Standing Desk',        category: 'Furniture',   price: 599.00,  stock: 30,  department_id: 'd2' },
    { id: 'p06', name: 'USB-C Hub',            category: 'Electronics', price: 69.99,   stock: 300, department_id: 'd1' },
    { id: 'p07', name: 'Monitor 27"',          category: 'Electronics', price: 499.99,  stock: 40,  department_id: 'd1' },
    { id: 'p08', name: 'Desk Lamp',            category: 'Office',      price: 39.99,   stock: 150, department_id: 'd2' },
    { id: 'p09', name: 'Webcam HD',            category: 'Electronics', price: 89.99,   stock: 75,  department_id: 'd1' },
    { id: 'p10', name: 'Notebook Pack',        category: 'Office',      price: 12.99,   stock: 500, department_id: 'd2' },
    { id: 'p11', name: 'Noise-Cancel Headset', category: 'Electronics', price: 249.00,  stock: 60,  department_id: 'd1' },
    { id: 'p12', name: 'Whiteboard',           category: 'Office',      price: 79.99,   stock: 20,  department_id: 'd2' },
    { id: 'p13', name: 'Office Chair',         category: 'Furniture',   price: 199.00,  stock: 90,  department_id: 'd2' },
    { id: 'p14', name: 'Tablet 10"',           category: 'Electronics', price: 379.99,  stock: 55,  department_id: 'd1' },
    { id: 'p15', name: 'Cable Organizer',      category: 'Office',      price: 9.99,    stock: 400, department_id: 'd2' },
  ],
};
