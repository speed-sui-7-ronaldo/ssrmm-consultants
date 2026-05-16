/**
 * India Payroll Calculation Engine — FY 2026-27
 * Ported from payroll_india.py (hermes skill)
 * All monetary values are plain JS numbers (representing INR)
 */

// ─── STATUTORY RATES ─────────────────────────────────────────────────────────

export const PF_EMPLOYEE_RATE = 0.12;
export const PF_EMPLOYER_PF_RATE = 0.0367;
export const PF_EPS_RATE = 0.0833;
export const PF_ADMIN_RATE = 0.005;
export const EDLI_RATE = 0.005;
export const PF_WAGE_CEILING = 15000;

export const ESI_EMPLOYEE_RATE = 0.0075;
export const ESI_EMPLOYER_RATE = 0.0325;
export const ESI_WAGE_CEILING = 21000;

// ─── PROFESSIONAL TAX SLABS (monthly gross) ───────────────────────────────────

export const PT_SLABS = {
  ANDHRA_PRADESH: [
    { low: 15000, high: 20000, amount: 150 },
    { low: 20000, high: null,  amount: 200 },
  ],
  KARNATAKA: [
    { low: 15000, high: null, amount: 200 },
  ],
  MAHARASHTRA: [
    { low: 7500,  high: 10000, amount: 175 },
    { low: 10000, high: null,  amount: 200 },
  ],
  TAMIL_NADU: [
    { low: 3500,  high: 5000,  amount: 22.5  },
    { low: 5000,  high: 7500,  amount: 52.5  },
    { low: 7500,  high: 10000, amount: 115   },
    { low: 10000, high: 12500, amount: 171   },
    { low: 12500, high: null,  amount: 208   },
  ],
  TELANGANA: [
    { low: 15000, high: 20000, amount: 150 },
    { low: 20000, high: null,  amount: 200 },
  ],
  DELHI: [
    { low: 15000, high: null, amount: 200 },
  ],
  WEST_BENGAL: [
    { low: 10000, high: 15000, amount: 110 },
    { low: 15000, high: 25000, amount: 130 },
    { low: 25000, high: 40000, amount: 150 },
    { low: 40000, high: null,  amount: 200 },
  ],
  GUJARAT: [
    { low: 12000, high: null, amount: 200 },
  ],
  MADHYA_PRADESH: [
    { low: 18750, high: null, amount: 208 },
  ],
  KERALA: [
    { low: 2000, high: null, amount: 200 },
  ],
  ODISHA: [
    { low: 15000, high: 20000, amount: 125 },
    { low: 20000, high: 25000, amount: 150 },
    { low: 25000, high: null,  amount: 200 },
  ],
};

// ─── LABOUR WELFARE FUND ─────────────────────────────────────────────────────
// Values in INR per period; isPercent = true means % of wages

export const LWF_RATES = {
  MAHARASHTRA:  { employee: 25,  employer: 45,  isPercent: false, frequency: 'HALF_YEARLY' },
  KARNATAKA:    { employee: 20,  employer: 40,  isPercent: false, frequency: 'ANNUAL'      },
  ANDHRA_PRADESH: { employee: 30, employer: 70, isPercent: false, frequency: 'ANNUAL'      },
  TELANGANA:    { employee: 30,  employer: 70,  isPercent: false, frequency: 'ANNUAL'      },
  DELHI:        { employee: 0.2, employer: 0.2, isPercent: true,  frequency: 'MONTHLY'     },
  GUJARAT:      { employee: 6,   employer: 12,  isPercent: false, frequency: 'HALF_YEARLY' },
  WEST_BENGAL:  { employee: 3,   employer: 15,  isPercent: false, frequency: 'ANNUAL'      },
  TAMIL_NADU:   { employee: 10,  employer: 20,  isPercent: false, frequency: 'ANNUAL'      },
  KERALA:       { employee: 4,   employer: 8,   isPercent: false, frequency: 'ANNUAL'      },
  ODISHA:       { employee: 2,   employer: 4,   isPercent: false, frequency: 'ANNUAL'      },
};

// ─── INCOME TAX SLABS (FY 2026-27) ───────────────────────────────────────────

export const NEW_REGIME_SLABS = [
  { low: 0,       high: 400000,  rate: 0    },
  { low: 400000,  high: 800000,  rate: 0.05 },
  { low: 800000,  high: 1200000, rate: 0.10 },
  { low: 1200000, high: 1600000, rate: 0.15 },
  { low: 1600000, high: 2000000, rate: 0.20 },
  { low: 2000000, high: 2400000, rate: 0.25 },
  { low: 2400000, high: null,    rate: 0.30 },
];

