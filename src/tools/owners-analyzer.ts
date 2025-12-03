#!/usr/bin/env ts-node
/**
 * tools/owners-analyzer.ts
 *
 * تحليل برامبت/كود قسم "أصحاب العروض والطلبات"
 * ينتج: ./analysis-report/report.json و report.txt
 */

import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

type CheckResult = {
  key: string;
  ok: boolean;
  detail?: string;
  fileMatches?: string[]; // matched files
  severity?: 'critical' | 'warning' | 'info';
};

type Report = {
  generatedAt: string;
  projectRoot: string;
  checks: CheckResult[];
  summary: {
    total: number;
    ok: number;
    missing: number;
    warnings: number;
    critical: number;
  };
  recommendations: string[];
};

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "analysis-report");

function readFileSafe(p: string): string | null {
  try {
    return fs.readFileSync(p, "utf-8");
  } catch (e) {
    return null;
  }
}

function findFiles(pattern: string): string[] {
  try {
    return glob.sync(pattern, { nodir: true, absolute: true, cwd: ROOT });
  } catch (e) {
    console.warn(`Pattern failed: ${pattern}`, e);
    return [];
  }
}

function containsAny(content: string | null, patterns: (string | RegExp)[]): boolean {
  if (!content) return false;
  return patterns.some((pat) => {
    if (typeof pat === "string") return content.includes(pat);
    return !!content.match(pat);
  });
}

