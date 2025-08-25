# Split App Backend Troubleshooting Guide

## Quick Fix Steps

### 1. Start the Backend Server

Navigate to the backend directory and run the startup script:

```bash
cd c:/Users/user/Desktop/DevFolks/split-app/split-app/backend
./start-server.bat
```

Or manually:

```bash
npm run dev
```

### 2. Verify Server is Running

Open a browser and go to: http://localhost:5000
You should see: "API is running"

### 3. Test API Endpoints

Open the file `api-test.html` in your browser to test basic connectivity.

## Common Issues & Solutions

### Issue 1: 400 Bad Request on Wallet Creation

**Cause**: Missing main wallet for user
**Solution**: Backend now automatically creates main wallets

**Debug Steps**:

1. Check browser network tab for exact error message
2. Verify JWT token is being sent correctly
3. Check backend console logs

### Issue 2: Database Connection Issues

**Check**:

- PostgreSQL is running on port 5432
- Database `split_app` exists
- User `postgres` has correct password `052001`

**Fix**:

```sql
-- Connect to PostgreSQL and create database if needed
CREATE DATABASE split_app;
```

### Issue 3: JWT Token Issues

**Symptoms**: 401 Unauthorized errors
**Solution**:

1. Clear localStorage in browser
2. Login again to get fresh token
3. Check JWT_SECRET in .env file

### Issue 4: CORS Issues

**Symptoms**: Cross-origin request blocked
**Check**: Frontend is running on port 5173 (Vite default)

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Can access http://localhost:5000
- [ ] Database connection successful
- [ ] Can login and get token
- [ ] Can create wallets
- [ ] Can deposit funds
- [ ] Can split funds

## Backend Improvements Made

1. **Auto Main Wallet Creation**: Users automatically get main wallets
2. **Better Error Handling**: More detailed error messages
3. **Debug Logging**: Console logs for troubleshooting
4. **Robust Database Checks**: Ensures main wallet exists before operations

## API Endpoints

- `GET /` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User signup
- `GET /api/auth/me` - Get user profile
- `GET /api/wallet` - Get user wallets
- `POST /api/wallet` - Create new wallet
- `POST /api/wallet/deposit` - Deposit to main wallet
- `POST /api/wallet/split` - Split funds from main wallet

## Environment Variables

Ensure your `.env` file contains:

```
DATABASE_URL=postgres://postgres:052001@localhost:5432/split_app
JWT_SECRET=your_secret_key_here
PORT=5000
```

## Next Steps

1. Run the backend using `start-server.bat`
2. Check the console output for any errors
3. Test the API endpoints
4. Try the wallet operations from the frontend
5. Check browser console for any client-side errors
