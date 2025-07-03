📊 Expense Tracker API
A simple full-stack GraphQL API for managing user authentication and expense transactions.
Users can register, log in, and manage their transactions (add, update, delete, view).

📂 Project Structure
src/
 ├── app.ts
 ├── config/
 ├── controllers/
 ├── error/
 ├── middleware/
 ├── model/
 ├── module/
 ├── utils/
tests/
.env
tsconfig.json


🚀 Features
User Registration with password hashing
User Login with JWT Authentication
Password reset,change email,get account info,delete user
Add, Update, Delete, and View Transactions
download transaction in pdf
GraphQL API with Apollo Server & Express
MongoDB Database

📦 Tech Stack
Language/Framework: TypeScript + Node.js + Express
API: GraphQL (Apollo Server)
Database: MongoDB

🛠️ Installation
1️⃣ Clone the repository
git clone https://github.com/khadka-123/expense-graphql-app.git
cd expense-graphql-app

2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables
Create a .env file in the root:
PORT=4000
MONGO_URL=mongodb://localhost:27017/expenseDb
JWT_SECRET=yourSecretKey

4️⃣ Run MongoDB
Make sure your MongoDB server is running locally.

5️⃣ Start the development server
npm run dev
npm run server

📌 GraphQL Endpoints
Use the Postman for API call

📄Mutation

✅ Register User
mutation {
  register(input: {
    name: "John Doe",
    email: "john@example.com",
    password: "MySecurePass123"
  }) {
    message
  }
}

✅ Login User
mutation {
  login(input: {
    email: "john@example.com",
    password: "MySecurePass123"
  }) {
    userId
    token
  }
}

✅ Add Transaction
mutation {
  addTransaction(
    userId: "USER_ID",
    input: {
      amount: 100.0,
      type: "income",
      category: "Salary",
      reference: "Company XYZ",
      description: "Monthly salary",
      date: "2025-06-28"
    }
  ) {
    message
  }
}

📄Query
✅ Get Transactions

🤝 Contributing
Fork the repository
Create a new branch 
Commit your changes
Push to your branch 
Create a Pull Request

📄 License
© 2025 Khadka Baniya
