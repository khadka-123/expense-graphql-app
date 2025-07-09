# Expense Tracker API

## Installation

1. Clone the repository
   ```
   git clone https://github.com/khadka-123/expense-graphql-app.git
   cd expense-graphql-app
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Configure environment variables
   Create a `.env` file in the root:
   ```
   PORT=4000
   MONGO_URL=mongodb://localhost:27017/expenseDb
   JWT_SECRET=yourSecretKey
   ```
4. Run MongoDB
   Make sure your MongoDB server is running locally.
5. Start the development server
   ```
   npm run dev
   npm run server
   ```

## Usage

Use Postman for API calls.

Query:
    getTransaction,
    getAccountInformation,
    getTransactionsInRange,

Mutation: 
    addTransaction,
    updateTransaction,
    softUpdateTransaction,
    deleteTransaction,
    register,
    login,
    logout,
    resetPassword,
    changeEmail,

## API

The Expense Tracker API provides the following GraphQL queries and mutations:

**Queries:**
- `getTransaction`
- `getAccountInformation`
- `getTransactionsInRange`

**Mutations:**
- `addTransaction`
- `updateTransaction`
- `softUpdateTransaction`
- `deleteTransaction`
- `register`
- `login`
- `logout`
- `resetPassword`
- `changeEmail`

## Contributing

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

© 2025 Khadka Baniya

## Testing

The project includes a test suite that can be run using the following command:

```
npm run test
```