export const OLD_REGIME_SLABS = [
  { low: 0,       high: 250000,  rate: 0    },
  { low: 250000,  high: 500000,  rate: 0.05 },
  { low: 500000,  high: 1000000, rate: 0.20 },
  { low: 1000000, high: null,    rate: 0.30 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Round to 2 decimal places (half-up) */
export const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Days in a given month */
export function daysInMonth(year, month /* 1-12 */) {
  return new Date(year, month, 0).getDate();
}

/** Normalize state key */
export const normalizeState = (s) => s.toUpperCase().replace(/ /g, '_');

// ─── PROVIDENT FUND ──────────────────────────────────────────────────────────

/**
 * @param {number} basic - Monthly basic salary
 * @returns {{ pfEmployee, pfEmployerPF, epsEmployer, pfEmployerTotal, pfAdmin, edli }}
 */
export function calculatePF(basic) {
  const pfWages = Math.min(basic, PF_WAGE_CEILING);

  const pfEmployee     = round2(pfWages * PF_EMPLOYEE_RATE);
  const pfEmployerPF   = round2(pfWages * PF_EMPLOYER_PF_RATE);
  const epsEmployer    = round2(pfWages * PF_EPS_RATE);
  const pfEmployerTotal = round2(pfEmployerPF + epsEmployer);
  const pfAdmin        = round2(pfWages * PF_ADMIN_RATE);
  const edli           = round2(pfWages * EDLI_RATE);

  return { pfEmployee, pfEmployerPF, epsEmployer, pfEmployerTotal, pfAdmin, edli };
}

// ─── ESI ─────────────────────────────────────────────────────────────────────

/**
 * @param {number} gross - Monthly gross salary
 * @returns {{ esiEmployee, esiEmployer, applicable: boolean }}
 */
export function calculateESI(gross) {
  if (gross <= ESI_WAGE_CEILING) {
    return {
      esiEmployee: round2(gross * ESI_EMPLOYEE_RATE),
      esiEmployer: round2(gross * ESI_EMPLOYER_RATE),
      applicable: true,
    };
  }
  return { esiEmployee: 0, esiEmployer: 0, applicable: false };
}

// ─── PROFESSIONAL TAX ────────────────────────────────────────────────────────

/**
 * @param {number} gross - Monthly gross salary
 * @param {string} state - State name (will be normalized)
 * @returns {number} PT amount
 */
export function calculateProfessionalTax(gross, state) {
  const key = normalizeState(state);
  const slabs = PT_SLABS[key];
  if (!slabs) return 0;

  for (const { low, high, amount } of slabs) {
    if (high === null) {
      if (gross >= low) return amount;
    } else {
      if (gross >= low && gross < high) return amount;
    }
  }
  return 0;
}

// ─── LABOUR WELFARE FUND ─────────────────────────────────────────────────────

/**
 * @param {number} gross
 * @param {string} state
 * @returns {{ employee, employer, frequency }}
 */
export function calculateLWF(gross, state) {
  const key = normalizeState(state);
  const rates = LWF_RATES[key];
  if (!rates) return { employee: 0, employer: 0, frequency: 'N/A' };

  if (rates.isPercent) {
    return {
      employee:  round2(gross * rates.employee / 100),
      employer:  round2(gross * rates.employer / 100),
      frequency: rates.frequency,
    };
  }

  // For non-monthly, prorate to monthly for deduction purposes
  let divisor = 1;
  if (rates.frequency === 'HALF_YEARLY') divisor = 6;
  if (rates.frequency === 'ANNUAL')      divisor = 12;

  return {
    employee:  round2(rates.employee / divisor),
    employer:  round2(rates.employer / divisor),
    frequency: rates.frequency,
  };
}

// ─── NPS ─────────────────────────────────────────────────────────────────────

/**
 * @param {number} basic
 * @param {number} empRatePct - Employee contribution %
 * @param {number} emprRatePct - Employer contribution %
 * @returns {{ npsEmployee, npsEmployer }}
 */
export function calculateNPS(basic, empRatePct, emprRatePct) {
  return {
    npsEmployee: empRatePct  ? round2(basic * empRatePct  / 100) : 0,
    npsEmployer: emprRatePct ? round2(basic * emprRatePct / 100) : 0,
  };
}

// ─── GRATUITY PROVISION ──────────────────────────────────────────────────────

/**
 * @param {number} basicMonthly
 * @param {string|Date} dateOfJoining
 * @param {boolean} eligible
 * @returns {number} Monthly gratuity provision
 */
export function calculateGratuityProvision(basicMonthly, dateOfJoining, eligible) {
  if (!eligible) return 0;
  const doj = new Date(dateOfJoining);
  const years = (Date.now() - doj.getTime()) / (365.25 * 24 * 3600 * 1000);
  if (years < 5) return 0;

  const annualBasic = basicMonthly * 12;
  const gratuityAnnual = (annualBasic * 15 / 26) * years;
  return round2(gratuityAnnual / 12);
}

// ─── HRA EXEMPTION ───────────────────────────────────────────────────────────

/**
 * Section 10(13A) — Least of 3 conditions
 * @param {number} basicAnnual
 * @param {number} hraAnnual
 * @param {number} rentAnnual
 * @param {'METRO'|'NON_METRO'} cityType
 * @returns {number} HRA exemption
 */
export function calculateHRAExemption(basicAnnual, hraAnnual, rentAnnual, cityType) {
  const c1 = hraAnnual;
  const c2 = Math.max(rentAnnual - basicAnnual * 0.10, 0);
  const c3 = basicAnnual * (cityType === 'METRO' ? 0.50 : 0.40);
  return Math.min(c1, c2, c3);
}

// ─── TAXABLE INCOME ──────────────────────────────────────────────────────────

/**
 * Projects annual taxable income for TDS calculation.
 * Assumes gross is the current month's gross. YTD is for months already paid.
 *
 * @param {object} emp
 * @param {number} currentMonthGross
 * @param {number} month - 1..12
 * @param {number} ytdGross - Gross already paid this FY
 * @returns {number}
 */
export function calculateTaxableIncome(emp, currentMonthGross, month, ytdGross = 0) {
  const monthsRemaining = 12 - month + 1;
  const projectedAnnual = currentMonthGross * monthsRemaining
    + (emp.previousEmployerIncome || 0)
    + ytdGross;

  let exemptions = 0;

  // Standard deduction
  exemptions += emp.taxRegime === 'NEW' ? 75000 : 50000;

  // HRA exemption (Old regime only)
  if (emp.taxRegime === 'OLD') {
    const hraEx = calculateHRAExemption(
      emp.basicSalary * 12,
      emp.hra * 12,
      (emp.hraRentPaid || 0) * 12,
      emp.hraCityType || 'NON_METRO'
    );
    exemptions += hraEx;
  }

  // 80C (Old regime, max ₹1.5L)
  if (emp.taxRegime === 'OLD') {
    exemptions += Math.min(emp.section80C || 0, 150000);
  }

  // 80D (Max ₹25,000 self)
  exemptions += Math.min(emp.section80D || 0, 25000);

  // 80EE (Home loan interest — first time, max ₹50,000)
  exemptions += Math.min(emp.section80EE || 0, 50000);

  // Section 24 (Home loan interest, max ₹2L — Old regime)
  if (emp.taxRegime === 'OLD') {
    exemptions += Math.min(emp.section24 || 0, 200000);
  }

  // 80CCD(1B) — NPS additional (₹50,000)
  if ((emp.npsEmployeeRate || 0) > 0) {
    exemptions += 50000;
  }

  return Math.max(projectedAnnual - exemptions, 0);
}

// ─── INCOME TAX & TDS ────────────────────────────────────────────────────────

/**
 * Calculate tax on a given annual taxable income.
 * @param {number} taxableIncome
 * @param {'NEW'|'OLD'} regime
 * @returns {number} Annual tax (including cess & surcharge)
 */
export function calculateAnnualTax(taxableIncome, regime) {
  // 87A Rebate
  if (regime === 'NEW' && taxableIncome <= 775000) return 0;
  if (regime === 'OLD' && taxableIncome <= 500000) return 0;

  const slabs = regime === 'NEW' ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;

  let tax = 0;
  for (const { low, high, rate } of slabs) {
    if (high === null) {
      tax += Math.max(taxableIncome - low, 0) * rate;
    } else {
      tax += Math.max(Math.min(taxableIncome, high) - low, 0) * rate;
    }
  }

  // Cess 4%
  const cess = tax * 0.04;
  let total = tax + cess;

  // Surcharge
  if (taxableIncome > 5000000) {
    let surchargeRate = 0.10;
    if (taxableIncome > 10000000) surchargeRate = 0.15;
    if (taxableIncome > 20000000) surchargeRate = 0.25;
    if (taxableIncome > 50000000) surchargeRate = 0.37;
    total += total * surchargeRate;
  }

  return round2(total);
}

/**
 * Calculate monthly TDS.
 * @param {object} emp
 * @param {number} taxableIncome - Annual projected
 * @param {number} month - 1..12
 * @param {number} ytdTDS - TDS already deducted this FY
 * @returns {number}
 */
export function calculateMonthlyTDS(emp, taxableIncome, month, ytdTDS = 0) {
  const annualTax = calculateAnnualTax(taxableIncome, emp.taxRegime || 'NEW');
  const remainingTax = Math.max(annualTax - (emp.previousEmployerTDS || 0) - ytdTDS, 0);
  const monthsLeft = 12 - month + 1;
  return round2(remainingTax / monthsLeft);
}

// ─── MAIN EMPLOYEE PAYROLL ────────────────────────────────────────────────────

/**
 * Full payroll calculation for one employee for one month.
 *
 * @param {object} emp - Employee data
 * @param {number} year
 * @param {number} month - 1..12
 * @param {object} opts - { lopDays, bonus, incentive, overtime, arrears, reimbursements, ytdGross, ytdTDS }
 * @returns {object} Full payroll result
 */
export function calculateEmployeePayroll(emp, year, month, opts = {}) {
  const {
    lopDays     = 0,
    bonus       = 0,
    incentive   = 0,
    overtime    = 0,
    arrears     = 0,
    reimbursements = 0,
    ytdGross    = 0,
    ytdTDS      = 0,
  } = opts;

  const totalDays   = daysInMonth(year, month);
  const payableDays = totalDays - lopDays;
  const prorate     = payableDays / totalDays;

  // ── Earnings ──────────────────────────────────────────────────────────────
  const basic              = round2(emp.basicSalary       * prorate);
  const hra                = round2(emp.hra               * prorate);
  const specialAllowance   = round2(emp.specialAllowance  * prorate);
  const conveyance         = round2(emp.conveyance        * prorate);
  const medicalAllowance   = round2(emp.medicalAllowance  * prorate);
  const lta                = round2(emp.lta               * prorate);
  const otherAllowances    = round2(emp.otherAllowances   * prorate);

  const grossSalary = round2(
    basic + hra + specialAllowance + conveyance + medicalAllowance +
    lta + otherAllowances + bonus + incentive + overtime + arrears
  );

  // ── PF ────────────────────────────────────────────────────────────────────
  const pf = calculatePF(basic);

  // ── ESI ───────────────────────────────────────────────────────────────────
  const esi = calculateESI(grossSalary);

  // ── Professional Tax ──────────────────────────────────────────────────────
  const pt = calculateProfessionalTax(grossSalary, emp.locationState || 'KARNATAKA');

  // ── LWF ───────────────────────────────────────────────────────────────────
  const lwf = calculateLWF(grossSalary, emp.locationState || 'KARNATAKA');

  // ── NPS ───────────────────────────────────────────────────────────────────
  const nps = calculateNPS(basic, emp.npsEmployeeRate || 0, emp.npsEmployerRate || 0);

  // ── Gratuity Provision ────────────────────────────────────────────────────
  const gratuity = calculateGratuityProvision(basic, emp.dateOfJoining, emp.gratuityEligible);

  // ── TDS ───────────────────────────────────────────────────────────────────
  const taxableIncome = calculateTaxableIncome(emp, grossSalary, month, ytdGross);
  const tds = calculateMonthlyTDS(emp, taxableIncome, month, ytdTDS);

  // ── Other Deductions ──────────────────────────────────────────────────────
  const otherDeductionsTotal = Object.values(emp.otherDeductions || {}).reduce((a, b) => a + b, 0);

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalDeductions = round2(
    pf.pfEmployee + esi.esiEmployee + pt + lwf.employee +
    nps.npsEmployee + tds + otherDeductionsTotal
  );

  const netSalary = round2(grossSalary - totalDeductions);

  const ctc = round2(
    grossSalary + pf.pfEmployerTotal + esi.esiEmployer +
    lwf.employer + nps.npsEmployer + pf.pfAdmin + pf.edli + gratuity
  );

  return {
    employeeId:   emp.employeeId,
    name:         emp.name,
    uan:          emp.uan,
    pan:          emp.pan,
    designation:  emp.designation,
    department:   emp.department,
    locationState: emp.locationState,
    taxRegime:    emp.taxRegime,
    payableDays,
    lopDays,
    totalDays,

    earnings: {
      basic, hra, specialAllowance, conveyance,
      medicalAllowance, lta, otherAllowances,
      bonus, incentive, overtime, arrears,
      reimbursements,
      grossSalary,
    },

    deductions: {
      pfEmployee:       pf.pfEmployee,
      esiEmployee:      esi.esiEmployee,
      professionalTax:  pt,
      lwfEmployee:      lwf.employee,
      npsEmployee:      nps.npsEmployee,
      tds,
      otherDeductions:  otherDeductionsTotal,
      totalDeductions,
    },

    employerContributions: {
      pfEmployerPF:   pf.pfEmployerPF,
      epsEmployer:    pf.epsEmployer,
      pfEmployerTotal: pf.pfEmployerTotal,
      pfAdmin:        pf.pfAdmin,
      edli:           pf.edli,
      esiEmployer:    esi.esiEmployer,
      lwfEmployer:    lwf.employer,
      npsEmployer:    nps.npsEmployer,
      gratuityProvision: gratuity,
    },

    statutory: {
      pfEmployee:   pf.pfEmployee,
      pfEmployer:   pf.pfEmployerTotal,
      esiEmployee:  esi.esiEmployee,
      esiEmployer:  esi.esiEmployer,
      pt,
      lwfEmployee:  lwf.employee,
      lwfEmployer:  lwf.employer,
      tds,
      npsEmployee:  nps.npsEmployee,
      npsEmployer:  nps.npsEmployer,
    },

    taxableIncome,
    netSalary,
    ctc,
  };
}

// ─── CHALLANS ────────────────────────────────────────────────────────────────

/**
 * Generate statutory challan due dates and amounts.
 * @param {object} statutorySummary
 * @param {number} year
 * @param {number} month - 1..12
 * @returns {object}
 */
export function generateChallans(statutorySummary, year, month) {
  // Next month
  const nextDate = new Date(year, month, 1); // month is already 0-indexed for next month
  const nextYear  = nextDate.getFullYear();
  const nextMonth = nextDate.getMonth() + 1; // 1-indexed

  const fmt = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  return {
    epfo: {
      type:    'EPFO — ECR',
      dueDate: fmt(nextYear, nextMonth, 15),
      amount: {
        employeeShare:  statutorySummary.totalPfEmployee,
        employerSharePF:  round2(statutorySummary.totalPfEmployer * 0.3058),
        employerShareEPS: round2(statutorySummary.totalPfEmployer * 0.6942),
        adminCharges:   round2((statutorySummary.totalPfEmployee + statutorySummary.totalPfEmployer) * 0.005),
        edliCharges:    round2((statutorySummary.totalPfEmployee + statutorySummary.totalPfEmployer) * 0.005),
        total: round2(statutorySummary.totalPfEmployee + statutorySummary.totalPfEmployer),
      },
      portal: 'https://unifiedportal-emp.epfindia.gov.in',
      status: 'PENDING',
    },
    esic: {
      type:    'ESIC',
      dueDate: fmt(nextYear, nextMonth, 15),
      amount: {
        employeeShare: statutorySummary.totalEsiEmployee,
        employerShare: statutorySummary.totalEsiEmployer,
        total: round2(statutorySummary.totalEsiEmployee + statutorySummary.totalEsiEmployer),
      },
      portal: 'https://www.esic.in',
      status: 'PENDING',
    },
    tds: {
      type:    'TDS — Challan 281',
      dueDate: fmt(nextYear, nextMonth, 7),
      amount:  statutorySummary.totalTds,
      portal:  'https://www.tdscpc.gov.in',
      status:  'PENDING',
    },
    pt: {
      type:    'Professional Tax',
      dueDate: fmt(nextYear, nextMonth, 15),
      amount:  statutorySummary.totalPt,
      status:  'PENDING',
    },
    lwf: {
      type:    'Labour Welfare Fund',
      dueDate: fmt(nextYear, nextMonth === 4 ? 1 : nextMonth, 15),
      amount: round2(statutorySummary.totalLwfEmployee + statutorySummary.totalLwfEmployer),
      status:  'PENDING',
    },
  };
}

// ─── PAYSLIP DATA ────────────────────────────────────────────────────────────

export function generatePayslipData(result, year, month, companyName = 'SSRMM Consultants (OPC) Pvt. Ltd.') {
  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
  return {
    companyName,
    payPeriod: `${monthNames[month - 1]} ${year}`,
    employee:  result,
    generatedAt: new Date().toISOString(),
  };
}

// ─── FORMATTING HELPERS ───────────────────────────────────────────────────────

export const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const formatINRFull = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(n);

export const STATES = Object.keys(PT_SLABS).map(k =>
  k.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join(' ')
);

export const ALL_STATES = [
  'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana',
  'Delhi', 'West Bengal', 'Gujarat', 'Madhya Pradesh', 'Kerala', 'Odisha',
  'Rajasthan', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Himachal Pradesh',
  'Uttarakhand', 'Jharkhand', 'Chhattisgarh', 'Assam', 'Bihar', 'Goa',
];
