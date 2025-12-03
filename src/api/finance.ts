/**
 * 🔌 Real API - حاسبة التمويل العقاري
 * 
 * API حقيقي للحسابات المالية
 */

interface FinanceRequest {
  method: string;
  body?: any;
}

interface FinanceResponse {
  status: (code: number) => {
    json: (data: any) => void;
  };
}

/**
 * حساب القسط الشهري للتمويل العقاري
 */
function calculateMortgage(params: {
  propertyPrice: number;
  downPayment: number;
  loanTerm: number; // بالسنوات
  interestRate: number; // نسبة مئوية
  salary?: number;
  existingLoans?: number;
}) {
  const {
    propertyPrice,
    downPayment,
    loanTerm,
    interestRate,
    salary = 0,
    existingLoans = 0
  } = params;

  // حساب مبلغ القرض
  const loanAmount = propertyPrice - downPayment;

  // تحويل المعدل السنوي إلى شهري
  const monthlyRate = interestRate / 100 / 12;

  // عدد الأقساط (شهري)
  const numberOfPayments = loanTerm * 12;

  // حساب القسط الشهري باستخدام معادلة القرض
  let monthlyPayment;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numberOfPayments;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  // إجمالي المبلغ المدفوع
  const totalPayment = monthlyPayment * numberOfPayments;

  // إجمالي الفائدة
  const totalInterest = totalPayment - loanAmount;

  // نسبة الدفعة الأولى
  const downPaymentPercentage = (downPayment / propertyPrice) * 100;

  // القدرة على السداد (إذا كان الراتب متوفر)
  let affordability = true;
  let maxLoanAmount = loanAmount;
  let debtToIncome = 0;

  if (salary > 0) {
    // نسبة الدين إلى الدخل (يجب ألا تتجاوز 33%)
    const totalMonthlyDebt = monthlyPayment + existingLoans;
    debtToIncome = (totalMonthlyDebt / salary) * 100;
    affordability = debtToIncome <= 33;

    // أقصى مبلغ قرض ممكن (33% من الراتب)
    const maxMonthlyPayment = (salary * 0.33) - existingLoans;
    if (monthlyRate === 0) {
      maxLoanAmount = maxMonthlyPayment * numberOfPayments;
    } else {
      maxLoanAmount =
        (maxMonthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    }
  }

  return {
    // المدخلات
    input: {
      propertyPrice,
      downPayment,
      downPaymentPercentage: Math.round(downPaymentPercentage * 100) / 100,
      loanAmount,
      loanTerm,
      interestRate,
      salary,
      existingLoans
    },

    // النتائج
    results: {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      numberOfPayments,
      effectiveInterestRate: interestRate
    },

    // القدرة على السداد
    affordability: {
      canAfford: affordability,
      debtToIncome: Math.round(debtToIncome * 100) / 100,
      maxLoanAmount: Math.round(maxLoanAmount * 100) / 100,
      maxPropertyPrice: Math.round((maxLoanAmount + downPayment) * 100) / 100,
      recommendedDownPayment: Math.round((propertyPrice * 0.2) * 100) / 100
    },

    // ملخص
    summary: `القسط الشهري: ${Math.round(monthlyPayment).toLocaleString('ar-SA')} ريال | إجمالي الفائدة: ${Math.round(totalInterest).toLocaleString('ar-SA')} ريال | ${affordability ? '✅ يمكنك السداد' : '⚠️ قد تواجه صعوبة في السداد'}`,

    // توصيات
    recommendations: [
      downPaymentPercentage < 20 ? '💡 يُنصح بزيادة الدفعة الأولى إلى 20% على الأقل' : null,
      debtToIncome > 33 ? '⚠️ نسبة الدين إلى الدخل مرتفعة، قد تحتاج لتقليل القرض' : null,
      loanTerm > 25 ? '💡 مدة القرض طويلة، ستدفع فائدة أكثر' : null,
      interestRate > 4 ? '💡 معدل الفائدة مرتفع، حاول التفاوض على معدل أقل' : null
    ].filter(Boolean)
  };
}

/**
 * حساب العائد على الاستثمار (ROI)
 */
function calculateROI(params: {
  purchasePrice: number;
  sellingPrice: number;
  rentalIncome?: number;
  expenses?: number;
  holdingPeriod?: number; // بالسنوات
}) {
  const {
    purchasePrice,
    sellingPrice,
    rentalIncome = 0,
    expenses = 0,
    holdingPeriod = 1
  } = params;

  const capitalGain = sellingPrice - purchasePrice;
  const totalRentalIncome = rentalIncome * holdingPeriod;
  const totalExpenses = expenses * holdingPeriod;
  const netProfit = capitalGain + totalRentalIncome - totalExpenses;
  const roi = (netProfit / purchasePrice) * 100;
  const annualROI = roi / holdingPeriod;

  return {
    input: params,
    results: {
      capitalGain: Math.round(capitalGain * 100) / 100,
      totalRentalIncome: Math.round(totalRentalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      annualROI: Math.round(annualROI * 100) / 100
    },
    summary: `العائد الصافي: ${Math.round(netProfit).toLocaleString('ar-SA')} ريال | العائد السنوي: ${Math.round(annualROI)}%`
  };
}

/**
 * حساب الربح المتوقع
 */
function calculateProfit(params: {
  revenue: number;
  costs: number;
  taxRate?: number;
}) {
  const { revenue, costs, taxRate = 0 } = params;
  const grossProfit = revenue - costs;
  const tax = grossProfit * (taxRate / 100);
  const netProfit = grossProfit - tax;
  const profitMargin = (netProfit / revenue) * 100;

  return {
    input: params,
    results: {
      revenue,
      costs,
      grossProfit: Math.round(grossProfit * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100
    },
    summary: `الربح الصافي: ${Math.round(netProfit).toLocaleString('ar-SA')} ريال | هامش الربح: ${Math.round(profitMargin)}%`
  };
}

/**
 * معالج الطلبات - المالية
 */
export default async function handler(req: FinanceRequest, res: FinanceResponse) {
  const { method, body } = req;

  try {
    if (method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'طريقة غير مسموحة'
      });
    }

    const { type, params } = body;

    // حساب التمويل العقاري
    if (type === 'mortgage') {
      if (!params.propertyPrice || !params.downPayment || !params.loanTerm || !params.interestRate) {
        return res.status(400).json({
          success: false,
          error: 'معاملات غير كاملة: propertyPrice, downPayment, loanTerm, interestRate مطلوبة'
        });
      }

      const result = calculateMortgage(params);

      return res.status(200).json({
        success: true,
        data: result,
        message: 'تم حساب التمويل بنجاح'
      });
    }

    // حساب العائد على الاستثمار
    if (type === 'roi') {
      if (!params.purchasePrice || !params.sellingPrice) {
        return res.status(400).json({
          success: false,
          error: 'معاملات غير كاملة: purchasePrice, sellingPrice مطلوبة'
        });
      }

      const result = calculateROI(params);

      return res.status(200).json({
        success: true,
        data: result,
        message: 'تم حساب العائد بنجاح'
      });
    }

    // حساب الربح
    if (type === 'profit') {
      if (!params.revenue || !params.costs) {
        return res.status(400).json({
          success: false,
          error: 'معاملات غير كاملة: revenue, costs مطلوبة'
        });
      }

      const result = calculateProfit(params);

      return res.status(200).json({
        success: true,
        data: result,
        message: 'تم حساب الربح بنجاح'
      });
    }

    return res.status(400).json({
      success: false,
      error: 'نوع الحساب غير معروف. الأنواع المتاحة: mortgage, roi, profit'
    });

  } catch (error) {
    console.error('Finance API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطأ في الخادم',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * أمثلة الاستخدام:
 * 
 * // حساب التمويل العقاري
 * POST /api/finance
 * Body: {
 *   type: "mortgage",
 *   params: {
 *     propertyPrice: 500000,
 *     downPayment: 100000,
 *     loanTerm: 20,
 *     interestRate: 3.5,
 *     salary: 15000,
 *     existingLoans: 0
 *   }
 * }
 * 
 * // حساب العائد على الاستثمار
 * POST /api/finance
 * Body: {
 *   type: "roi",
 *   params: {
 *     purchasePrice: 500000,
 *     sellingPrice: 600000,
 *     rentalIncome: 30000,
 *     expenses: 5000,
 *     holdingPeriod: 5
 *   }
 * }
 * 
 * // حساب الربح
 * POST /api/finance
 * Body: {
 *   type: "profit",
 *   params: {
 *     revenue: 100000,
 *     costs: 60000,
 *     taxRate: 15
 *   }
 * }
 */
