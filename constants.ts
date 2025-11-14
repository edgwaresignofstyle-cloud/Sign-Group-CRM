import { Job, ProductionStage, CostItem, FixedCostItem, ItemCategory, User, UserRole, Permissions } from './types';

export const STAGE_OPTIONS: ProductionStage[] = [
  ProductionStage.QUOTATION_SENT,
  ProductionStage.QUOTATION_APPROVED,
  ProductionStage.INVOICE_SENT,
  ProductionStage.CLIENT_PAID_DEPOSIT,
  ProductionStage.DESIGN,
  ProductionStage.FABRICATION,
  ProductionStage.PRINTING,
  ProductionStage.CLIENT_PAID_FULL,
  ProductionStage.INSTALLATION_SCHEDULED,
  ProductionStage.COMPLETED,
  ProductionStage.ON_HOLD,
];

export const PROGRESS_STAGES: ProductionStage[] = [
  ProductionStage.QUOTATION_SENT,
  ProductionStage.QUOTATION_APPROVED,
  ProductionStage.INVOICE_SENT,
  ProductionStage.CLIENT_PAID_DEPOSIT,
  ProductionStage.DESIGN,
  ProductionStage.FABRICATION,
  ProductionStage.PRINTING,
  ProductionStage.CLIENT_PAID_FULL,
  ProductionStage.INSTALLATION_SCHEDULED,
  ProductionStage.COMPLETED,
];

export const STAGE_COLORS: Record<ProductionStage, string> = {
  [ProductionStage.QUOTATION_SENT]: 'bg-blue-100 text-blue-800',
  [ProductionStage.QUOTATION_APPROVED]: 'bg-sky-100 text-sky-800',
  [ProductionStage.INVOICE_SENT]: 'bg-slate-100 text-slate-800',
  [ProductionStage.CLIENT_PAID_DEPOSIT]: 'bg-teal-100 text-teal-800',
  [ProductionStage.DESIGN]: 'bg-purple-100 text-purple-800',
  [ProductionStage.FABRICATION]: 'bg-yellow-100 text-yellow-800',
  [ProductionStage.PRINTING]: 'bg-indigo-100 text-indigo-800',
  [ProductionStage.CLIENT_PAID_FULL]: 'bg-emerald-100 text-emerald-800',
  [ProductionStage.INSTALLATION_SCHEDULED]: 'bg-cyan-100 text-cyan-800',
  [ProductionStage.COMPLETED]: 'bg-green-100 text-green-800',
  [ProductionStage.ON_HOLD]: 'bg-red-100 text-red-800',
};

export const INITIAL_ITEM_CATEGORIES: ItemCategory[] = [
    { 
        id: 'cat-1', 
        name: 'Materials', 
        icon: 'CubeIcon', 
        color: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' } 
    },
    { 
        id: 'cat-2', 
        name: 'Hardware & Electronics', 
        icon: 'WrenchScrewdriverIcon', 
        color: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' } 
    },
    { 
        id: 'cat-3', 
        name: 'Labor & Services', 
        icon: 'UsersIcon', 
        color: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' } 
    },
    { 
        id: 'cat-4', 
        name: 'Consumables', 
        icon: 'SparklesIcon', 
        color: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' } 
    },
];