function runChecks(): Report {
  const checks: CheckResult[] = [];
  const recommendations: string[] = [];
  const now = new Date().toISOString();

  console.log("🔍 بدء تحليل نظام أصحاب العروض والطلبات...");

  // 1) فحص المكونات الأساسية
  console.log("📂 فحص وجود المكونات الأساسية...");
  const components = [
    { key: "RoleTiles component", patterns: ["components/owners/RoleTiles.tsx", "RoleTiles.tsx"], critical: true },
    { key: "MapPicker component", patterns: ["components/owners/MapPicker.tsx", "MapPicker.tsx"], critical: false },
    { key: "HomeDashboard component", patterns: ["components/HomeDashboard.tsx", "HomeDashboard.tsx"], critical: true },
    { key: "SaleOfferForm component", patterns: ["components/owners/SaleOfferForm.tsx", "SaleOfferForm.tsx"], critical: false },
    { key: "RentOfferForm component", patterns: ["components/owners/RentOfferForm.tsx", "RentOfferForm.tsx"], critical: false },
    { key: "BuyRequestForm component", patterns: ["components/owners/BuyRequestForm.tsx", "BuyRequestForm.tsx"], critical: false },
    { key: "RentRequestForm component", patterns: ["components/owners/RentRequestForm.tsx", "RentRequestForm.tsx"], critical: false },
    { key: "OfferCard component", patterns: ["components/owners/OfferCard.tsx", "OfferCard.tsx"], critical: false },
    { key: "CRMPanel component", patterns: ["components/owners/CRMPanel.tsx", "CRMPanel.tsx"], critical: false },
    { key: "HomeOwners page", patterns: ["pages/owners/HomeOwners.tsx", "HomeOwners.tsx"], critical: true },
    { key: "Types file (owners.ts)", patterns: ["types/owners.ts", "owners.ts"], critical: true },
  ];

  for (const comp of components) {
    const found = findFiles(`**/${comp.patterns[0]}`)
      .concat(findFiles(`**/${comp.patterns[1]}`));
    const exists = found.length > 0;
    
    checks.push({
      key: comp.key,
      ok: exists,
      detail: exists ? `موجود: ${found.map(f => path.relative(ROOT, f)).join(", ")}` : `مفقود: ${comp.patterns.join(" أو ")}`,
      fileMatches: found.map(f => path.relative(ROOT, f)),
      severity: comp.critical ? 'critical' : 'warning',
    });

    if (!exists && comp.critical) {
      recommendations.push(`⚠️ إنشاء الملف المفقود: ${comp.patterns[0]}`);
    }
  }

  // 2) فحص App.tsx للتكاملات المهمة
  console.log("🔗 فحص تكاملات App.tsx...");
  const appTsxPath = path.join(ROOT, "App.tsx");
  const appContent = readFileSafe(appTsxPath);
  
  const appChecks = [
    { key: "App.tsx يستورد HomeDashboard", patterns: ["HomeDashboard", "import.*HomeDashboard"] },
    { key: "App.tsx يستورد HomeOwners", patterns: ["HomeOwners", "import.*HomeOwners"] },
    { key: "App.tsx يحتوي على navigation للـ home-dashboard", patterns: ["home-dashboard", "currentPage === \"home-dashboard\""] },
    { key: "App.tsx يحتوي على navigation للـ home-owners", patterns: ["home-owners", "currentPage === \"home-owners\""] },
    { key: "App.tsx يستخدم Google Maps imports", patterns: ["@react-google-maps/api", "GoogleMap", "useLoadScript"] },
  ];

  for (const check of appChecks) {
    const found = containsAny(appContent, check.patterns);
    checks.push({
      key: check.key,
      ok: found,
      detail: found ? "موجود في App.tsx" : "مفقود من App.tsx",
      fileMatches: found ? ["App.tsx"] : [],
      severity: 'critical',
    });
  }

  // 3) فحص الميزات المتقدمة في الكود
  console.log("🔧 فحص الميزات المتقدمة...");
  const codeFiles = findFiles("**/*.{ts,tsx,js,jsx}")
    .filter(f => !f.includes("node_modules") && !f.includes(".git"));

  const featureChecks = [
    { 
      key: "Google Maps integration", 
      patterns: ["@react-google-maps/api", "GoogleMap", "useLoadScript", "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"],
      hint: "تأكد من تثبيت @react-google-maps/api وإعداد مفتاح API"
    },
    { 
      key: "Map marker click handling", 
      patterns: ["handleMapClick", "latLng", "lat()", "lng()", "markerPosition"],
      hint: "تأكد من معالجة النقر على الخريطة"
    },
    { 
      key: "Role selection state", 
      patterns: ["useState.*role", "setRole", "OwnerRole", "role === \"baye3\"", "role === \"moshtari\""],
      hint: "تأكد من حالة اختيار نوع المستخدم"
    },
    { 
      key: "Form fields (deed, price, features)", 
      patterns: ["deedNumber", "deedDate", "salePrice", "rentPrice", "bedrooms", "bathrooms"],
      hint: "تأكد من وجود حقول النماذج المطلوبة"
    },
    { 
      key: "Broker proposals system", 
      patterns: ["brokerProposals", "BrokerProposal", "commissionPercent", "brokers.map"],
      hint: "تأكد من نظام عروض الوسطاء"
    },
    { 
      key: "Motion/React animations", 
      patterns: ["motion/react", "motion.div", "initial.*animate", "framer-motion"],
      hint: "تأكد من استيراد motion/react للحركات"
    },
  ];

  for (const feature of featureChecks) {
    const matches: string[] = [];
    for (const f of codeFiles) {
      const content = readFileSafe(f);
      if (containsAny(content, feature.patterns)) {
        matches.push(path.relative(ROOT, f));
      }
    }
    
    checks.push({
      key: feature.key,
      ok: matches.length > 0,
      detail: matches.length > 0 ? `موجود في ${matches.length} ملف(ات)` : `مفقود. نصيحة: ${feature.hint}`,
      fileMatches: matches,
      severity: matches.length > 0 ? 'info' : 'warning',
    });

    if (matches.length === 0) {
      recommendations.push(`💡 ${feature.hint}`);
    }
  }

  // 4) فحص ملفات البيئة والإعدادات
  console.log("🌍 فحص متغيرات البيئة...");
  const envFiles = [".env", ".env.local", ".env.development", ".env.production", ".env.example"]
    .map(n => path.join(ROOT, n))
    .filter(p => fs.existsSync(p));

  checks.push({
    key: "ملفات البيئة (.env)",
    ok: envFiles.length > 0,
    detail: envFiles.length > 0 
      ? `موجود: ${envFiles.map(p => path.relative(ROOT, p)).join(", ")}`
      : "لا توجد ملفات .env",
    fileMatches: envFiles.map(p => path.relative(ROOT, p)),
    severity: 'warning',
  });

  let hasMapsKey = false;
  for (const envFile of envFiles) {
    const content = readFileSafe(envFile) || "";
    if (content.includes("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")) {
      hasMapsKey = true;
      break;
    }
  }

  checks.push({
    key: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY في ملفات البيئة",
    ok: hasMapsKey,
    detail: hasMapsKey ? "موجود في ملفات البيئة" : "مفقود من ملفات البيئة",
    fileMatches: envFiles.map(p => path.relative(ROOT, p)),
    severity: hasMapsKey ? 'info' : 'critical',
  });

  if (!hasMapsKey) {
    recommendations.push("🗝️ إضافة NEXT_PUBLIC_GOOGLE_MAPS_API_KEY في ملف .env.local");
  }

  // 5) فحص Tailwind وCSS
  console.log("🎨 فحص Tailwind وCSS...");
  const globalsCssPath = path.join(ROOT, "styles/globals.css");
  const globalsCss = readFileSafe(globalsCssPath);
  
  const cssChecks = [
    { key: "ألوان النظام (#01411C, #D4AF37)", patterns: ["#01411C", "#D4AF37", "--primary.*#01411C", "--accent.*#D4AF37"] },
    { key: "كلاسات محسنة (royal-green-enhanced, gold-enhanced)", patterns: ["royal-green-enhanced", "gold-enhanced", "interactive-btn"] },
    { key: "تحسينات اللمس (touch-scroll, form-input-enhanced)", patterns: ["touch-scroll", "form-input-enhanced", "touch-manipulation"] },
    { key: "خطوط عربية (Tajawal)", patterns: ["Tajawal", "font-family.*Tajawal", "@import.*Tajawal"] },
  ];

  for (const cssCheck of cssChecks) {
    const found = containsAny(globalsCss, cssCheck.patterns);
    checks.push({
      key: cssCheck.key,
      ok: found,
      detail: found ? "موجود في globals.css" : "مفقود من globals.css",
      fileMatches: found ? ["styles/globals.css"] : [],
      severity: found ? 'info' : 'warning',
    });
  }

  // 6) فحص التوجيه والتنقل
  console.log("🧭 فحص نظام التوجيه...");
  const navigationChecks = [
    { key: "handleNavigate function في App.tsx", patterns: ["handleNavigate", "const handleNavigate"] },
    { key: "currentPage state في App.tsx", patterns: ["currentPage", "setCurrentPage"] },
    { key: "home-dashboard route", patterns: ["home-dashboard", "currentPage.*===.*home-dashboard"] },
    { key: "home-owners route", patterns: ["home-owners", "currentPage.*===.*home-owners"] },
    { key: "offers-requests-dashboard route", patterns: ["offers-requests-dashboard"] },
  ];

  for (const navCheck of navigationChecks) {
    const found = containsAny(appContent, navCheck.patterns);
    checks.push({
      key: navCheck.key,
      ok: found,
      detail: found ? "موجود في App.tsx" : "مفقود من App.tsx",
      fileMatches: found ? ["App.tsx"] : [],
      severity: 'critical',
    });
  }

  // 7) فحص المكتبات المطلوبة
  console.log("📦 فحص المكتبات المطلوبة...");
  const packageJsonPath = path.join(ROOT, "package.json");
  const packageJson = readFileSafe(packageJsonPath);
  let packageData: any = {};
  
  try {
    if (packageJson) {
      packageData = JSON.parse(packageJson);
    }
  } catch (e) {
    console.warn("فشل في قراءة package.json");
  }

  const requiredLibs = [
    { name: "@react-google-maps/api", critical: false },
    { name: "motion", critical: false },
    { name: "framer-motion", critical: false },
    { name: "lucide-react", critical: true },
    { name: "react", critical: true },
    { name: "typescript", critical: true },
  ];

  for (const lib of requiredLibs) {
    const dependencies = { ...packageData.dependencies, ...packageData.devDependencies };
    const hasLib = dependencies && (dependencies[lib.name] || dependencies[`@${lib.name}`] || Object.keys(dependencies).some(key => key.includes(lib.name)));
    
    checks.push({
      key: `مكتبة ${lib.name}`,
      ok: hasLib,
      detail: hasLib ? `مثبتة: ${lib.name}` : `مفقودة: ${lib.name}`,
      fileMatches: hasLib ? ["package.json"] : [],
      severity: lib.critical ? 'critical' : 'warning',
    });

    if (!hasLib && lib.critical) {
      recommendations.push(`📦 تثبيت المكتبة: npm install ${lib.name}`);
    }
  }

  // 8) فحص هيكل الملفات المتوقع
  console.log("📁 فحص هيكل الملفات...");
  const expectedDirs = [
    { path: "components/owners", critical: true },
    { path: "pages/owners", critical: true },
    { path: "types", critical: true },
    { path: "styles", critical: true },
    { path: "components/ui", critical: false },
  ];

  for (const dir of expectedDirs) {
    const dirPath = path.join(ROOT, dir.path);
    const exists = fs.existsSync(dirPath);
    
    checks.push({
      key: `مجلد ${dir.path}`,
      ok: exists,
      detail: exists ? `موجود: ${dir.path}` : `مفقود: ${dir.path}`,
      fileMatches: exists ? [dir.path] : [],
      severity: dir.critical ? 'critical' : 'warning',
    });

    if (!exists && dir.critical) {
      recommendations.push(`📁 إنشاء المجلد: ${dir.path}`);
    }
  }

  // حساب الملخص
  const total = checks.length;
  const ok = checks.filter(c => c.ok).length;
  const missing = checks.filter(c => !c.ok).length;
  const warnings = checks.filter(c => !c.ok && c.severity === 'warning').length;
  const critical = checks.filter(c => !c.ok && c.severity === 'critical').length;

  // إضافة توصيات عامة
  if (critical > 0) {
    recommendations.push("⚠️ هناك مشاكل حرجة تحتاج إصلاح فوري");
  }
  if (warnings > 3) {
    recommendations.push("💡 يُنصح بإصلاح التحذيرات لتحسين الأداء");
  }
  if (ok > total * 0.8) {
    recommendations.push("✅ النظام في حالة جيدة عموماً");
  }

  const report: Report = {
    generatedAt: now,
    projectRoot: ROOT,
    checks,
    summary: { total, ok, missing, warnings, critical },
    recommendations,
  };

  console.log("✅ تم إكمال التحليل!");
  return report;
}

