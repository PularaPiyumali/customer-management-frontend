# Customer Management System - Frontend

A modern React application for managing customers with intuitive UI.

Technologies Used

React 18
JavaScript (ES6+)
Axios (HTTP client)
React Router Dom (Navigation)
Material-UI (MUI) (UI components and icons)

- Backend API running on `http://localhost:8080`

## Project Structure

```
customer-management-frontend/
├── public/
│   ├── icon.png
│   ├── index.html
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── CustomerForm.js
│   │   ├── CustomerTable.js
│   │   ├── EditCustomerPage.js
│   │   └── ExcelUpload.js
│   ├── pages/
│   │   └── Home.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .env.example
├── .env.local
├── .gitattributes
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd customer-management-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Copy `.env.example` to `.env.local` and update values:
```bash
cp .env.example .env.local
```

Update `.env.local`:
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### 4. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Starts development server |
| `npm test` | Runs test suite |
| `npm run build` | Creates production build |
| `npm run eject` | Ejects from Create React App |
| `npm run lint` | Runs ESLint |
| `npm run format` | Formats code with Prettier |

## Key Components

### CustomerTable (components/CustomerTable.js)
- Displays customers in a responsive table format
- Supports pagination, sorting, and filtering
- Action buttons for edit operation

### CustomerForm (components/CustomerForm.js)
- Handles both create and update operations
- Form validation for all required fields
- Dynamic fields for addresses and mobile numbers

### ExcelUpload (components/ExcelUpload.js)
- Drag and drop file upload interface

### Home (pages/Home.js)
- Main dashboard and landing page

### Screenshots

- Excel File Upload

<img width="1898" height="853" alt="Screenshot 2025-07-24 141617" src="https://github.com/user-attachments/assets/510f7fa7-8be0-40d4-8e9b-6c5c0b295d9e" />


- Customers Directory

<img width="1873" height="851" alt="Screenshot 2025-07-24 141627" src="https://github.com/user-attachments/assets/70622c87-6ac1-48ad-8589-792493a58243" />


- Add Customers

<img width="1872" height="854" alt="Screenshot 2025-07-24 141704" src="https://github.com/user-attachments/assets/e5107d60-7544-42ac-a772-d816b6d12962" />


- Edit Customers

<img width="1870" height="851" alt="Screenshot 2025-07-24 141733" src="https://github.com/user-attachments/assets/3bbdd0c6-f9a2-43a0-acad-62a206041cd6" />




