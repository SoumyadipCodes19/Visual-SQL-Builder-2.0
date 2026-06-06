# Visual SQL Builder 2.0

Visual SQL Builder is a modern, interactive full-stack application designed to help users construct, visualize, and execute SQL queries rapidly through a comprehensive user interface. It translates visual UI configurations (filters, groupings, limits) into optimized raw SQL, executes them against a live database, and visualizes the results instantly.

## 🚀 Key Features

*   **Google OAuth & Multi-Tenancy**: Secured by Google OAuth 2.0 and JWT middleware. Employs dynamic table-prefixing to perfectly isolate user datasets, ensuring 100% data privacy for concurrent users.
*   **Dynamic CSV Uploads**: Instantly upload CSV files and convert them into live, relational PostgreSQL tables with automatic data type detection.
*   **AST-Based Query Engine**: Easily configure `SELECT`, `WHERE` (with complex operators), `GROUP BY`, `ORDER BY`, and `LIMIT` clauses via dynamic UI controls that compile into an AST before generating raw SQL.
*   **Live Schema Introspection**: The Node.js backend dynamically queries `information_schema.columns` (PostgreSQL) or `sqlite_master` (SQLite) to automatically visualize whatever database it connects to in real-time.
*   **Database Schema ERD**: Toggleable visual Entity-Relationship Diagram outlining relationships across your available datasets.
*   **Complex Query Picker & Reporting**: Pre-built templates for advanced nested queries, `JOIN`s, and one-click curated report generators (like "Top Products by Category").

## 🛠️ Technology Stack

*   **Frontend**: React.js 18, Vite, `@react-oauth/google`
*   **Backend**: Node.js, Express.js, Knex.js (SQL Query Builder), `google-auth-library` for secure token validation
*   **Databases**: PostgreSQL (Production), SQLite3 (Local fallback)
*   **Deployments**: 
    *   **Frontend**: Hosted on [Vercel](https://vercel.com)
    *   **Backend & DB**: Hosted on [Render](https://render.com) (Web Service + Managed PostgreSQL Database)
*   **Styling**: Pure Modular CSS

## 📦 Getting Started Locally

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+)
*   A Google Cloud Console account (for your own OAuth Client ID)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SoumyadipCodes19/Visual-SQL-Builder-2.0.git
   cd "Visual SQL Builder-2.0"
   ```

2. **Setup the Backend (Node.js/Express):**
   ```bash
   cd server
   npm install
   ```
   *Optional*: Create a `.env` file in the `/server` folder to override defaults:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/dbname
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   FRONTEND_URL=http://localhost:5173
   ```
   Start the backend server:
   ```bash
   npm start
   ```

3. **Setup the Frontend (React.js/Vite):**
   Open a new terminal and navigate back to the root directory:
   ```bash
   npm install
   ```
   *Optional*: Create a `.env` file in the root folder:
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

4. **Run the App:**
   Open your browser and navigate to `http://localhost:5173/`. 
