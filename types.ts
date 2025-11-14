export enum ProductionStage {
  DESIGN = 'Design',
  QUOTATION_SENT = 'Quotation Sent',
  FABRICATION = 'Fabrication',
  PRINTING = 'Printing',
  INSTALLATION_SCHEDULED = 'Installation Scheduled',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
  QUOTATION_APPROVED = 'Quotation Approved',
  INVOICE_SENT = 'Invoice Sent',
  CLIENT_PAID_DEPOSIT = 'Client Paid Deposit',
  CLIENT_PAID_FULL = 'Client Paid Full',
}

export enum UserRole {
  ADMIN = 'Admin',
  SALES = 'Sales',
  DESIGNER = 'Designer',
  PRODUCTION = 'Production',
  INSTALLATION = 'Installation',
}

export interface PermissionSet {
  view: boolean;
  edit: boolean;
  create: boolean;
  delete: boolean;
}

export interface Permissions {
  jobs: PermissionSet;
  financials: PermissionSet;
  items: PermissionSet;
  users: PermissionSet;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should be hashed in a real app
  role: UserRole;
  permissions: Permissions;
}


export interface FixedCostItem {
  id: string;
  name: string;
  monthlyAmount: number;
}

export interface ItemCategory {
    id: string;
    name: string;
    icon: string; // Changed from React.FC to a string identifier
    color: {
        bg: string;
        text: string;
        border: string;
    };
}

export interface CostItem {
  id: string;
  name: string;
  unit: 'item' | 'sqm' | 'meter' | 'hour' | 'day';
  costPerUnit: number;
  categoryId: string;
}

export interface QuotationLineItem {
  itemId: string;
  quantity: number;
}

export interface QuotationDetails {
  lineItems: QuotationLineItem[];
  fixedCosts: number; // Job-specific fixed costs
  profitMarkupPercentage: number;
  fixedCostContributionPercentage: number;
}

export interface ChangelogEntry {
  userId: string;
  timestamp: string; // ISO String
  fromStage: ProductionStage;
  toStage: ProductionStage;
}

export interface InvoiceDetails {
  amount: number;
  date: string; // YYYY-MM-DD
  userId: string | null;
}

export interface PaymentRecord {
  amount: number;
  date: string; // YYYY-MM-DD
  userId: string | null;
}

export interface Job {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  installationAddress: string;
  jobDescription: string;
  notes?: string;
  quotationDetails: QuotationDetails;
  invoiceDetails: InvoiceDetails;
  payments: PaymentRecord[];
  stage: ProductionStage;
  installationDate: string; // YYYY-MM-DD
  mockupImage: string | null; // Base64 string or URL
  salespersonId: string; // Link to the user who created the job
  changelog?: ChangelogEntry[];
}

export type AppView = 'jobs' | 'financials' | 'items' | 'users';

export interface ChartDataPoint {
  label: string;
  value: number;
}
