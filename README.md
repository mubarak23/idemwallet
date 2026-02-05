# Loan & Wallet Service

A minimal **Node.js + TypeScript + Sequelize** backend demonstrating **production-grade financial transaction safety**:

- Idempotent money transfers  
- Double-entry ledger accounting  
- Crash-safe transaction processing  
- Daily interest calculation (**27.5% per annum**)  
- Precision-safe balance math (**BigInt / Big.js**)  

The system is designed so **money never disappears**, even if the database crashes mid-transaction.

---

# Features

## Idempotent Transfers
- Prevents **double spending** using an `idempotencyKey`
- Safe retries after network or DB failure
- Transaction lifecycle:

```
PENDING → COMPLETED | FAILED
```

## Double-Entry Ledger
Every transfer creates:

- **DEBIT** from sender  
- **CREDIT** to receiver  

Guarantees:

- Full audit trail  
- Reversible accounting  
- No silent balance mutation  

## Crash-Safe Processing
If a failure occurs mid-transfer:

- Ledger shows **exact fund location**
- `PENDING` transactions can be retried safely
- No funds are lost or duplicated

## Daily Interest Engine
- **27.5% annual rate**
- Calculated **daily**
- Uses **Big.js** to avoid floating-point errors
- Handles:
  - Leap years  
  - Zero balances  
  - Very large balances  

---


# Architecture Overview

The system is designed around **financial safety, auditability, and precision**.  
It separates **transaction intent**, **money movement**, and **balance computation** into clear layers.

---

## 1. Transaction Log (Intent Layer)

Stores the **intent and lifecycle** of a transfer before any money moves.

### Fields
- `id`
- `idempotencyKey`
- `fromUserId`
- `toUserId`
- `amount` *(stored in minor units)*
- `status: PENDING | COMPLETED | FAILED`

### Responsibilities
- Prevent **double execution** via idempotency key  
- Track **transaction state**  
- Enable **safe retries** after crashes  

**Lifecycle**

```
PENDING → COMPLETED | FAILED
```

---

## 2. Ledger Entries (Money Movement Layer)

Implements **double-entry accounting**, ensuring every debit has a matching credit.

### Fields
- `id`
- `transactionId`
- `accountId`
- `entryType: DEBIT | CREDIT`
- `amount`
- `status: PENDING | POSTED | REVERSED`
- `referenceType`
- `referenceId`

### Guarantees
- Full **audit trail** of all money movement  
- **Reversible** accounting without deleting records  
- No silent or hidden balance mutations  

Each transfer produces:

```
DEBIT  → Sender account
CREDIT → Receiver account
```

---

## 3. Balance Strategy (Computation Layer)

Balances are **derived safely** while maintaining performance.

### Storage
- Stored as **BIGINT minor units** (kobo, cents, sats)

### Math Precision
- **BigInt** → transfer arithmetic  
- **Big.js** → interest calculations  

### Benefits
- No floating-point rounding errors  
- Accurate handling of **large balances**  
- Deterministic financial calculations  

---

## 4. Crash-Safe Transfer Flow

```
1. Create TransactionLog (PENDING)
2. Start DB transaction
3. Insert ledger DEBIT (sender)
4. Insert ledger CREDIT (receiver)
5. Update balances using BigInt
6. Mark TransactionLog → COMPLETED
7. Commit transaction
```

If a crash occurs:

- Ledger still shows **exact fund location**
- Transaction remains **PENDING**
- Safe **retry without duplication**

---

## 5. Interest Accrual Engine

- **27.5% annual rate**
- Calculated **daily**
- Uses **precision math (Big.js)**
- Supports **365 and leap-year 366 days**

Formula:

```
dailyRate = 0.275 / daysInYear
interest  = principal × dailyRate
```

Rounded **down to minor units** to avoid over-crediting.




# Tech Stack

- **Node.js**
- **TypeScript**
- **Express**
- **Sequelize (PostgreSQL)**
- **Big.js**
- **Jest**

---

# Getting Started

## Install Dependencies

```bash
npm install
```

## Run Database Migrations

```bash
npx sequelize db:migrate
```

## Seed Sample Users

```bash
npx sequelize db:seed:all
```

## Start Development Server

```bash
npm run dev
```

## Run Tests

```bash
npx jest
```

---

# Safety Guarantees

- No double spending  
- No lost funds during crashes  
- Full audit trail of all money movement  
- Precision-safe financial math  
- Retry-safe pending transactions  

---

## InterestService Unit Tests

Test results for `InterestService`:

```
 PASS  src/services/test/InterestService.test.ts
  InterestService
    ✓ calculates correct daily interest for 100000 principal (2 ms)
    ✓ calculates correct interest on leap year (366 days)
    ✓ handles zero balance correctly
    ✓ rounds down interest correctly
    ✓ does not lose precision with large numbers
```

### Coverage Report

| File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|----------------------|---------|----------|---------|---------|------------------|
| **All files**        | 65.21   | 0        | 50      | 65.21   |                  |
| config               | 100     | 100      | 100     | 100     |                  |
| &nbsp;&nbsp;database.ts | 100  | 100      | 100     | 100     |                  |
| models               | 100     | 100      | 100     | 100     |                  |
| &nbsp;&nbsp;User.ts  | 100     | 100      | 100     | 100     |                  |
| services             | 46.66   | 0        | 50      | 46.66   |                  |
| &nbsp;&nbsp;InterestService.ts | 46.66 | 0 | 50 | 46.66 | 24-36 |

**Test Summary**

- Test Suites: 1 passed, 1 total  
- Tests: 5 passed, 5 total  
- Snapshots: 0 total  
- Time: 1.302 s  
- Ran all test suites successfully


## API Endpoint: Transfer Funds

### **POST /api/transfer**

Transfers funds from one user to another in a **crash-safe, idempotent, ledger-backed** manner.

- **Creates a TransactionLog** (PENDING)  
- **Updates ledger entries** for DEBIT/CREDIT  
- **Updates balances safely** using `BigInt`  
- **Marks transaction as COMPLETED** if successful  

---

### **Request Payload**

```json
{
  "fromUserId": "a065ab90-eeee-43e4-ab9e-5d2a395b432a",
  "toUserId": "111ab4d3-0d77-490c-a4f1-afe365f9faf3",
  "amount": 5000,
  "idempotencyKey": "5a26dfa5c0e6b9b065a"
}
```

**Field Descriptions:**

| Field             | Type   | Description |
|------------------|--------|-------------|
| fromUserId        | string | UUID of the sender |
| toUserId          | string | UUID of the recipient |
| amount            | number | Transfer amount in minor units (e.g., cents, kobo, sats) |
| idempotencyKey    | string | Unique key to prevent double processing |

---

### **Response (Success Example)**

```json
{
  "transactionId": "d8f0c5c1-2c4a-4a1b-9f45-1234567890ab",
  "status": "COMPLETED",
  "fromUserId": "a065ab90-eeee-43e4-ab9e-5d2a395b432a",
  "toUserId": "111ab4d3-0d77-490c-a4f1-afe365f9faf3",
  "amount": 5000
}
```

**Notes:**

- If the same `idempotencyKey` is sent twice, the transaction will **not be processed again**; the original result is returned.  
- Any failure during the transaction will **roll back all DB changes**, preserving ledger and balances.  
- Suitable for **mobile and web clients** with low-latency, crash-safe transfers.



### **GET /api/calculateInterest**

Calculates the **daily interest** for a user based on a **27.5% annual rate**, using precise arithmetic to avoid floating-point errors.
