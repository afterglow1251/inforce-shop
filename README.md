# Products App

Full-stack application for working with products.

**Backend**: NestJS  
**Frontend**: React

## Installation and launch ⚙️

### Backend

1. Go to the backend directory and install the dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a .env file in the backend root and fill it in (example):

   ```env
   NODE_ENV      =  development | production
   PORT          =

   DB_HOST       =
   DB_PORT       =
   DB_USERNAME   =
   DB_PASSWORD   =
   DB_NAME       =

   FRONTEND_URL  =
   ```

   ⚠️ Fill in the values according to your environment setup.

3. Run the backend:
   ```bash
   npm run start:dev
   ```

### Frontend

1. Go to the frontend directory and install the dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create a .env file in the frontend root and fill it in (example):

   ```env
   VITE_BACKEND_URL  =
   ```

   ⚠️ Fill in the values according to your environment setup.

3. Run the frontend:
   ```bash
   npm run dev
   ```