export const AVAILABLE_CATEGORY_COLORS = [
    { name: 'Blue', value: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' } },
    { name: 'Yellow', value: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' } },
    { name: 'Green', value: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' } },
    { name: 'Purple', value: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' } },
    { name: 'Pink', value: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' } },
    { name: 'Indigo', value: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' } },
    { name: 'Red', value: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' } },
    { name: 'Gray', value: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' } },
];

export const AVAILABLE_ICONS = ['CubeIcon', 'WrenchScrewdriverIcon', 'UsersIcon', 'SparklesIcon', 'BriefcaseIcon', 'CalculatorIcon', 'BuildingOfficeIcon', 'KeyIcon', 'HistoryIcon'];

export const INITIAL_COST_ITEMS: CostItem[] = [
    { id: 'ci-1', name: 'Channel Letters (LED)', unit: 'item', costPerUnit: 350, categoryId: 'cat-2' },
    { id: 'ci-2', name: 'Aluminum Composite Panel', unit: 'sqm', costPerUnit: 80, categoryId: 'cat-1' },
    { id: 'ci-3', name: 'Vinyl Printing (Full Color)', unit: 'sqm', costPerUnit: 45, categoryId: 'cat-1' },
    { id: 'ci-4', name: 'Acrylic Sheet (3mm)', unit: 'sqm', costPerUnit: 60, categoryId: 'cat-1' },
    { id: 'ci-5', name: 'LED Modules', unit: 'item', costPerUnit: 5, categoryId: 'cat-2' },
    { id: 'ci-6', name: 'Labor / Installation', unit: 'hour', costPerUnit: 75, categoryId: 'cat-3' },
    { id: 'ci-7', name: 'Vehicle Wrap Vinyl', unit: 'sqm', costPerUnit: 55, categoryId: 'cat-1' },
];

export const INITIAL_FIXED_COSTS: FixedCostItem[] = [
    { id: 'fc-1', name: 'Workshop Rent', monthlyAmount: 3500 },
    { id: 'fc-2', name: 'Utilities (Elec, Water, Web)', monthlyAmount: 800 },
    { id: 'fc-3', name: 'Software Subscriptions', monthlyAmount: 250 },
    { id: 'fc-4', name: 'Insurance', monthlyAmount: 300 },
    { id: 'fc-5', name: 'Admin Salaries', monthlyAmount: 4000 },
];

export const INITIAL_FIXED_COST_CONTRIBUTION_PERCENTAGE = 15;

const READ_ONLY_PERMISSIONS: Permissions = {
    jobs: { view: true, create: false, edit: false, delete: false },
    financials: { view: false, create: false, edit: false, delete: false },
    items: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
};

export const ROLE_PERMISSIONS: Record<UserRole, Permissions> = {
    [UserRole.ADMIN]: {
        jobs: { view: true, create: true, edit: true, delete: true },
        financials: { view: true, create: true, edit: true, delete: true },
        items: { view: true, create: true, edit: true, delete: true },
        users: { view: true, create: true, edit: true, delete: true },
    },
    [UserRole.SALES]: {
        jobs: { view: true, create: true, edit: true, delete: false },
        financials: { view: false, create: false, edit: false, delete: false },
        items: { view: true, create: false, edit: false, delete: false },
        users: { view: false, create: false, edit: false, delete: false },
    },
    [UserRole.DESIGNER]: READ_ONLY_PERMISSIONS,
    [UserRole.PRODUCTION]: READ_ONLY_PERMISSIONS,
    [UserRole.INSTALLATION]: READ_ONLY_PERMISSIONS,
};

export const USERS: User[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@signgroup.com', password: 'password123', role: UserRole.ADMIN, permissions: ROLE_PERMISSIONS[UserRole.ADMIN] },
    { id: 'user-2', name: 'Sales Person', email: 'sales@signgroup.com', password: 'password123', role: UserRole.SALES, permissions: ROLE_PERMISSIONS[UserRole.SALES] },
    { id: 'user-3', name: 'Designer Person', email: 'designer@signgroup.com', password: 'password123', role: UserRole.DESIGNER, permissions: ROLE_PERMISSIONS[UserRole.DESIGNER] },
    { id: 'user-4', name: 'Production Person', email: 'production@signgroup.com', password: 'password123', role: UserRole.PRODUCTION, permissions: ROLE_PERMISSIONS[UserRole.PRODUCTION] },
    { id: 'user-5', name: 'Installer Person', email: 'installer@signgroup.com', password: 'password123', role: UserRole.INSTALLATION, permissions: ROLE_PERMISSIONS[UserRole.INSTALLATION] },
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    clientName: 'Coffee Corner',
    clientEmail: 'info@coffeecorner.com',
    clientPhone: '020 7946 0958',
    installationAddress: '123 High Street, London, E1 7AD',
    jobDescription: 'Main storefront channel letter sign with LED lighting.',
    notes: 'Client wants the sign to be extra bright. Check power supply requirements and use premium LEDs.',
    quotationDetails: {
      lineItems: [
        { itemId: 'ci-1', quantity: 12 }, // 12 letters
        { itemId: 'ci-5', quantity: 50 },
        { itemId: 'ci-6', quantity: 8 },
      ],
      fixedCosts: 150, // Design fee
      profitMarkupPercentage: 20,
      fixedCostContributionPercentage: 15,
    },
    invoiceDetails: { amount: 4500, date: '2023-10-10', userId: 'user-2' },
    payments: [
        { amount: 4500, date: '2023-10-12', userId: 'user-1' }
    ],
    stage: ProductionStage.COMPLETED,
    installationDate: '2023-10-15',
    mockupImage: 'https://picsum.photos/seed/job1/400/300',
    salespersonId: 'user-2',
    changelog: [],
  },
  {
    id: 'job-2',
    clientName: 'Urban Boutique',
    clientEmail: 'sarah@urbanboutique.com',
    clientPhone: '0161 496 0123',
    installationAddress: '24 Market Street, Manchester, M1 1FN',
    jobDescription: 'Window vinyl graphics and an A-frame sidewalk sign.',
    notes: 'Client is providing their own artwork. Ensure files are print-ready (CMYK, 300dpi).',
     quotationDetails: {
      lineItems: [
        { itemId: 'ci-3', quantity: 8 }, // 8 sqm vinyl
        { itemId: 'ci-6', quantity: 4 },
      ],
      fixedCosts: 100,
      profitMarkupPercentage: 25,
      fixedCostContributionPercentage: 15,
    },
    invoiceDetails: { amount: 1200, date: '2023-11-20', userId: 'user-2' },
    payments: [
        { amount: 600, date: '2023-11-21', userId: 'user-2' },
    ],
    stage: ProductionStage.FABRICATION,
    installationDate: '2023-11-28',
    mockupImage: 'https://picsum.photos/seed/job2/400/300',
    salespersonId: 'user-2',
    changelog: [],
  },
  {
    id: 'job-3',
    clientName: 'Tech Solutions Inc.',
    clientEmail: 'contact@techsolutions.io',
    clientPhone: '0121 496 0654',
    installationAddress: '55 Corporation Street, Birmingham, B2 4LS',
    jobDescription: 'Lobby logo sign - brushed aluminum finish.',
    notes: '',
    quotationDetails: {
      lineItems: [
        { itemId: 'ci-2', quantity: 3 },
        { itemId: 'ci-4', quantity: 2 },
        { itemId: 'ci-6', quantity: 6 },
      ],
      fixedCosts: 250,
      profitMarkupPercentage: 20,
      fixedCostContributionPercentage: 15,
    },
    invoiceDetails: { amount: 0, date: '', userId: null },
    payments: [
        { amount: 1400, date: '2023-11-01', userId: 'user-1' },
    ],
    stage: ProductionStage.QUOTATION_SENT,
    installationDate: '2023-12-10',
    mockupImage: 'https://picsum.photos/seed/job3/400/300',
    salespersonId: 'user-1', // Admin created
    changelog: [],
  },
  {
    id: 'job-4',
    clientName: 'Green Grocers',
    clientEmail: 'manager@greengrocers.com',
    clientPhone: '0113 496 0789',
    installationAddress: 'The Delivery Van',
    jobDescription: 'Full vehicle wrap for delivery van.',
    notes: 'Van needs to be dropped off clean and free of wax. Schedule for a full day.',
    quotationDetails: {
      lineItems: [
        { itemId: 'ci-7', quantity: 25 }, // 25 sqm wrap
        { itemId: 'ci-6', quantity: 16 },
      ],
      fixedCosts: 200,
      profitMarkupPercentage: 30,
      fixedCostContributionPercentage: 15,
    },
    invoiceDetails: { amount: 3500, date: '2023-11-15', userId: 'user-2' },
    payments: [
        { amount: 1750, date: '2023-11-16', userId: 'user-2' },
        { amount: 1750, date: '2023-11-22', userId: 'user-1' },
    ],
    stage: ProductionStage.INSTALLATION_SCHEDULED,
    installationDate: '2023-11-22',
    mockupImage: 'https://picsum.photos/seed/job4/400/300',
    salespersonId: 'user-2',
    changelog: [],
  },
  {
    id: 'job-5',
    clientName: 'The Book Nook',
    clientEmail: 'owner@thebooknook.com',
    clientPhone: '0141 496 0321',
    installationAddress: '88 Buchanan Street, Glasgow, G1 3HA',
    jobDescription: 'New hanging blade sign for storefront.',
    notes: 'Design phase. Awaiting client concept approval.',
    quotationDetails: {
      lineItems: [],
      fixedCosts: 0,
      profitMarkupPercentage: 25,
      fixedCostContributionPercentage: 15,
    },
    invoiceDetails: { amount: 0, date: '', userId: null },
    payments: [],
    stage: ProductionStage.DESIGN,
    installationDate: '2024-01-05',
    mockupImage: null,
    salespersonId: 'user-1',
    changelog: [],
  },
];
