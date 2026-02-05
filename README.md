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
