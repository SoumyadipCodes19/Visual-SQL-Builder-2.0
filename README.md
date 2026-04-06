# Visual SQL Builder

Visual SQL Builder is a modern, interactive React application designed to help users construct, visualize, and execute SQL queries rapidly through a comprehensive user interface without needing to manually write syntax. Originally conceptualized as a vanilla JS builder, it has evolved into a fully-fledged React SPA powered by Vite, emphasizing powerful data visualization and academic-grade UI polish.

## 🚀 Key Features

*   **Interactive Query Engine**: Easily configure `SELECT`, `WHERE` (with complex operators), `GROUP BY`, `ORDER BY`, and `LIMIT` clauses via dynamic UI controls.
*   **Live SQL Preview**: Watch your SQL string generate perfectly in real-time as you toggle UI components, augmented with our custom, lightweight Syntax Highlighter.
*   **Complex Query Picker**: Quickly implement advanced nested queries and `JOIN`s (e.g., matching Employees to Departments) using pre-built templates accompanied by rich educational explanations of the database behaviors.
*   **Results & CSV Exports**: Execute your built queries instantly against a rich set of mock data in an interactive table view, and instantly download your results as a strictly-formatted CSV file.
*   **Reporting Modules**: One-click curated report generators (like "Top Products by Category" and "Department Metrics") to immediately aggregate the dataset.
*   **Database Schema ERD**: Toggleable visual Entity-Relationship Diagram outlining relationships across our Employee, Department, and Products mocked database.
*   **Query History**: Automatically logs the application's most recent successful query executions so you never lose context during your workflow.

## 🛠️ Technology Stack

*   **Framework**: React 18 (Hooks-based architecture)
*   **Build Tool**: Vite (Extremely fast HMR)
*   **Styling**: Pure Modular CSS (Zero-dependency, semantic component styles, Light-Theme prioritized)
*   **State Management**: React Component state via standard localized/lifted Context paradigms.

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the project directory in your terminal:
   ```bash
   cd "Visual SQL Builder"
   ```

2. Install the React project dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your favorite web browser and navigate to the address shown in the terminal (usually `http://localhost:5173/`).

---

*Note: The frontend is currently operating completely client-side in the browser, utilizing a mock schema engine populated with varied data rows tailored for maximum functional testing and academic demonstration!*
