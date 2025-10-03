# Quick Deploy Without Database (Testing Only)

## For Testing Deployment Only:

1. **Comment out database code temporarily:**

   ```typescript
   // In backend/src/index.ts
   // await connectDB(); // Comment this out
   ```

2. **Use mock data in controllers:**

   ```typescript
   // Return static data instead of database queries
   res.json({ wallets: [{ id: "1", name: "Test Wallet", balance: "1000" }] });
   ```

3. **Deploy to test the infrastructure**

4. **Add real database later**

⚠️ **Warning:** This won't save any real data, but you can test if deployment works.
