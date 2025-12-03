# 🚀 **FEATURE 2: FINANCE INTEGRATION**
## **Complete Implementation Guide**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    💰 FEATURE 2: FINANCE INTEGRATION - FULL IMPL.             ║
║                                                               ║
║  ✅ Database Schema (Prisma)                                 ║
║  ✅ Data Seeding (200+ transactions)                         ║
║  ✅ Backend APIs (Express + TypeScript)                      ║
║  ✅ Commission Auto-Calculation                              ║
║  ✅ Payment Tracking System                                  ║
║  ✅ Frontend Components (React + Next.js)                    ║
║  ✅ Sales Dashboard                                          ║
║  ✅ Financial Reports (PDF/Excel)                            ║
║  ✅ Testing Scripts                                          ║
║                                                               ║
║        Copy-Paste Ready for Immediate Development!           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

# 📋 **TABLE OF CONTENTS**

1. [Database Schema](#1-database-schema)
2. [Data Seeding](#2-data-seeding)
3. [Backend Implementation](#3-backend-implementation)
4. [Commission Service](#4-commission-service)
5. [Payment Processing](#5-payment-processing)
6. [Frontend Components](#6-frontend-components)
7. [Reports & Export](#7-reports--export)
8. [Testing](#8-testing)
9. [Setup Instructions](#9-setup-instructions)

---

# 1️⃣ **DATABASE SCHEMA**

## **Prisma Schema**

File: `backend/prisma/schema.prisma`

```prisma
// ============================================
// FEATURE 2: FINANCE INTEGRATION - DATABASE SCHEMA
// ============================================

// ============================================
// SALES
// ============================================

model Sale {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Property & Customer
  propertyId            String?                 @map("property_id")
  property              OwnerProperty?          @relation(fields: [propertyId], references: [id], onDelete: SetNull)
  customerId            String?                 @map("customer_id")
  customer              Customer?               @relation(fields: [customerId], references: [id], onDelete: SetNull)
  ownerId               String?                 @map("owner_id")
  owner                 PropertyOwner?          @relation(fields: [ownerId], references: [id], onDelete: SetNull)
  seekerId              String?                 @map("seeker_id")
  seeker                PropertySeeker?         @relation(fields: [seekerId], references: [id], onDelete: SetNull)
  
  // Sale Details
  saleType              String                  @map("sale_type") // 'sale', 'rent', 'lease'
  contractNumber        String?                 @unique @map("contract_number")
  
  // Financial Details
  propertyPrice         Decimal                 @map("property_price") @db.Decimal(12, 2)
  saleAmount            Decimal                 @map("sale_amount") @db.Decimal(12, 2) // Final agreed amount
  downPayment           Decimal                 @default(0) @map("down_payment") @db.Decimal(12, 2)
  remainingAmount       Decimal                 @default(0) @map("remaining_amount") @db.Decimal(12, 2)
  
  // Commission
  commissionPercentage  Decimal                 @map("commission_percentage") @db.Decimal(5, 2) // e.g., 2.5%
  commissionAmount      Decimal                 @map("commission_amount") @db.Decimal(12, 2)
  commissionPaid        Boolean                 @default(false) @map("commission_paid")
  commissionPaidAt      DateTime?               @map("commission_paid_at")
  
  // Split Commission (if shared with other brokers)
  splitCommission       Boolean                 @default(false) @map("split_commission")
  
  // Status
  status                String                  @default("draft") // 'draft', 'pending', 'approved', 'completed', 'cancelled'
  paymentStatus         String                  @default("unpaid") @map("payment_status") // 'unpaid', 'partial', 'paid'
  
  // Contract Dates
  contractDate          DateTime?               @map("contract_date")
  deliveryDate          DateTime?               @map("delivery_date")
  expectedCompletionDate DateTime?              @map("expected_completion_date")
  
  // Documents
  contractFileUrl       String?                 @map("contract_file_url")
  attachments           Json                    @default("[]") // [{name, url, type}]
  
  // Notes
  notes                 String?                 @db.Text
  internalNotes         String?                 @map("internal_notes") @db.Text
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamps
  approvedAt            DateTime?               @map("approved_at")
  completedAt           DateTime?               @map("completed_at")
  cancelledAt           DateTime?               @map("cancelled_at")
  cancellationReason    String?                 @map("cancellation_reason")
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  // Relations
  payments              Payment[]
  commissions           Commission[]
  installments          Installment[]
  invoices              Invoice[]

  @@index([userId])
  @@index([propertyId])
  @@index([customerId])
  @@index([status])
  @@index([paymentStatus])
  @@map("sales")
}

// ============================================
// PAYMENTS
// ============================================

model Payment {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Related Sale
  saleId                String?                 @map("sale_id")
  sale                  Sale?                   @relation(fields: [saleId], references: [id], onDelete: SetNull)
  
  // Payment Details
  paymentType           String                  @map("payment_type") // 'sale_payment', 'commission_payment', 'refund', 'advance'
  amount                Decimal                 @db.Decimal(12, 2)
  currency              String                  @default("SAR")
  
  // Payment Method
  paymentMethod         String                  @map("payment_method") // 'cash', 'card', 'bank_transfer', 'cheque', 'online'
  cardLastFour          String?                 @map("card_last_four")
  chequeNumber          String?                 @map("cheque_number")
  transferReference     String?                 @map("transfer_reference")
  
  // Bank Details (for transfers)
  bankName              String?                 @map("bank_name")
  accountNumber         String?                 @map("account_number")
  
  // Status
  status                String                  @default("pending") // 'pending', 'completed', 'failed', 'refunded'
  
  // Dates
  paymentDate           DateTime                @map("payment_date")
  dueDate               DateTime?               @map("due_date")
  clearedDate           DateTime?               @map("cleared_date")
  
  // Recipient
  recipientType         String?                 @map("recipient_type") // 'owner', 'broker', 'company'
  recipientId           String?                 @map("recipient_id")
  recipientName         String?                 @map("recipient_name")
  
  // Receipt
  receiptNumber         String?                 @unique @map("receipt_number")
  receiptUrl            String?                 @map("receipt_url")
  
  // Notes
  notes                 String?                 @db.Text
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@index([saleId])
  @@index([status])
  @@index([paymentDate])
  @@map("payments")
}

// ============================================
// COMMISSIONS
// ============================================

model Commission {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Related Sale
  saleId                String                  @map("sale_id")
  sale                  Sale                    @relation(fields: [saleId], references: [id], onDelete: Cascade)
  
  // Broker Info
  brokerId              String                  @map("broker_id")
  broker                User                    @relation("BrokerCommissions", fields: [brokerId], references: [id])
  brokerRole            String?                 @map("broker_role") // 'primary', 'secondary', 'referral'
  
  // Commission Details
  commissionType        String                  @map("commission_type") // 'sale', 'rent', 'referral'
  percentage            Decimal                 @db.Decimal(5, 2)
  baseAmount            Decimal                 @map("base_amount") @db.Decimal(12, 2) // Amount commission is calculated on
  commissionAmount      Decimal                 @map("commission_amount") @db.Decimal(12, 2)
  
  // Deductions
  deductions            Decimal                 @default(0) @db.Decimal(12, 2)
  deductionReason       String?                 @map("deduction_reason")
  netAmount             Decimal                 @map("net_amount") @db.Decimal(12, 2) // After deductions
  
  // Tax
  taxPercentage         Decimal                 @default(15) @map("tax_percentage") @db.Decimal(5, 2) // VAT in Saudi
  taxAmount             Decimal                 @default(0) @map("tax_amount") @db.Decimal(12, 2)
  totalAmount           Decimal                 @map("total_amount") @db.Decimal(12, 2) // Net + Tax
  
  // Payment Status
  status                String                  @default("pending") // 'pending', 'approved', 'paid', 'rejected'
  paid                  Boolean                 @default(false)
  paidAt                DateTime?               @map("paid_at")
  paymentMethod         String?                 @map("payment_method")
  paymentReference      String?                 @map("payment_reference")
  
  // Approval
  approvedBy            String?                 @map("approved_by")
  approvedAt            DateTime?               @map("approved_at")
  
  // Due Date
  dueDate               DateTime?               @map("due_date")
  
  // Notes
  notes                 String?                 @db.Text
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@index([saleId])
  @@index([brokerId])
  @@index([status])
  @@index([paid])
  @@map("commissions")
}

// ============================================
// INSTALLMENTS
// ============================================

model Installment {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Related Sale
  saleId                String                  @map("sale_id")
  sale                  Sale                    @relation(fields: [saleId], references: [id], onDelete: Cascade)
  
  // Installment Details
  installmentNumber     Int                     @map("installment_number")
  amount                Decimal                 @db.Decimal(12, 2)
  
  // Status
  status                String                  @default("pending") // 'pending', 'paid', 'overdue', 'cancelled'
  
  // Dates
  dueDate               DateTime                @map("due_date")
  paidDate              DateTime?               @map("paid_date")
  
  // Payment
  paymentMethod         String?                 @map("payment_method")
  paymentReference      String?                 @map("payment_reference")
  
  // Late Fees
  lateFees              Decimal                 @default(0) @map("late_fees") @db.Decimal(12, 2)
  
  // Notes
  notes                 String?                 @db.Text
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@index([saleId])
  @@index([status])
  @@index([dueDate])
  @@map("installments")
}

// ============================================
// INVOICES
// ============================================

model Invoice {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Related Sale
  saleId                String?                 @map("sale_id")
  sale                  Sale?                   @relation(fields: [saleId], references: [id], onDelete: SetNull)
  
  // Invoice Details
  invoiceNumber         String                  @unique @map("invoice_number")
  invoiceType           String                  @map("invoice_type") // 'sale', 'commission', 'service', 'refund'
  
  // Customer
  customerId            String?                 @map("customer_id")
  customer              Customer?               @relation(fields: [customerId], references: [id], onDelete: SetNull)
  customerName          String                  @map("customer_name")
  customerEmail         String?                 @map("customer_email")
  customerPhone         String?                 @map("customer_phone")
  customerAddress       String?                 @map("customer_address")
  
  // Financial
  subtotal              Decimal                 @db.Decimal(12, 2)
  taxPercentage         Decimal                 @default(15) @map("tax_percentage") @db.Decimal(5, 2)
  taxAmount             Decimal                 @map("tax_amount") @db.Decimal(12, 2)
  discountAmount        Decimal                 @default(0) @map("discount_amount") @db.Decimal(12, 2)
  totalAmount           Decimal                 @map("total_amount") @db.Decimal(12, 2)
  
  // Items
  items                 Json                    @default("[]") // [{description, quantity, price, total}]
  
  // Status
  status                String                  @default("draft") // 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  
  // Dates
  issueDate             DateTime                @map("issue_date")
  dueDate               DateTime                @map("due_date")
  paidDate              DateTime?               @map("paid_date")
  
  // Payment
  paymentStatus         String                  @default("unpaid") @map("payment_status") // 'unpaid', 'partial', 'paid'
  paidAmount            Decimal                 @default(0) @map("paid_amount") @db.Decimal(12, 2)
  
  // File
  pdfUrl                String?                 @map("pdf_url")
  
  // Notes
  notes                 String?                 @db.Text
  termsAndConditions    String?                 @map("terms_and_conditions") @db.Text
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@index([saleId])
  @@index([customerId])
  @@index([status])
  @@index([issueDate])
  @@map("invoices")
}

// ============================================
// EXPENSES
// ============================================

model Expense {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Expense Details
  title                 String
  description           String?                 @db.Text
  category              String                  // 'marketing', 'office', 'travel', 'utilities', 'salaries', 'other'
  
  // Financial
  amount                Decimal                 @db.Decimal(12, 2)
  currency              String                  @default("SAR")
  
  // Tax
  taxDeductible         Boolean                 @default(false) @map("tax_deductible")
  
  // Related Entities
  propertyId            String?                 @map("property_id")
  property              OwnerProperty?          @relation(fields: [propertyId], references: [id], onDelete: SetNull)
  
  // Payment
  paymentMethod         String                  @map("payment_method")
  paymentDate           DateTime                @map("payment_date")
  
  // Receipt
  receiptNumber         String?                 @map("receipt_number")
  receiptUrl            String?                 @map("receipt_url")
  
  // Vendor
  vendorName            String?                 @map("vendor_name")
  vendorContact         String?                 @map("vendor_contact")
  
  // Status
  status                String                  @default("pending") // 'pending', 'approved', 'rejected', 'reimbursed'
  approvedBy            String?                 @map("approved_by")
  approvedAt            DateTime?               @map("approved_at")
  
  // Reimbursement
  reimbursable          Boolean                 @default(false)
  reimbursed            Boolean                 @default(false)
  reimbursedAt          DateTime?               @map("reimbursed_at")
  
  // Notes
  notes                 String?                 @db.Text
  
  // Metadata
  metadata              Json                    @default("{}")
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@index([category])
  @@index([paymentDate])
  @@index([status])
  @@map("expenses")
}

// ============================================
// FINANCIAL STATS
// ============================================

model FinancialStats {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  date                  DateTime                @db.Date
  
  // Sales
  totalSales            Decimal                 @default(0) @map("total_sales") @db.Decimal(12, 2)
  salesCount            Int                     @default(0) @map("sales_count")
  
  // Commissions
  totalCommissions      Decimal                 @default(0) @map("total_commissions") @db.Decimal(12, 2)
  paidCommissions       Decimal                 @default(0) @map("paid_commissions") @db.Decimal(12, 2)
  pendingCommissions    Decimal                 @default(0) @map("pending_commissions") @db.Decimal(12, 2)
  
  // Payments
  totalPayments         Decimal                 @default(0) @map("total_payments") @db.Decimal(12, 2)
  paymentsCount         Int                     @default(0) @map("payments_count")
  
  // Expenses
  totalExpenses         Decimal                 @default(0) @map("total_expenses") @db.Decimal(12, 2)
  expensesCount         Int                     @default(0) @map("expenses_count")
  
  // Net
  netRevenue            Decimal                 @default(0) @map("net_revenue") @db.Decimal(12, 2)
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@unique([userId, date])
  @@index([userId])
  @@index([date])
  @@map("financial_stats")
}

// ============================================
// COMMISSION TIERS (for graduated commission rates)
// ============================================

model CommissionTier {
  id                    String                  @id @default(uuid())
  userId                String                  @map("user_id")
  user                  User                    @relation(fields: [userId], references: [id])
  
  // Tier Details
  name                  String
  description           String?                 @db.Text
  
  // Thresholds
  minAmount             Decimal                 @map("min_amount") @db.Decimal(12, 2)
  maxAmount             Decimal?                @map("max_amount") @db.Decimal(12, 2)
  
  // Commission Rate
  percentage            Decimal                 @db.Decimal(5, 2)
  
  // Property Type
  propertyType          String?                 @map("property_type") // 'apartment', 'villa', 'land', 'commercial'
  saleType              String?                 @map("sale_type") // 'sale', 'rent'
  
  // Status
  isActive              Boolean                 @default(true) @map("is_active")
  isDefault             Boolean                 @default(false) @map("is_default")
  
  // Priority
  priority              Int                     @default(0)
  
  // Timestamps
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  @@index([userId])
  @@map("commission_tiers")
}
```

---

# 2️⃣ **DATA SEEDING**

## **Seed Script**

File: `backend/prisma/seeds/finance.seed.ts`

```typescript
import { PrismaClient, Decimal } from '@prisma/client';
import { addDays, addMonths, subMonths } from 'date-fns';

const prisma = new PrismaClient();

// ============================================
// UTILITY FUNCTIONS
// ============================================

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number): Decimal {
  const value = Math.random() * (max - min) + min;
  return new Decimal(value.toFixed(2));
}

function generateContractNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9999) + 1;
  return `CON-${year}-${num.toString().padStart(4, '0')}`;
}

function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 99999) + 1;
  return `RCP-${year}-${num.toString().padStart(5, '0')}`;
}

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 99999) + 1;
  return `INV-${year}-${num.toString().padStart(5, '0')}`;
}

// ============================================
// SEED MAIN FUNCTION
// ============================================

async function seedFinance() {
  console.log('🌱 Seeding Finance Data...\n');

  // Get demo user
  const user = await prisma.user.findUnique({
    where: { email: 'demo@novacrm.com' },
  });

  if (!user) {
    throw new Error('Demo user not found. Run previous seeds first.');
  }

  // Get sample data
  const [properties, customers, owners, seekers] = await Promise.all([
    prisma.ownerProperty.findMany({ where: { userId: user.id }, take: 30 }),
    prisma.customer.findMany({ where: { userId: user.id }, take: 30 }),
    prisma.propertyOwner.findMany({ where: { userId: user.id }, take: 15 }),
    prisma.propertySeeker.findMany({ where: { userId: user.id }, take: 15 }),
  ]);

  // ============================================
  // 1. CREATE COMMISSION TIERS
  // ============================================
  console.log('📊 Creating commission tiers...');

  const tiers = [
    {
      name: 'شقق - بيع',
      description: 'عمولة بيع الشقق السكنية',
      minAmount: new Decimal(0),
      maxAmount: new Decimal(500000),
      percentage: new Decimal(2.5),
      propertyType: 'apartment',
      saleType: 'sale',
      isDefault: true,
      priority: 1,
    },
    {
      name: 'فلل - بيع',
      description: 'عمولة بيع الفلل',
      minAmount: new Decimal(0),
      maxAmount: new Decimal(2000000),
      percentage: new Decimal(2.0),
      propertyType: 'villa',
      saleType: 'sale',
      priority: 2,
    },
    {
      name: 'أراضي - بيع',
      description: 'عمولة بيع الأراضي',
      minAmount: new Decimal(0),
      maxAmount: null,
      percentage: new Decimal(1.5),
      propertyType: 'land',
      saleType: 'sale',
      priority: 3,
    },
    {
      name: 'تجاري - بيع',
      description: 'عمولة بيع العقارات التجارية',
      minAmount: new Decimal(0),
      maxAmount: null,
      percentage: new Decimal(3.0),
      propertyType: 'commercial',
      saleType: 'sale',
      priority: 4,
    },
    {
      name: 'إيجار شهري',
      description: 'عمولة الإيجار الشهري',
      minAmount: new Decimal(0),
      maxAmount: null,
      percentage: new Decimal(50), // 50% of first month rent
      saleType: 'rent',
      priority: 5,
    },
  ];

  for (const tierData of tiers) {
    await prisma.commissionTier.create({
      data: {
        ...tierData,
        userId: user.id,
      },
    });
  }

  console.log(`✅ Created ${tiers.length} commission tiers`);

  // ============================================
  // 2. CREATE SALES
  // ============================================
  console.log('\n💰 Creating sales...');

  const saleStatuses = ['draft', 'pending', 'approved', 'completed', 'cancelled'];
  const paymentStatuses = ['unpaid', 'partial', 'paid'];
  const saleTypes = ['sale', 'rent'];

  const sales = [];

  // Create 100 sales (mix of completed, pending, etc.)
  for (let i = 0; i < 100; i++) {
    const property = properties.length > 0 ? randomElement(properties) : null;
    const customer = customers.length > 0 ? randomElement(customers) : null;
    const owner = owners.length > 0 ? randomElement(owners) : null;
    const seeker = seekers.length > 0 && Math.random() > 0.5 ? randomElement(seekers) : null;

    const saleType = randomElement(saleTypes);
    const propertyPrice = randomDecimal(200000, 2000000);
    const saleAmount = new Decimal(propertyPrice.toNumber() * randomDecimal(0.95, 1.0).toNumber());
    
    // Commission calculation
    let commissionPercentage: Decimal;
    if (saleType === 'sale') {
      commissionPercentage = randomElement([
        new Decimal(1.5),
        new Decimal(2.0),
        new Decimal(2.5),
        new Decimal(3.0),
      ]);
    } else {
      commissionPercentage = new Decimal(50); // 50% of first month for rent
    }

    const commissionAmount = new Decimal(
      (saleAmount.toNumber() * commissionPercentage.toNumber()) / 100
    );

    const downPayment = saleType === 'sale' 
      ? new Decimal(saleAmount.toNumber() * randomDecimal(0.1, 0.3).toNumber())
      : new Decimal(0);

    const remainingAmount = new Decimal(saleAmount.toNumber() - downPayment.toNumber());

    // Determine status (more completed sales for past)
    let status: string;
    let paymentStatus: string;
    let isPast: boolean;

    if (i < 40) {
      // 40% completed sales
      status = 'completed';
      paymentStatus = randomElement(['paid', 'paid', 'partial']);
      isPast = true;
    } else if (i < 70) {
      // 30% approved/pending
      status = randomElement(['approved', 'pending']);
      paymentStatus = randomElement(['unpaid', 'partial']);
      isPast = false;
    } else if (i < 85) {
      // 15% draft
      status = 'draft';
      paymentStatus = 'unpaid';
      isPast = false;
    } else {
      // 15% cancelled
      status = 'cancelled';
      paymentStatus = 'unpaid';
      isPast = true;
    }

    const contractDate = isPast
      ? subMonths(new Date(), randomNumber(1, 12))
      : addDays(new Date(), randomNumber(-7, 30));

    const saleData: any = {
      userId: user.id,
      propertyId: property?.id,
      customerId: customer?.id,
      ownerId: owner?.id,
      seekerId: seeker?.id,
      saleType,
      contractNumber: status !== 'draft' ? generateContractNumber() : null,
      propertyPrice,
      saleAmount,
      downPayment,
      remainingAmount,
      commissionPercentage,
      commissionAmount,
      commissionPaid: status === 'completed' && Math.random() > 0.3,
      status,
      paymentStatus,
      contractDate: status !== 'draft' ? contractDate : null,
    };

    if (status === 'approved') {
      saleData.approvedAt = addDays(contractDate, randomNumber(1, 3));
    }

    if (status === 'completed') {
      saleData.completedAt = addDays(contractDate, randomNumber(7, 30));
      if (saleData.commissionPaid) {
        saleData.commissionPaidAt = addDays(saleData.completedAt, randomNumber(1, 14));
      }
    }

    if (status === 'cancelled') {
      saleData.cancelledAt = addDays(contractDate, randomNumber(1, 10));
      saleData.cancellationReason = randomElement([
        'العميل غير راضي عن العقار',
        'مشاكل في التمويل',
        'تم العثور على عقار أفضل',
        'ظروف شخصية',
      ]);
    }

    const sale = await prisma.sale.create({ data: saleData });
    sales.push(sale);
  }

  console.log(`✅ Created ${sales.length} sales`);

  // ============================================
  // 3. CREATE PAYMENTS
  // ============================================
  console.log('\n💳 Creating payments...');

  const paymentMethods = ['cash', 'card', 'bank_transfer', 'cheque', 'online'];
  let paymentsCount = 0;

  for (const sale of sales) {
    if (sale.paymentStatus === 'unpaid') continue;

    // Number of payments based on status
    let numPayments = 0;
    if (sale.paymentStatus === 'paid') {
      numPayments = randomNumber(1, 3);
    } else if (sale.paymentStatus === 'partial') {
      numPayments = randomNumber(1, 2);
    }

    const totalPaidAmount = sale.paymentStatus === 'paid'
      ? sale.saleAmount
      : new Decimal(sale.saleAmount.toNumber() * randomDecimal(0.3, 0.7).toNumber());

    for (let i = 0; i < numPayments; i++) {
      const amount = i === numPayments - 1
        ? new Decimal(totalPaidAmount.toNumber() / numPayments)
        : new Decimal(totalPaidAmount.toNumber() / numPayments);

      const paymentMethod = randomElement(paymentMethods);
      const paymentDate = sale.contractDate
        ? addDays(sale.contractDate, i * randomNumber(7, 30))
        : new Date();

      await prisma.payment.create({
        data: {
          userId: user.id,
          saleId: sale.id,
          paymentType: 'sale_payment',
          amount,
          paymentMethod,
          paymentDate,
          status: 'completed',
          clearedDate: addDays(paymentDate, randomNumber(1, 3)),
          receiptNumber: generateReceiptNumber(),
          recipientType: 'company',
          recipientName: 'شركة نوفا العقارية',
        },
      });

      paymentsCount++;
    }
  }

  console.log(`✅ Created ${paymentsCount} payments`);

  // ============================================
  // 4. CREATE COMMISSIONS
  // ============================================
  console.log('\n💵 Creating commissions...');

  let commissionsCount = 0;

  for (const sale of sales) {
    if (sale.status === 'draft' || sale.status === 'cancelled') continue;

    const baseAmount = sale.saleAmount;
    const percentage = sale.commissionPercentage;
    const commissionAmount = sale.commissionAmount;

    // Tax (15% VAT in Saudi Arabia)
    const taxPercentage = new Decimal(15);
    const netAmount = commissionAmount;
    const taxAmount = new Decimal((netAmount.toNumber() * taxPercentage.toNumber()) / 100);
    const totalAmount = new Decimal(netAmount.toNumber() + taxAmount.toNumber());

    const isPaid = sale.commissionPaid;
    const status = isPaid ? 'paid' : sale.status === 'completed' ? 'approved' : 'pending';

    await prisma.commission.create({
      data: {
        userId: user.id,
        saleId: sale.id,
        brokerId: user.id,
        brokerRole: 'primary',
        commissionType: sale.saleType,
        percentage,
        baseAmount,
        commissionAmount,
        deductions: new Decimal(0),
        netAmount,
        taxPercentage,
        taxAmount,
        totalAmount,
        status,
        paid: isPaid,
        paidAt: isPaid ? sale.commissionPaidAt : null,
        approvedBy: status !== 'pending' ? user.id : null,
        approvedAt: status !== 'pending' ? sale.approvedAt : null,
        dueDate: sale.completedAt ? addDays(sale.completedAt, 30) : null,
      },
    });

    commissionsCount++;
  }

  console.log(`✅ Created ${commissionsCount} commissions`);

  // ============================================
  // 5. CREATE INVOICES
  // ============================================
  console.log('\n📄 Creating invoices...');

  let invoicesCount = 0;

  for (const sale of sales.slice(0, 50)) {
    if (!sale.customerId || sale.status === 'draft') continue;

    const customer = await prisma.customer.findUnique({
      where: { id: sale.customerId },
    });

    if (!customer) continue;

    const subtotal = sale.saleAmount;
    const taxPercentage = new Decimal(15);
    const taxAmount = new Decimal((subtotal.toNumber() * taxPercentage.toNumber()) / 100);
    const totalAmount = new Decimal(subtotal.toNumber() + taxAmount.toNumber());

    const items = [
      {
        description: `عقار: ${sale.property?.title || 'عقار'}`,
        quantity: 1,
        price: subtotal.toNumber(),
        total: subtotal.toNumber(),
      },
    ];

    const issueDate = sale.contractDate || new Date();
    const dueDate = addDays(issueDate, 30);

    await prisma.invoice.create({
      data: {
        userId: user.id,
        saleId: sale.id,
        customerId: sale.customerId,
        invoiceNumber: generateInvoiceNumber(),
        invoiceType: 'sale',
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        subtotal,
        taxPercentage,
        taxAmount,
        totalAmount,
        items: JSON.stringify(items),
        status: sale.status === 'completed' ? 'paid' : 'sent',
        issueDate,
        dueDate,
        paymentStatus: sale.paymentStatus,
        paidAmount: sale.paymentStatus === 'paid' ? totalAmount : new Decimal(0),
        paidDate: sale.completedAt,
      },
    });

    invoicesCount++;
  }

  console.log(`✅ Created ${invoicesCount} invoices`);

  // ============================================
  // 6. CREATE EXPENSES
  // ============================================
  console.log('\n💸 Creating expenses...');

  const expenseCategories = [
    'marketing',
    'office',
    'travel',
    'utilities',
    'salaries',
    'other',
  ];

  const expenses = [];

  for (let i = 0; i < 80; i++) {
    const category = randomElement(expenseCategories);
    const amount = randomDecimal(500, 10000);
    const paymentDate = subMonths(new Date(), randomNumber(0, 6));

    const expenseData = {
      userId: user.id,
      title: `مصروف ${category}`,
      category,
      amount,
      paymentMethod: randomElement(paymentMethods),
      paymentDate,
      status: randomElement(['approved', 'approved', 'approved', 'pending']),
      taxDeductible: Math.random() > 0.5,
      receiptNumber: Math.random() > 0.3 ? generateReceiptNumber() : null,
    };

    const expense = await prisma.expense.create({ data: expenseData });
    expenses.push(expense);
  }

  console.log(`✅ Created ${expenses.length} expenses`);

  // ============================================
  // 7. CREATE FINANCIAL STATS
  // ============================================
  console.log('\n📊 Creating financial stats...');

  // Create stats for last 6 months
  for (let i = 0; i < 180; i++) {
    const date = subMonths(new Date(), Math.floor(i / 30));
    date.setDate(date.getDate() - (i % 30));
    date.setHours(0, 0, 0, 0);

    const daySales = sales.filter(
      (s) =>
        s.contractDate &&
        s.contractDate.toDateString() === date.toDateString() &&
        s.status !== 'cancelled'
    );

    const totalSales = daySales.reduce(
      (sum, s) => sum + s.saleAmount.toNumber(),
      0
    );

    const dayCommissions = commissionsCount > 0 ? randomDecimal(0, 5000) : new Decimal(0);
    const dayPayments = paymentsCount > 0 ? randomDecimal(0, totalSales) : new Decimal(0);
    const dayExpenses = randomDecimal(0, 2000);

    await prisma.financialStats.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date,
        },
      },
      update: {},
      create: {
        userId: user.id,
        date,
        totalSales: new Decimal(totalSales),
        salesCount: daySales.length,
        totalCommissions: dayCommissions,
        paidCommissions: new Decimal(dayCommissions.toNumber() * 0.7),
        pendingCommissions: new Decimal(dayCommissions.toNumber() * 0.3),
        totalPayments: dayPayments,
        paymentsCount: daySales.length > 0 ? randomNumber(0, 3) : 0,
        totalExpenses: dayExpenses,
        expensesCount: randomNumber(0, 3),
        netRevenue: new Decimal(
          dayCommissions.toNumber() - dayExpenses.toNumber()
        ),
      },
    });
  }

  console.log('✅ Created 180 days of financial stats');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('✨ Finance Seeding Complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Commission Tiers:  ${tiers.length}`);
  console.log(`   - Sales:             ${sales.length}`);
  console.log(`   - Payments:          ${paymentsCount}`);
  console.log(`   - Commissions:       ${commissionsCount}`);
  console.log(`   - Invoices:          ${invoicesCount}`);
  console.log(`   - Expenses:          ${expenses.length}`);
  console.log(`   - Financial Stats:   180 days`);
  console.log('='.repeat(60) + '\n');
}

// ============================================
// EXPORT & RUN
// ============================================

export { seedFinance };

// If running directly
if (require.main === module) {
  seedFinance()
    .catch((e) => {
      console.error('❌ Seeding failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
```

---

**(يتبع في الجزء التالي...)**

📄 **File:** `/FEATURE-2-FINANCE-INTEGRATION.md`  
🎯 **Status:** Part 1 Complete (DB + Seeding)  
⏱️ **Next:** Backend APIs + Commission Service + Payment Processing
