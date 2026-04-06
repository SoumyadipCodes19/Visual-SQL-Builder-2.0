import { useState } from 'react';

// ─── Shared query catalogue (exported for reuse in ComplexQueriesSection) ─────
// Each entry: id, title, badge, explanation { what, how }, tables | joinCombinations

export const QUERY_CATALOGUE = [
  // ── 1. INNER JOIN ──────────────────────────────────────────────────────────
  {
    id: 'inner-join',
    title: 'INNER JOIN',
    badge: 'JOIN',
    isJoin: true,
    explanation: {
      what: 'A JOIN combines rows from two or more tables based on a related column. INNER JOIN returns only the rows where there is a match in BOTH tables — non-matching rows from either side are excluded.',
      how:  'The selected LEFT table is joined to the selected RIGHT table on their shared key. Only rows that have a matching record in both tables appear in the result.',
    },
    // keyed by "fromTable-joinTable"
    joinCombinations: {
      'employees-departments': {
        sql: `SELECT e.name, e.salary, d.name AS department, d.location
FROM employees e
INNER JOIN departments d
  ON e.department_id = d.id
ORDER BY e.salary DESC`,
        headers: ['name', 'salary', 'department', 'location'],
        rows: [
          { name: 'Alice Williams', salary: 105000, department: 'Sales',       location: 'Chicago'  },
          { name: 'Jane Smith',     salary: 92000,  department: 'Marketing',   location: 'London'   },
          { name: 'John Doe',       salary: 85000,  department: 'Engineering', location: 'New York' },
          { name: 'Bob Johnson',    salary: 78000,  department: 'Engineering', location: 'New York' },
          { name: 'Charlie Brown',  salary: 65000,  department: 'Marketing',   location: 'London'   },
        ],
      },
      'departments-employees': {
        sql: `SELECT d.name AS department, d.location, COUNT(e.id) AS employee_count
FROM departments d
INNER JOIN employees e
  ON d.id = e.department_id
GROUP BY d.id, d.name, d.location
ORDER BY employee_count DESC`,
        headers: ['department', 'location', 'employee_count'],
        rows: [
          { department: 'Engineering', location: 'New York', employee_count: 2 },
          { department: 'Marketing',   location: 'London',   employee_count: 2 },
          { department: 'Sales',       location: 'Chicago',  employee_count: 1 },
        ],
      },
      'employees-products': {
        sql: `SELECT e.name AS employee, e.department_id,
       p.name AS product, p.category, p.price
FROM employees e
INNER JOIN products p
  ON p.department_id = e.department_id
ORDER BY e.name, p.price DESC`,
        headers: ['employee', 'department_id', 'product', 'category', 'price'],
        rows: [
          { employee: 'Bob Johnson',   department_id: 'd1', product: 'Laptop Pro',          category: 'Electronics', price: 1299.99 },
          { employee: 'Bob Johnson',   department_id: 'd1', product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00  },
          { employee: 'Bob Johnson',   department_id: 'd1', product: 'Wireless Mouse',      category: 'Electronics', price: 49.99   },
          { employee: 'Charlie Brown', department_id: 'd2', product: 'Standing Desk',       category: 'Furniture',   price: 599.00  },
          { employee: 'Charlie Brown', department_id: 'd2', product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50  },
          { employee: 'Jane Smith',    department_id: 'd2', product: 'Standing Desk',       category: 'Furniture',   price: 599.00  },
          { employee: 'Jane Smith',    department_id: 'd2', product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50  },
          { employee: 'John Doe',      department_id: 'd1', product: 'Laptop Pro',          category: 'Electronics', price: 1299.99 },
          { employee: 'John Doe',      department_id: 'd1', product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00  },
          { employee: 'John Doe',      department_id: 'd1', product: 'Wireless Mouse',      category: 'Electronics', price: 49.99   },
        ],
      },
      'products-employees': {
        sql: `SELECT p.name AS product, p.category, p.price,
       e.name AS employee, e.salary
FROM products p
INNER JOIN employees e
  ON p.department_id = e.department_id
ORDER BY p.price DESC, e.name`,
        headers: ['product', 'category', 'price', 'employee', 'salary'],
        rows: [
          { product: 'Laptop Pro',          category: 'Electronics', price: 1299.99, employee: 'Bob Johnson',  salary: 78000 },
          { product: 'Laptop Pro',          category: 'Electronics', price: 1299.99, employee: 'John Doe',     salary: 85000 },
          { product: 'Standing Desk',       category: 'Furniture',   price: 599.00,  employee: 'Charlie Brown', salary: 65000 },
          { product: 'Standing Desk',       category: 'Furniture',   price: 599.00,  employee: 'Jane Smith',   salary: 92000 },
          { product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50,  employee: 'Charlie Brown', salary: 65000 },
          { product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50,  employee: 'Jane Smith',   salary: 92000 },
          { product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00,  employee: 'Bob Johnson',  salary: 78000 },
          { product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00,  employee: 'John Doe',     salary: 85000 },
          { product: 'Wireless Mouse',      category: 'Electronics', price: 49.99,   employee: 'Bob Johnson',  salary: 78000 },
          { product: 'Wireless Mouse',      category: 'Electronics', price: 49.99,   employee: 'John Doe',     salary: 85000 },
        ],
      },
      'products-departments': {
        sql: `SELECT p.name AS product, p.category, p.price, p.stock,
       d.name AS department, d.location
FROM products p
INNER JOIN departments d
  ON p.department_id = d.id
ORDER BY p.price DESC`,
        headers: ['product', 'category', 'price', 'stock', 'department', 'location'],
        rows: [
          { product: 'Laptop Pro',          category: 'Electronics', price: 1299.99, stock: 50,  department: 'Engineering', location: 'New York' },
          { product: 'Standing Desk',       category: 'Furniture',   price: 599.00,  stock: 30,  department: 'Marketing',   location: 'London'   },
          { product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50,  stock: 120, department: 'Marketing',   location: 'London'   },
          { product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00,  stock: 85,  department: 'Engineering', location: 'New York' },
          { product: 'Wireless Mouse',      category: 'Electronics', price: 49.99,   stock: 200, department: 'Engineering', location: 'New York' },
        ],
      },
      'departments-products': {
        sql: `SELECT d.name AS department, d.location,
       p.name AS product, p.category, p.price
FROM departments d
INNER JOIN products p
  ON d.id = p.department_id
ORDER BY d.name, p.price DESC`,
        headers: ['department', 'location', 'product', 'category', 'price'],
        rows: [
          { department: 'Engineering', location: 'New York', product: 'Laptop Pro',          category: 'Electronics', price: 1299.99 },
          { department: 'Engineering', location: 'New York', product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00  },
          { department: 'Engineering', location: 'New York', product: 'Wireless Mouse',      category: 'Electronics', price: 49.99   },
          { department: 'Marketing',   location: 'London',   product: 'Standing Desk',       category: 'Furniture',   price: 599.00  },
          { department: 'Marketing',   location: 'London',   product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50  },
        ],
      },
    },
  },

  // ── 2. LEFT JOIN ───────────────────────────────────────────────────────────
  {
    id: 'left-join',
    title: 'LEFT JOIN',
    badge: 'JOIN',
    isJoin: true,
    explanation: {
      what: 'LEFT JOIN returns ALL rows from the left (FROM) table, plus matching rows from the right (JOIN) table. If there is no match, right-table columns appear as NULL.',
      how:  'Every row in the left table is kept even without a match. The right table fills in extra detail where available, and NULL where not.',
    },
    joinCombinations: {
      'employees-departments': {
        sql: `SELECT e.name, e.salary, d.name AS dept_name, d.location
FROM employees e
LEFT JOIN departments d
  ON e.department_id = d.id
ORDER BY e.name`,
        headers: ['name', 'salary', 'dept_name', 'location'],
        rows: [
          { name: 'Alice Williams', salary: 105000, dept_name: 'Sales',       location: 'Chicago'  },
          { name: 'Bob Johnson',    salary: 78000,  dept_name: 'Engineering', location: 'New York' },
          { name: 'Charlie Brown',  salary: 65000,  dept_name: 'Marketing',   location: 'London'   },
          { name: 'Jane Smith',     salary: 92000,  dept_name: 'Marketing',   location: 'London'   },
          { name: 'John Doe',       salary: 85000,  dept_name: 'Engineering', location: 'New York' },
        ],
      },
      'departments-employees': {
        sql: `SELECT d.name AS department, d.location, e.name AS employee
FROM departments d
LEFT JOIN employees e
  ON d.id = e.department_id
ORDER BY d.name, e.name`,
        headers: ['department', 'location', 'employee'],
        rows: [
          { department: 'Engineering', location: 'New York', employee: 'Bob Johnson'    },
          { department: 'Engineering', location: 'New York', employee: 'John Doe'       },
          { department: 'Marketing',   location: 'London',   employee: 'Charlie Brown'  },
          { department: 'Marketing',   location: 'London',   employee: 'Jane Smith'     },
          { department: 'Sales',       location: 'Chicago',  employee: 'Alice Williams' },
        ],
      },
      'employees-products': {
        sql: `SELECT e.name AS employee, e.department_id,
       p.name AS product, p.category, p.price
FROM employees e
LEFT JOIN products p
  ON p.department_id = e.department_id
ORDER BY e.name, p.price DESC`,
        headers: ['employee', 'department_id', 'product', 'category', 'price'],
        rows: [
          { employee: 'Alice Williams', department_id: 'd3', product: null,               category: null,          price: null    },
          { employee: 'Bob Johnson',    department_id: 'd1', product: 'Laptop Pro',        category: 'Electronics', price: 1299.99 },
          { employee: 'Bob Johnson',    department_id: 'd1', product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00 },
          { employee: 'Bob Johnson',    department_id: 'd1', product: 'Wireless Mouse',   category: 'Electronics', price: 49.99  },
          { employee: 'Charlie Brown',  department_id: 'd2', product: 'Standing Desk',    category: 'Furniture',   price: 599.00  },
          { employee: 'Charlie Brown',  department_id: 'd2', product: 'Ergonomic Chair',  category: 'Furniture',   price: 299.50  },
          { employee: 'Jane Smith',     department_id: 'd2', product: 'Standing Desk',    category: 'Furniture',   price: 599.00  },
          { employee: 'Jane Smith',     department_id: 'd2', product: 'Ergonomic Chair',  category: 'Furniture',   price: 299.50  },
          { employee: 'John Doe',       department_id: 'd1', product: 'Laptop Pro',        category: 'Electronics', price: 1299.99 },
          { employee: 'John Doe',       department_id: 'd1', product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00 },
          { employee: 'John Doe',       department_id: 'd1', product: 'Wireless Mouse',   category: 'Electronics', price: 49.99  },
        ],
      },
      'products-employees': {
        sql: `SELECT p.name AS product, p.category, p.price,
       e.name AS employee, e.salary
FROM products p
LEFT JOIN employees e
  ON p.department_id = e.department_id
ORDER BY p.price DESC, e.name`,
        headers: ['product', 'category', 'price', 'employee', 'salary'],
        rows: [
          { product: 'Laptop Pro',          category: 'Electronics', price: 1299.99, employee: 'Bob Johnson',   salary: 78000  },
          { product: 'Laptop Pro',          category: 'Electronics', price: 1299.99, employee: 'John Doe',      salary: 85000  },
          { product: 'Standing Desk',       category: 'Furniture',   price: 599.00,  employee: 'Charlie Brown', salary: 65000  },
          { product: 'Standing Desk',       category: 'Furniture',   price: 599.00,  employee: 'Jane Smith',    salary: 92000  },
          { product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50,  employee: 'Charlie Brown', salary: 65000  },
          { product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50,  employee: 'Jane Smith',    salary: 92000  },
          { product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00,  employee: 'Bob Johnson',   salary: 78000  },
          { product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00,  employee: 'John Doe',      salary: 85000  },
          { product: 'Wireless Mouse',      category: 'Electronics', price: 49.99,   employee: null,            salary: null   },
        ],
      },
      'products-departments': {
        sql: `SELECT p.name AS product, p.category, p.price, p.stock,
       d.name AS department, d.location
FROM products p
LEFT JOIN departments d
  ON p.department_id = d.id
ORDER BY p.price DESC`,
        headers: ['product', 'category', 'price', 'stock', 'department', 'location'],
        rows: [
          { product: 'Laptop Pro',          category: 'Electronics', price: 1299.99, stock: 50,  department: 'Engineering', location: 'New York' },
          { product: 'Standing Desk',       category: 'Furniture',   price: 599.00,  stock: 30,  department: 'Marketing',   location: 'London'   },
          { product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50,  stock: 120, department: 'Marketing',   location: 'London'   },
          { product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00,  stock: 85,  department: 'Engineering', location: 'New York' },
          { product: 'Wireless Mouse',      category: 'Electronics', price: 49.99,   stock: 200, department: 'Engineering', location: 'New York' },
        ],
      },
      'departments-products': {
        sql: `SELECT d.name AS department, d.location,
       p.name AS product, p.category, p.price
FROM departments d
LEFT JOIN products p
  ON d.id = p.department_id
ORDER BY d.name, p.price DESC`,
        headers: ['department', 'location', 'product', 'category', 'price'],
        rows: [
          { department: 'Engineering', location: 'New York', product: 'Laptop Pro',          category: 'Electronics', price: 1299.99 },
          { department: 'Engineering', location: 'New York', product: 'Mechanical Keyboard', category: 'Electronics', price: 149.00  },
          { department: 'Engineering', location: 'New York', product: 'Wireless Mouse',      category: 'Electronics', price: 49.99   },
          { department: 'Marketing',   location: 'London',   product: 'Standing Desk',       category: 'Furniture',   price: 599.00  },
          { department: 'Marketing',   location: 'London',   product: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50  },
          { department: 'Sales',       location: 'Chicago',  product: null,                  category: null,          price: null    },
        ],
      },
    },
  },

  // ── 3. GROUP BY ────────────────────────────────────────────────────────────
  {
    id: 'group-by',
    title: 'GROUP BY',
    badge: 'GROUP BY',
    explanation: {
      what: 'GROUP BY collapses rows that share the same value in one or more columns into a single summary row. Aggregate functions like COUNT, SUM, AVG, MIN, MAX are then applied per group.',
      how:  'We group employees by department_id and compute the count and average salary within each department.',
    },
    tables: {
      employees: {
        sql: `SELECT department_id,
       COUNT(id)         AS employee_count,
       AVG(salary)       AS avg_salary,
       MAX(salary)       AS max_salary,
       MIN(salary)       AS min_salary
FROM employees
GROUP BY department_id
ORDER BY avg_salary DESC`,
        headers: ['department_id', 'employee_count', 'avg_salary', 'max_salary', 'min_salary'],
        rows: [
          { department_id: 'd3', employee_count: 1, avg_salary: 105000, max_salary: 105000, min_salary: 105000 },
          { department_id: 'd1', employee_count: 2, avg_salary: 81500,  max_salary: 85000,  min_salary: 78000  },
          { department_id: 'd2', employee_count: 2, avg_salary: 78500,  max_salary: 92000,  min_salary: 65000  },
        ],
      },
      departments: {
        sql: `SELECT location, COUNT(id) AS dept_count
FROM departments
GROUP BY location
ORDER BY location`,
        headers: ['location', 'dept_count'],
        rows: [
          { location: 'Chicago',  dept_count: 1 },
          { location: 'London',   dept_count: 1 },
          { location: 'New York', dept_count: 1 },
        ],
      },
      products: {
        sql: `SELECT category,
       COUNT(id)      AS product_count,
       SUM(stock)     AS total_stock,
       AVG(price)     AS avg_price,
       MAX(price)     AS max_price
FROM products
GROUP BY category
ORDER BY total_stock DESC`,
        headers: ['category', 'product_count', 'total_stock', 'avg_price', 'max_price'],
        rows: [
          { category: 'Electronics', product_count: 3, total_stock: 335, avg_price: 499.66, max_price: 1299.99 },
          { category: 'Furniture',   product_count: 2, total_stock: 150, avg_price: 449.25, max_price: 599.00  },
        ],
      },
    },
  },

  // ── 4. HAVING ──────────────────────────────────────────────────────────────
  {
    id: 'having',
    title: 'HAVING',
    badge: 'HAVING',
    explanation: {
      what: 'HAVING filters groups produced by GROUP BY, similar to how WHERE filters individual rows. You must use HAVING (not WHERE) to filter on aggregate function results like COUNT or AVG.',
      how:  'We group employees by department and then use HAVING to keep only departments that have more than 1 employee.',
    },
    tables: {
      employees: {
        sql: `SELECT department_id,
       COUNT(id)   AS employee_count,
       AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING COUNT(id) > 1
ORDER BY avg_salary DESC`,
        headers: ['department_id', 'employee_count', 'avg_salary'],
        rows: [
          { department_id: 'd1', employee_count: 2, avg_salary: 81500 },
          { department_id: 'd2', employee_count: 2, avg_salary: 78500 },
        ],
      },
      departments: {
        sql: `SELECT location, COUNT(id) AS dept_count
FROM departments
GROUP BY location
HAVING COUNT(id) >= 1
ORDER BY location`,
        headers: ['location', 'dept_count'],
        rows: [
          { location: 'Chicago',  dept_count: 1 },
          { location: 'London',   dept_count: 1 },
          { location: 'New York', dept_count: 1 },
        ],
      },
      products: {
        sql: `SELECT category,
       COUNT(id)  AS product_count,
       AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 400
ORDER BY avg_price DESC`,
        headers: ['category', 'product_count', 'avg_price'],
        rows: [
          { category: 'Electronics', product_count: 3, avg_price: 499.66 },
          { category: 'Furniture',   product_count: 2, avg_price: 449.25 },
        ],
      },
    },
  },

  // ── 5. Scalar Subquery (WHERE) ─────────────────────────────────────────────
  {
    id: 'scalar-subquery',
    title: 'Scalar Subquery (WHERE)',
    badge: 'Subquery',
    explanation: {
      what: 'A scalar subquery is a SELECT that returns exactly one value (one row, one column). It is embedded inside another query and treated like a single constant — typically in WHERE or SELECT.',
      how:  'We compute AVG(salary) across the whole table in the inner query, then use that single number to filter rows in the outer WHERE clause.',
    },
    tables: {
      employees: {
        sql: `SELECT name, department_id, salary
FROM employees
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
)
ORDER BY salary DESC`,
        headers: ['name', 'department_id', 'salary'],
        rows: [
          { name: 'Alice Williams', department_id: 'd3', salary: 105000 },
          { name: 'Jane Smith',     department_id: 'd2', salary: 92000  },
          { name: 'John Doe',       department_id: 'd1', salary: 85000  },
        ],
      },
      departments: {
        sql: `SELECT name, location
FROM departments
WHERE name > (
  SELECT MIN(name)
  FROM departments
)
ORDER BY name`,
        headers: ['name', 'location'],
        rows: [
          { name: 'Marketing', location: 'London'  },
          { name: 'Sales',     location: 'Chicago' },
        ],
      },
      products: {
        sql: `SELECT name, category, price
FROM products
WHERE price > (
  SELECT AVG(price)
  FROM products
)
ORDER BY price DESC`,
        headers: ['name', 'category', 'price'],
        rows: [
          { name: 'Laptop Pro',    category: 'Electronics', price: 1299.99 },
          { name: 'Standing Desk', category: 'Furniture',   price: 599.00  },
        ],
      },
    },
  },

  // ── 6. Correlated Subquery ─────────────────────────────────────────────────
  {
    id: 'correlated-subquery',
    title: 'Correlated Subquery',
    badge: 'Subquery',
    explanation: {
      what: 'A correlated subquery references a column from the outer query. It re-executes once for every row the outer query processes, using the outer row\'s value as input.',
      how:  'The inner query finds MAX(salary) only for rows sharing the same department_id as the current outer row — giving us the top earner in each department.',
    },
    tables: {
      employees: {
        sql: `SELECT e.name, e.department_id, e.salary
FROM employees e
WHERE e.salary = (
  SELECT MAX(salary)
  FROM employees
  WHERE department_id = e.department_id
)
ORDER BY e.salary DESC`,
        headers: ['name', 'department_id', 'salary'],
        rows: [
          { name: 'Alice Williams', department_id: 'd3', salary: 105000 },
          { name: 'Jane Smith',     department_id: 'd2', salary: 92000  },
          { name: 'John Doe',       department_id: 'd1', salary: 85000  },
        ],
      },
      departments: {
        sql: `SELECT d.name, d.location
FROM departments d
WHERE d.id = (
  SELECT id FROM departments
  WHERE location = d.location
  ORDER BY name ASC LIMIT 1
)
ORDER BY d.name`,
        headers: ['name', 'location'],
        rows: [
          { name: 'Engineering', location: 'New York' },
          { name: 'Marketing',   location: 'London'   },
          { name: 'Sales',       location: 'Chicago'  },
        ],
      },
      products: {
        sql: `SELECT p.name, p.category, p.price
FROM products p
WHERE p.price = (
  SELECT MAX(price) FROM products
  WHERE category = p.category
)
ORDER BY p.price DESC`,
        headers: ['name', 'category', 'price'],
        rows: [
          { name: 'Laptop Pro',    category: 'Electronics', price: 1299.99 },
          { name: 'Standing Desk', category: 'Furniture',   price: 599.00  },
        ],
      },
    },
  },

  // ── 7. Derived Table (Subquery in FROM) ────────────────────────────────────
  {
    id: 'derived-table',
    title: 'Derived Table (Subquery in FROM)',
    badge: 'Derived Table',
    explanation: {
      what: 'A derived table is a subquery placed inside the FROM clause, treated as a temporary virtual table. It is materialised once per query and given an alias so it can be joined or referenced.',
      how:  'The inner query computes per-department average salary. The outer query joins that result back to employees to find those earning above their own department\'s average.',
    },
    tables: {
      employees: {
        sql: `SELECT e.name, e.salary,
       ROUND(dept.avg_salary, 0) AS dept_avg_salary
FROM employees e
JOIN (
  SELECT department_id,
         AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department_id
) AS dept
  ON e.department_id = dept.department_id
WHERE e.salary > dept.avg_salary
ORDER BY e.salary DESC`,
        headers: ['name', 'salary', 'dept_avg_salary'],
        rows: [
          { name: 'Jane Smith', salary: 92000, dept_avg_salary: 78500 },
          { name: 'John Doe',   salary: 85000, dept_avg_salary: 81500 },
        ],
      },
      departments: {
        sql: `SELECT d.name, d.location, emp.emp_count
FROM departments d
JOIN (
  SELECT department_id, COUNT(*) AS emp_count
  FROM employees
  GROUP BY department_id
) AS emp ON d.id = emp.department_id
ORDER BY emp.emp_count DESC`,
        headers: ['name', 'location', 'emp_count'],
        rows: [
          { name: 'Engineering', location: 'New York', emp_count: 2 },
          { name: 'Marketing',   location: 'London',   emp_count: 2 },
          { name: 'Sales',       location: 'Chicago',  emp_count: 1 },
        ],
      },
      products: {
        sql: `SELECT p.name, p.price,
       ROUND(cat.avg_price, 2) AS category_avg_price
FROM products p
JOIN (
  SELECT category, AVG(price) AS avg_price
  FROM products GROUP BY category
) AS cat ON p.category = cat.category
WHERE p.price > cat.avg_price
ORDER BY p.price DESC`,
        headers: ['name', 'price', 'category_avg_price'],
        rows: [
          { name: 'Laptop Pro',    price: 1299.99, category_avg_price: 499.66 },
          { name: 'Standing Desk', price: 599.00,  category_avg_price: 449.25 },
        ],
      },
    },
  },

  // ── 8. CTE (Common Table Expression) ──────────────────────────────────────
  {
    id: 'cte',
    title: 'CTE (WITH Clause)',
    badge: 'CTE',
    explanation: {
      what: 'A Common Table Expression (CTE) uses the WITH keyword to define a named, reusable temporary result set scoped to a single query. CTEs improve readability and can be referenced multiple times.',
      how:  'We define a CTE called "ranked" that assigns a RANK() to each employee by salary. The outer SELECT then filters those ranked results to the top 3.',
    },
    tables: {
      employees: {
        sql: `WITH ranked AS (
  SELECT name, department_id, salary,
         RANK() OVER (ORDER BY salary DESC) AS salary_rank
  FROM employees
)
SELECT name, department_id, salary, salary_rank
FROM ranked
WHERE salary_rank <= 3`,
        headers: ['name', 'department_id', 'salary', 'salary_rank'],
        rows: [
          { name: 'Alice Williams', department_id: 'd3', salary: 105000, salary_rank: 1 },
          { name: 'Jane Smith',     department_id: 'd2', salary: 92000,  salary_rank: 2 },
          { name: 'John Doe',       department_id: 'd1', salary: 85000,  salary_rank: 3 },
        ],
      },
      departments: {
        sql: `WITH ranked AS (
  SELECT name, location,
         RANK() OVER (ORDER BY name ASC) AS name_rank
  FROM departments
)
SELECT name, location, name_rank
FROM ranked
WHERE name_rank <= 3`,
        headers: ['name', 'location', 'name_rank'],
        rows: [
          { name: 'Engineering', location: 'New York', name_rank: 1 },
          { name: 'Marketing',   location: 'London',   name_rank: 2 },
          { name: 'Sales',       location: 'Chicago',  name_rank: 3 },
        ],
      },
      products: {
        sql: `WITH price_stats AS (
  SELECT category,
         AVG(price) AS avg_price,
         MAX(price) AS max_price
  FROM products
  GROUP BY category
)
SELECT p.name, p.category, p.price,
       ROUND(ps.avg_price, 2) AS cat_avg_price
FROM products p
JOIN price_stats ps ON p.category = ps.category
ORDER BY p.price DESC`,
        headers: ['name', 'category', 'price', 'cat_avg_price'],
        rows: [
          { name: 'Laptop Pro',          category: 'Electronics', price: 1299.99, cat_avg_price: 499.66 },
          { name: 'Standing Desk',       category: 'Furniture',   price: 599.00,  cat_avg_price: 449.25 },
          { name: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50,  cat_avg_price: 449.25 },
          { name: 'Mechanical Keyboard', category: 'Electronics', price: 149.00,  cat_avg_price: 499.66 },
          { name: 'Wireless Mouse',      category: 'Electronics', price: 49.99,   cat_avg_price: 499.66 },
        ],
      },
    },
  },

  // ── 9. Window Function ─────────────────────────────────────────────────────
  {
    id: 'window-function',
    title: 'Window Function (RANK / ROW_NUMBER)',
    badge: 'Window Function',
    explanation: {
      what: 'Window functions (OVER clause) perform calculations across a set of rows related to the current row without collapsing them into a single row like GROUP BY. Examples: RANK(), ROW_NUMBER(), LAG(), LEAD(), SUM() OVER().',
      how:  'RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) assigns a rank within each department — so the highest earner per dept gets rank 1.',
    },
    tables: {
      employees: {
        sql: `SELECT name, department_id, salary,
       RANK() OVER (
         PARTITION BY department_id
         ORDER BY salary DESC
       ) AS dept_rank,
       ROW_NUMBER() OVER (
         ORDER BY salary DESC
       ) AS overall_row
FROM employees
ORDER BY department_id, dept_rank`,
        headers: ['name', 'department_id', 'salary', 'dept_rank', 'overall_row'],
        rows: [
          { name: 'John Doe',       department_id: 'd1', salary: 85000,  dept_rank: 1, overall_row: 3 },
          { name: 'Bob Johnson',    department_id: 'd1', salary: 78000,  dept_rank: 2, overall_row: 4 },
          { name: 'Jane Smith',     department_id: 'd2', salary: 92000,  dept_rank: 1, overall_row: 2 },
          { name: 'Charlie Brown',  department_id: 'd2', salary: 65000,  dept_rank: 2, overall_row: 5 },
          { name: 'Alice Williams', department_id: 'd3', salary: 105000, dept_rank: 1, overall_row: 1 },
        ],
      },
      departments: {
        sql: `SELECT name, location,
       RANK() OVER (ORDER BY name ASC)     AS name_rank,
       ROW_NUMBER() OVER (ORDER BY name)   AS row_num
FROM departments
ORDER BY name_rank`,
        headers: ['name', 'location', 'name_rank', 'row_num'],
        rows: [
          { name: 'Engineering', location: 'New York', name_rank: 1, row_num: 1 },
          { name: 'Marketing',   location: 'London',   name_rank: 2, row_num: 2 },
          { name: 'Sales',       location: 'Chicago',  name_rank: 3, row_num: 3 },
        ],
      },
      products: {
        sql: `SELECT name, category, price,
       RANK() OVER (
         PARTITION BY category
         ORDER BY price DESC
       ) AS cat_price_rank,
       SUM(price) OVER (
         PARTITION BY category
       ) AS cat_total_price
FROM products
ORDER BY category, cat_price_rank`,
        headers: ['name', 'category', 'price', 'cat_price_rank', 'cat_total_price'],
        rows: [
          { name: 'Laptop Pro',          category: 'Electronics', price: 1299.99, cat_price_rank: 1, cat_total_price: 1498.98 },
          { name: 'Mechanical Keyboard', category: 'Electronics', price: 149.00,  cat_price_rank: 2, cat_total_price: 1498.98 },
          { name: 'Wireless Mouse',      category: 'Electronics', price: 49.99,   cat_price_rank: 3, cat_total_price: 1498.98 },
          { name: 'Standing Desk',       category: 'Furniture',   price: 599.00,  cat_price_rank: 1, cat_total_price: 898.50  },
          { name: 'Ergonomic Chair',     category: 'Furniture',   price: 299.50,  cat_price_rank: 2, cat_total_price: 898.50  },
        ],
      },
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ALL_TABLES = ['employees', 'departments', 'products'];

function ComplexQueryPicker({ onResults }) {
  const [queryId,   setQueryId]   = useState('');
  const [fromTable, setFromTable] = useState('employees');
  const [joinTable, setJoinTable] = useState('departments');
  const [tableKey,  setTableKey]  = useState('employees');

  const selected = QUERY_CATALOGUE.find((q) => q.id === queryId);
  const isJoin   = selected?.isJoin ?? false;

  // For JOIN: build the combo key and check if it has data
  const comboKey    = `${fromTable}-${joinTable}`;
  const joinData    = isJoin ? selected?.joinCombinations?.[comboKey] : null;
  const joinInvalid = isJoin && !joinData;

  function handleRun() {
    if (!selected) { alert('Please select a query type first.'); return; }
    if (isJoin) {
      if (fromTable === joinTable) { alert('FROM and JOIN tables must be different.'); return; }
      if (!joinData) { alert(`No pre-built query for ${fromTable} → ${joinTable}. Try swapping the tables.`); return; }
      onResults({ sql: joinData.sql, headers: joinData.headers, rows: joinData.rows });
    } else {
      const tableData = selected.tables[tableKey];
      onResults({ sql: tableData.sql, headers: tableData.headers, rows: tableData.rows });
    }
  }

  return (
    <div className="complex-picker-section">
      <div className="section-divider" />

      <div className="form-group">
        <label className="form-label">COMPLEX / NESTED QUERY</label>

        {/* Query type selector */}
        <select
          className="form-select"
          value={queryId}
          onChange={(e) => setQueryId(e.target.value)}
          style={{ marginBottom: '12px' }}
        >
          <option value="">Choose a query type…</option>
          <optgroup label="── JOIN Queries ──">
            {QUERY_CATALOGUE.filter(q => q.badge === 'JOIN').map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </optgroup>
          <optgroup label="── Aggregation ──">
            {QUERY_CATALOGUE.filter(q => ['GROUP BY', 'HAVING'].includes(q.badge)).map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </optgroup>
          <optgroup label="── Subqueries ──">
            {QUERY_CATALOGUE.filter(q => q.badge === 'Subquery').map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </optgroup>
          <optgroup label="── Advanced ──">
            {QUERY_CATALOGUE.filter(q => ['Derived Table', 'CTE', 'Window Function'].includes(q.badge)).map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </optgroup>
        </select>

        {/* Explanation block */}
        {selected && (
          <div className="complex-picker-explanation">
            <div className="explanation-badge-row">
              <span className="complex-query-badge">{selected.badge}</span>
            </div>
            <div className="explanation-block">
              <div className="explanation-row">
                <span className="explanation-label">What it is:</span>
                <span className="explanation-text">{selected.explanation.what}</span>
              </div>
              <div className="explanation-row">
                <span className="explanation-label">This query:</span>
                <span className="explanation-text">{selected.explanation.how}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Only show table selectors if a query type is selected */}
        {selected && (
          isJoin ? (
            /* ── JOIN: two table selectors ── */
            <>
              <div className="complex-picker-row" style={{ marginBottom: '10px' }}>
                <div className="form-group-flex">
                  <label className="form-label" style={{ marginBottom: '6px' }}>FROM (Left Table)</label>
                  <select
                    className="form-select"
                    value={fromTable}
                    onChange={(e) => setFromTable(e.target.value)}
                  >
                    {ALL_TABLES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group-flex">
                  <label className="form-label" style={{ marginBottom: '6px' }}>JOIN (Right Table)</label>
                  <select
                    className="form-select"
                    value={joinTable}
                    onChange={(e) => setJoinTable(e.target.value)}
                  >
                    {ALL_TABLES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="complex-picker-run">
                  <button
                    className="report-button"
                    onClick={handleRun}
                    disabled={!selected || joinInvalid || fromTable === joinTable}
                    style={{
                      opacity: (!selected || joinInvalid || fromTable === joinTable) ? 0.45 : 1,
                      cursor:  (!selected || joinInvalid || fromTable === joinTable) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ▶ Run
                  </button>
                </div>
              </div>
              {joinInvalid && fromTable !== joinTable && (
                <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '-4px', marginBottom: '8px' }}>
                  ⚠ No pre-built query for <strong>{fromTable} → {joinTable}</strong>. Try swapping or choosing a different pair.
                </p>
              )}
              {fromTable === joinTable && (
                <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '-4px', marginBottom: '8px' }}>
                  ⚠ FROM and JOIN tables must be different.
                </p>
              )}
            </>
          ) : (
            /* ── Non-JOIN: single table selector ── */
            <div className="complex-picker-row">
              <div className="form-group-flex">
                <label className="form-label" style={{ marginBottom: '6px' }}>Table</label>
                <select
                  className="form-select"
                  value={tableKey}
                  onChange={(e) => setTableKey(e.target.value)}
                >
                  {ALL_TABLES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="complex-picker-run">
                <button
                  className="report-button"
                  onClick={handleRun}
                  disabled={!selected}
                  style={{ opacity: selected ? 1 : 0.45, cursor: selected ? 'pointer' : 'not-allowed' }}
                >
                  ▶ Run
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ComplexQueryPicker;