function saveReport(r: Report) {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const jsonPath = path.join(OUT_DIR, "report.json");
  const txtPath = path.join(OUT_DIR, "report.txt");
  
  // حفظ JSON
  fs.writeFileSync(jsonPath, JSON.stringify(r, null, 2), "utf-8");

  // إنشاء التقرير النصي
  let txt = `🔍 تقرير تحليل نظام أصحاب العروض والطلبات
══════════════════════════════════════════════════════

📅 تاريخ التحليل: ${r.generatedAt}
📂 مسار المشروع: ${r.projectRoot}

📊 ملخص التحليل:
═══════════════════
• إجمالي الفحوصات: ${r.summary.total}
• العناصر السليمة: ${r.summary.ok} ✅
• العناصر المفقودة: ${r.summary.missing} ❌
• تحذيرات: ${r.summary.warnings} ⚠️
• مشاكل حرجة: ${r.summary.critical} 🚨

نسبة النجاح: ${Math.round((r.summary.ok / r.summary.total) * 100)}%

`;

  // إضافة المشاكل الحرجة أولاً
  const criticalIssues = r.checks.filter(c => !c.ok && c.severity === 'critical');
  if (criticalIssues.length > 0) {
    txt += `🚨 المشاكل الحرجة (تحتاج إصلاح فوري):
═══════════════════════════════════════════════

`;
    criticalIssues.forEach(issue => {
      txt += `❌ ${issue.key}
   التفاصيل: ${issue.detail}
   الملفات: ${issue.fileMatches?.join(", ") || "لا يوجد"}

`;
    });
  }

  // إضافة التحذيرات
  const warnings = r.checks.filter(c => !c.ok && c.severity === 'warning');
  if (warnings.length > 0) {
    txt += `⚠️ التحذيرات:
═══════════════

`;
    warnings.forEach(warning => {
      txt += `⚠️ ${warning.key}
   التفاصيل: ${warning.detail}
   الملفات: ${warning.fileMatches?.join(", ") || "لا يوجد"}

`;
    });
  }

  // إضافة العناصر السليمة
  const successItems = r.checks.filter(c => c.ok);
  if (successItems.length > 0) {
    txt += `✅ العناصر السليمة:
═══════════════════

`;
    successItems.forEach(item => {
      txt += `✅ ${item.key}
   التفاصيل: ${item.detail}

`;
    });
  }

  // إضافة التوصيات
  if (r.recommendations.length > 0) {
    txt += `💡 التوصيات والخطوات التالية:
═══════════════════════════════════

`;
    r.recommendations.forEach((rec, index) => {
      txt += `${index + 1}. ${rec}
`;
    });
  }

  txt += `

══════════════════════════════════════════════════════
📝 تم إنشاء هذا التقرير بواسطة Owners Analyzer
🔧 لإصلاح المشاكل، راجع الملفات المذكورة أعلاه
══════════════════════════════════════════════════════
`;

  fs.writeFileSync(txtPath, txt, "utf-8");

  console.log(`📄 تم حفظ التقرير في: ${OUT_DIR}`);
  console.log(`📊 JSON: ${path.relative(ROOT, jsonPath)}`);
  console.log(`📝 نص: ${path.relative(ROOT, txtPath)}`);
}

function main() {
  console.log("🚀 تشغيل محلل نظام أصحاب العروض والطلبات...");
  console.log("═══════════════════════════════════════════════════");
  
  try {
    const report = runChecks();
    saveReport(report);
    
    console.log("\n📋 ملخص سريع:");
    console.log(`✅ سليم: ${report.summary.ok}/${report.summary.total}`);
    console.log(`🚨 حرجة: ${report.summary.critical}`);
    console.log(`⚠️ تحذيرات: ${report.summary.warnings}`);
    
    if (report.summary.critical > 0) {
      console.log("\n🚨 تحذير: هناك مشاكل حرجة تحتاج إصلاح فوري!");
      console.log("راجع التقرير للتفاصيل الكاملة.");
    } else if (report.summary.warnings > 0) {
      console.log("\n💡 نصيحة: هناك تحذيرات يُنصح بإصلاحها.");
    } else {
      console.log("\n🎉 ممتاز! النظام في حالة جيدة.");
    }
    
  } catch (error) {
    console.error("❌ خطأ في تشغيل المحلل:", error);
    process.exit(1);
  }
  
  console.log("\n✅ تم الانتهاء!");
}

// تشغيل الأداة إذا تم استدعاؤها مباشرة
if (require.main === module) {
  main();
}

export { runChecks, saveReport };