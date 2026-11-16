import type { LabPriceItem } from '../types.ts';

export const INITIAL_PRICES: LabPriceItem[] = [
  {
    "id": "t-1",
    "code": "HEM-01",
    "nameAr": "صورة دم كاملة (CBC + Diff)",
    "nameEn": "Complete Blood Count with 5-Part Diff",
    "category": "hematology",
    "price": 150,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-2",
    "code": "HEM-02",
    "nameAr": "سرعة ترسيب الدم (ESR)",
    "nameEn": "Erythrocyte Sedimentation Rate",
    "category": "hematology",
    "price": 80,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-3",
    "code": "HEM-03",
    "nameAr": "فصيلة الدم وعامل ريسس (ABO & Rh)",
    "nameEn": "Blood Group & Rh Typing",
    "category": "hematology",
    "price": 80,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-4",
    "code": "HEM-04",
    "nameAr": "مسحة دم ميكروسكوبية يدوية (Blood Film)",
    "nameEn": "Peripheral Blood Smear",
    "category": "hematology",
    "price": 120,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-5",
    "code": "HEM-05",
    "nameAr": "الخلايا الشبكية ومؤشر إنتاجها (Reticulocytes)",
    "nameEn": "Reticulocyte Count & Production Index",
    "category": "hematology",
    "price": 100,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-6",
    "code": "HEM-06",
    "nameAr": "اختبار كومبس المباشر (Direct Coombs / DAT)",
    "nameEn": "Direct Antiglobulin Test",
    "category": "hematology",
    "price": 140,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-7",
    "code": "HEM-07",
    "nameAr": "اختبار كومبس غير المباشر (Indirect Coombs / IAT)",
    "nameEn": "Indirect Antiglobulin Test",
    "category": "hematology",
    "price": 150,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-8",
    "code": "HEM-08",
    "nameAr": "إنزيم أنيميا الفول كمي (G6PD Quantitative)",
    "nameEn": "Glucose-6-Phosphate Dehydrogenase",
    "category": "hematology",
    "price": 260,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-9",
    "code": "HEM-09",
    "nameAr": "فصل الهيموجلوبين الكهربائي (Hb Electrophoresis HPLC)",
    "nameEn": "Hemoglobin Electrophoresis by HPLC",
    "category": "hematology",
    "price": 360,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-10",
    "code": "HEM-10",
    "nameAr": "اختبار التمنجل (Sickling Test)",
    "nameEn": "Sickle Cell Preparation",
    "category": "hematology",
    "price": 110,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-11",
    "code": "HEM-11",
    "nameAr": "هشاشة كرات الدم الحمراء (Osmotic Fragility Test)",
    "nameEn": "Osmotic Fragility Test",
    "category": "hematology",
    "price": 240,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-12",
    "code": "HEM-12",
    "nameAr": "الهيموجلوبين الجنيني كمي (Hb F)",
    "nameEn": "Fetal Hemoglobin Quantitative",
    "category": "hematology",
    "price": 190,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-13",
    "code": "HEM-13",
    "nameAr": "هيموجلوبين A2 كمي (Hb A2 Quantitative)",
    "nameEn": "Hemoglobin A2 by HPLC",
    "category": "hematology",
    "price": 220,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-14",
    "code": "HEM-14",
    "nameAr": "عد الصفائح الدموية اليدوي بالمجهر (Manual Platelet Count)",
    "nameEn": "Manual Platelet Count",
    "category": "hematology",
    "price": 80,
    "duration": "ساعة",
    "active": true
  },
  {
    "id": "t-15",
    "code": "HEM-15",
    "nameAr": "أجسام هاينز (Heinz Bodies)",
    "nameEn": "Heinz Bodies Detection",
    "category": "hematology",
    "price": 130,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-16",
    "code": "HEM-16",
    "nameAr": "طفيلي الملاريا في الدم مسحة كثيفة ورفيعة",
    "nameEn": "Malaria Blood Smear Thick & Thin",
    "category": "hematology",
    "price": 120,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-17",
    "code": "HEM-17",
    "nameAr": "مستضد الملاريا السريع (Malaria Rapid Antigen)",
    "nameEn": "Malaria Antigen Rapid Test",
    "category": "hematology",
    "price": 180,
    "duration": "ساعة",
    "active": true
  },
  {
    "id": "t-18",
    "code": "HEM-18",
    "nameAr": "فحص نخاع العظم مسحات (Bone Marrow Smear Exam)",
    "nameEn": "Bone Marrow Smear Examination",
    "category": "hematology",
    "price": 650,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-19",
    "code": "HEM-19",
    "nameAr": "صبغة الحديد بنخاع العظم (Perls Prussian Blue)",
    "nameEn": "Bone Marrow Iron Stain",
    "category": "hematology",
    "price": 280,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-20",
    "code": "HEM-20",
    "nameAr": "إنزيم NAP / LAP في العدلات (Neutrophil Alk Phos)",
    "nameEn": "LAP / NAP Score Cytochemistry",
    "category": "hematology",
    "price": 340,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-21",
    "code": "HEM-21",
    "nameAr": "الهيماتوكريت اليدوي الدقيق (PCV)",
    "nameEn": "Microhematocrit PCV",
    "category": "hematology",
    "price": 60,
    "duration": "خلال 30 دقيقة",
    "active": true
  },
  {
    "id": "t-22",
    "code": "HEM-22",
    "nameAr": "الهيموجلوبين الحر في البلازما (Plasma Free Hb)",
    "nameEn": "Plasma Free Hemoglobin",
    "category": "hematology",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-23",
    "code": "HEM-23",
    "nameAr": "الهيموسيدرين في البول (Urine Hemosiderin)",
    "nameEn": "Urine Hemosiderin Stain",
    "category": "hematology",
    "price": 140,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-24",
    "code": "HEM-24",
    "nameAr": "الهابتوغلوبين في مصل الدم (Serum Haptoglobin)",
    "nameEn": "Serum Haptoglobin Quantitative",
    "category": "hematology",
    "price": 280,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-25",
    "code": "HEM-25",
    "nameAr": "الهيموبيكسين (Serum Hemopexin)",
    "nameEn": "Serum Hemopexin",
    "category": "hematology",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-26",
    "code": "HEM-26",
    "nameAr": "الميت هيموجلوبين في الدم (Methemoglobin)",
    "nameEn": "Blood Methemoglobin Level",
    "category": "hematology",
    "price": 290,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-27",
    "code": "HEM-27",
    "nameAr": "السلف هيموجلوبين (Sulfhemoglobin)",
    "nameEn": "Sulfhemoglobin Qualitative",
    "category": "hematology",
    "price": 320,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-28",
    "code": "HEM-28",
    "nameAr": "الكاربوهيموجلوبين السام (Carboxyhemoglobin)",
    "nameEn": "Blood Carboxyhemoglobin Level",
    "category": "hematology",
    "price": 260,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-29",
    "code": "HEM-29",
    "nameAr": "صبغة الفوسفاتاز الحمضي المقاوم للطرطرات (TRAP)",
    "nameEn": "TRAP Cytochemical Stain",
    "category": "hematology",
    "price": 450,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-30",
    "code": "HEM-30",
    "nameAr": "صبغة المايلوبيروكسيداز (MPO Stain)",
    "nameEn": "MPO Cytochemical Stain",
    "category": "hematology",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-31",
    "code": "HEM-31",
    "nameAr": "صبغة السودان الأسود بي (Sudan Black B)",
    "nameEn": "Sudan Black B Stain",
    "category": "hematology",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-32",
    "code": "HEM-32",
    "nameAr": "صبغة الإستيراز المزدوجة (Dual Esterase)",
    "nameEn": "Specific & Non-specific Esterase",
    "category": "hematology",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-33",
    "code": "HEM-33",
    "nameAr": "صبغة PAS للكربوهيدرات (PAS Stain)",
    "nameEn": "PAS Stain for Leukemic Cells",
    "category": "hematology",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-34",
    "code": "HEM-34",
    "nameAr": "أجسام دوني بالعدلات (Döhle Bodies)",
    "nameEn": "Döhle Bodies in Neutrophils",
    "category": "hematology",
    "price": 90,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-35",
    "code": "HEM-35",
    "nameAr": "شذوذ ماي هيغلين الوراثي (May-Hegglin)",
    "nameEn": "May-Hegglin Inclusions Screen",
    "category": "hematology",
    "price": 140,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-36",
    "code": "HEM-36",
    "nameAr": "شذوذ بيلغر هويت للعدلات (Pelger-Huët)",
    "nameEn": "Pelger-Huët Anomaly Detection",
    "category": "hematology",
    "price": 120,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-37",
    "code": "HEM-37",
    "nameAr": "اختبار حمضية السيروم لتكسر الدم (Ham Test)",
    "nameEn": "Ham Acidified Serum Test",
    "category": "hematology",
    "price": 420,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-38",
    "code": "HEM-38",
    "nameAr": "اختبار تحلل السكر لتكسر الدم (Sucrose Lysis)",
    "nameEn": "Sugar Water Test for PNH",
    "category": "hematology",
    "price": 260,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-39",
    "code": "HEM-39",
    "nameAr": "الأجسام المضادة الموجهة للصفائح (Anti-Platelet)",
    "nameEn": "Platelet-Associated Antibodies",
    "category": "hematology",
    "price": 550,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-40",
    "code": "HEM-40",
    "nameAr": "الأجسام المضادة للعدلات (Anti-Neutrophil)",
    "nameEn": "Anti-Neutrophil Autoantibodies",
    "category": "hematology",
    "price": 520,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-41",
    "code": "COA-01",
    "nameAr": "سيولة الدم وزمن البروثرومبين (PT & INR)",
    "nameEn": "Prothrombin Time & INR",
    "category": "coagulation",
    "price": 130,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-42",
    "code": "COA-02",
    "nameAr": "زمن الثرومبوبلاستين الجزئي (PTT / aPTT)",
    "nameEn": "Activated Partial Thromboplastin Time",
    "category": "coagulation",
    "price": 130,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-43",
    "code": "COA-03",
    "nameAr": "دي ديمر كمي عالي الحساسية (D-Dimer Quantitative)",
    "nameEn": "D-Dimer Quantitative",
    "category": "coagulation",
    "price": 360,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-44",
    "code": "COA-04",
    "nameAr": "الفيبرينوجين كمي (Fibrinogen Activity)",
    "nameEn": "Plasma Fibrinogen Clauss",
    "category": "coagulation",
    "price": 190,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-45",
    "code": "COA-05",
    "nameAr": "زمن النزف وزمن التجلط (Bleeding Time & Clotting Time - BT & CT)",
    "nameEn": "Bleeding Time & Clotting Time",
    "category": "coagulation",
    "price": 80,
    "duration": "فوري خلال 30 دقيقة",
    "active": true
  },
  {
    "id": "t-46",
    "code": "COA-06",
    "nameAr": "زمن الثرومبين (Thrombin Time - TT)",
    "nameEn": "Thrombin Time",
    "category": "coagulation",
    "price": 160,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-47",
    "code": "COA-07",
    "nameAr": "مضاد التخثر الذئبي (Lupus Anticoagulant - DRVVT Screen & Confirm)",
    "nameEn": "Lupus Anticoagulant (DRVVT & aPTT Mix)",
    "category": "coagulation",
    "price": 480,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-48",
    "code": "COA-08",
    "nameAr": "بروتين سي التجلطي (Protein C Activity)",
    "nameEn": "Protein C Functional Activity",
    "category": "coagulation",
    "price": 460,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-49",
    "code": "COA-09",
    "nameAr": "بروتين إس التجلطي الحر (Free Protein S Antigen)",
    "nameEn": "Free Protein S Antigen",
    "category": "coagulation",
    "price": 460,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-50",
    "code": "COA-10",
    "nameAr": "مضاد الثرومبين 3 (Antithrombin III Activity)",
    "nameEn": "Antithrombin III Functional Activity",
    "category": "coagulation",
    "price": 440,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-51",
    "code": "COA-11",
    "nameAr": "عامل التجلط الخامس (Factor V Activity)",
    "nameEn": "Factor V Activity",
    "category": "coagulation",
    "price": 390,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-52",
    "code": "COA-12",
    "nameAr": "عامل التجلط السابع (Factor VII Activity)",
    "nameEn": "Factor VII Activity",
    "category": "coagulation",
    "price": 390,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-53",
    "code": "COA-13",
    "nameAr": "عامل التجلط الثامن / الهيموفيليا أ (Factor VIII Activity)",
    "nameEn": "Factor VIII Activity (Hemophilia A)",
    "category": "coagulation",
    "price": 450,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-54",
    "code": "COA-14",
    "nameAr": "عامل التجلط التاسع / الهيموفيليا ب (Factor IX Activity)",
    "nameEn": "Factor IX Activity (Hemophilia B)",
    "category": "coagulation",
    "price": 450,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-55",
    "code": "COA-15",
    "nameAr": "عامل فون ويلبراند (von Willebrand Factor Antigen - vWF Ag)",
    "nameEn": "von Willebrand Factor Antigen",
    "category": "coagulation",
    "price": 520,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-56",
    "code": "COA-16",
    "nameAr": "نشاط ريستوسيتين لعامل فون ويلبراند (vWF Ristocetin Cofactor Activity)",
    "nameEn": "vWF Ristocetin Cofactor Activity",
    "category": "coagulation",
    "price": 550,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-57",
    "code": "COA-17",
    "nameAr": "تجمع الصفائح الدموية (Platelet Aggregation Studies)",
    "nameEn": "Platelet Aggregometry (4 Agonists)",
    "category": "coagulation",
    "price": 750,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-58",
    "code": "COA-18",
    "nameAr": "العامل العاشر للتجلط (Factor X Activity)",
    "nameEn": "Factor X Activity",
    "category": "coagulation",
    "price": 410,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-59",
    "code": "COA-19",
    "nameAr": "العامل الحادي عشر (Factor XI Activity)",
    "nameEn": "Factor XI Activity",
    "category": "coagulation",
    "price": 410,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-60",
    "code": "COA-20",
    "nameAr": "العامل الثاني عشر (Factor XII Activity)",
    "nameEn": "Factor XII Activity",
    "category": "coagulation",
    "price": 410,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-61",
    "code": "COA-21",
    "nameAr": "عامل استقرار الجلطة / العامل 13 (Factor XIII Screen / Activity)",
    "nameEn": "Factor XIII Qualitative / Activity",
    "category": "coagulation",
    "price": 420,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-62",
    "code": "COA-22",
    "nameAr": "نواتج تكسير الفيبرين (FDPs - Fibrin Degradation Products)",
    "nameEn": "Fibrin Degradation Products Latex",
    "category": "coagulation",
    "price": 220,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-63",
    "code": "COA-23",
    "nameAr": "اختبار خلط البلازما لتحديد سبب السيولة (PT / PTT Mixing Study)",
    "nameEn": "Mixing Study 50:50 Normal Plasma",
    "category": "coagulation",
    "price": 250,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-64",
    "code": "COA-24",
    "nameAr": "مضاد العامل العاشر النشط لمتابعة الهيبارين (Anti-Factor Xa Activity)",
    "nameEn": "Anti-Factor Xa Assay (LMWH / UFH)",
    "category": "coagulation",
    "price": 480,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-65",
    "code": "COA-25",
    "nameAr": "مقاومة بروتين سي المنشط (Activated Protein C Resistance - APCR)",
    "nameEn": "APC Resistance (Factor V Leiden Screen)",
    "category": "coagulation",
    "price": 420,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-66",
    "code": "LIV-01",
    "nameAr": "إنزيم الكبد (SGOT / AST)",
    "nameEn": "Aspartate Aminotransferase",
    "category": "liver",
    "price": 90,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-67",
    "code": "LIV-02",
    "nameAr": "إنزيم الكبد (SGPT / ALT)",
    "nameEn": "Alanine Aminotransferase",
    "category": "liver",
    "price": 90,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-68",
    "code": "LIV-03",
    "nameAr": "الصفراء الكلية والمباشرة (Total & Direct Bilirubin)",
    "nameEn": "Bilirubin Total & Direct",
    "category": "liver",
    "price": 110,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-69",
    "code": "LIV-04",
    "nameAr": "الصفراء غير المباشرة المحسوبة (Indirect Bilirubin)",
    "nameEn": "Indirect Bilirubin",
    "category": "liver",
    "price": 50,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-70",
    "code": "LIV-05",
    "nameAr": "زلال الدم (Serum Albumin)",
    "nameEn": "Serum Albumin",
    "category": "liver",
    "price": 80,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-71",
    "code": "LIV-06",
    "nameAr": "البروتين الكلي بالدم (Total Protein)",
    "nameEn": "Serum Total Protein",
    "category": "liver",
    "price": 80,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-72",
    "code": "LIV-07",
    "nameAr": "نسبة الزلال إلى الجلوبيولين (A/G Ratio)",
    "nameEn": "Albumin / Globulin Ratio",
    "category": "liver",
    "price": 50,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-73",
    "code": "LIV-08",
    "nameAr": "الفوسفاتاز القلوي (Alkaline Phosphatase - ALP)",
    "nameEn": "Alkaline Phosphatase",
    "category": "liver",
    "price": 90,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-74",
    "code": "LIV-09",
    "nameAr": "إنزيم جاما جي تي (GGT)",
    "nameEn": "Gamma-Glutamyl Transferase",
    "category": "liver",
    "price": 120,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-75",
    "code": "LIV-10",
    "nameAr": "اللاكتات ديهيدروجينيز (LDH - Total)",
    "nameEn": "Lactate Dehydrogenase",
    "category": "liver",
    "price": 130,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-76",
    "code": "LIV-11",
    "nameAr": "الأمونيا في الدم (Blood Ammonia - NH3)",
    "nameEn": "Blood Ammonia",
    "category": "liver",
    "price": 240,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-77",
    "code": "LIV-12",
    "nameAr": "إنزيم كولينستيراز (Cholinesterase - Pseudocholinesterase)",
    "nameEn": "Cholinesterase Activity",
    "category": "liver",
    "price": 210,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-78",
    "code": "LIV-13",
    "nameAr": "حمض الصفراء الكلي (Total Bile Acids)",
    "nameEn": "Total Bile Acids",
    "category": "liver",
    "price": 320,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-79",
    "code": "LIV-14",
    "nameAr": "السيرولوبلازمين (Ceruloplasmin)",
    "nameEn": "Serum Ceruloplasmin",
    "category": "liver",
    "price": 290,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-80",
    "code": "LIV-15",
    "nameAr": "ألفا 1 أنتيتريبسين (Alpha-1 Antitrypsin)",
    "nameEn": "Alpha-1 Antitrypsin Quantitative",
    "category": "liver",
    "price": 340,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-81",
    "code": "LIV-16",
    "nameAr": "وظائف كبد كاملة (Liver Function Profile Comprehensive)",
    "nameEn": "Comprehensive Liver Panel",
    "category": "liver",
    "price": 380,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-82",
    "code": "LIV-17",
    "nameAr": "تفريد بروتينات مصل الدم الكهربائي (Serum Protein Electrophoresis - SPEP)",
    "nameEn": "Serum Protein Electrophoresis SPEP",
    "category": "liver",
    "price": 280,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-83",
    "code": "LIV-18",
    "nameAr": "التثبيت المناعي لبروتينات الدم (Serum Immunofixation - IFE)",
    "nameEn": "Serum Immunofixation Electrophoresis",
    "category": "liver",
    "price": 580,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-84",
    "code": "LIV-19",
    "nameAr": "سلاسل كابا الحرة الخفيفة بالدم (Free Kappa Light Chains)",
    "nameEn": "Serum Free Kappa Light Chains Quantitative",
    "category": "liver",
    "price": 480,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-85",
    "code": "LIV-20",
    "nameAr": "سلاسل لامبدا الحرة الخفيفة بالدم (Free Lambda Light Chains)",
    "nameEn": "Serum Free Lambda Light Chains Quantitative",
    "category": "liver",
    "price": 480,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-86",
    "code": "LIV-21",
    "nameAr": "نسبة سلاسل كابا إلى لامبدا الحرة (Free Kappa/Lambda Ratio)",
    "nameEn": "Free Kappa / Lambda Ratio",
    "category": "liver",
    "price": 120,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-87",
    "code": "LIV-22",
    "nameAr": "الحديد في أنسجة ومصل الدم للكبد (Serum Hepatic Iron Index)",
    "nameEn": "Hepatic Iron Assessment",
    "category": "liver",
    "price": 260,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-88",
    "code": "LIV-23",
    "nameAr": "إنزيم 5-نوكليوتيداز (5-Nucleotidase - 5-NT)",
    "nameEn": "5-Nucleotidase Activity",
    "category": "liver",
    "price": 320,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-89",
    "code": "LIV-24",
    "nameAr": "إنزيم إيزوسيترات ديهيدروجينيز (Isocitrate Dehydrogenase - ICD)",
    "nameEn": "Isocitrate Dehydrogenase",
    "category": "liver",
    "price": 360,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-90",
    "code": "LIV-25",
    "nameAr": "حمض الهيالورونيك للتليف الكبدي (Hyaluronic Acid Fibrosis Marker)",
    "nameEn": "Serum Hyaluronic Acid Fibrosis Score",
    "category": "liver",
    "price": 550,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-91",
    "code": "KID-01",
    "nameAr": "كرياتينين الدم (Serum Creatinine)",
    "nameEn": "Serum Creatinine Enzymatic",
    "category": "kidney",
    "price": 90,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-92",
    "code": "KID-02",
    "nameAr": "بولينا الدم (Blood Urea / BUN)",
    "nameEn": "Blood Urea Nitrogen",
    "category": "kidney",
    "price": 90,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-93",
    "code": "KID-03",
    "nameAr": "حمض اليوريك / النقرس (Serum Uric Acid)",
    "nameEn": "Serum Uric Acid",
    "category": "kidney",
    "price": 90,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-94",
    "code": "KID-04",
    "nameAr": "معدل الترشيح الكبيبي المحسوب (eGFR by CKD-EPI)",
    "nameEn": "Estimated Glomerular Filtration Rate",
    "category": "kidney",
    "price": 60,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-95",
    "code": "KID-05",
    "nameAr": "الزلال الدقيق بالبول (Microalbuminuria ACR)",
    "nameEn": "Urine Albumin / Creatinine Ratio",
    "category": "kidney",
    "price": 180,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-96",
    "code": "KID-06",
    "nameAr": "بروتين البول في 24 ساعة (24-Hour Urine Protein)",
    "nameEn": "24-Hour Urine Total Protein",
    "category": "kidney",
    "price": 160,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-97",
    "code": "KID-07",
    "nameAr": "تصفية الكرياتينين في 24 ساعة (24-Hour Creatinine Clearance)",
    "nameEn": "Creatinine Clearance (Urine 24h + Serum Cr)",
    "category": "kidney",
    "price": 220,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-98",
    "code": "KID-08",
    "nameAr": "حمض اليوريك بالبول 24 ساعة (24-Hour Urine Uric Acid)",
    "nameEn": "24-Hour Urine Uric Acid",
    "category": "kidney",
    "price": 150,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-99",
    "code": "KID-09",
    "nameAr": "السيستاتين سي (Serum Cystatin C)",
    "nameEn": "Cystatin C Quantitative",
    "category": "kidney",
    "price": 380,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-100",
    "code": "KID-10",
    "nameAr": "بيتا 2 ميكروجلوبيولين في البول والدم (Beta-2 Microglobulin)",
    "nameEn": "Beta-2 Microglobulin Serum/Urine",
    "category": "kidney",
    "price": 290,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-101",
    "code": "KID-11",
    "nameAr": "وظائف كلى متكاملة (Kidney Profile)",
    "nameEn": "Kidney Function Panel",
    "category": "kidney",
    "price": 240,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-102",
    "code": "KID-12",
    "nameAr": "أسمولالية الدم (Serum Osmolality)",
    "nameEn": "Serum Osmolality by Freezing Point",
    "category": "kidney",
    "price": 260,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-103",
    "code": "KID-13",
    "nameAr": "أسمولالية البول (Urine Osmolality)",
    "nameEn": "Urine Osmolality",
    "category": "kidney",
    "price": 240,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-104",
    "code": "KID-14",
    "nameAr": "الكالسيوم في بول 24 ساعة (24-Hour Urine Calcium)",
    "nameEn": "24-Hour Urine Calcium",
    "category": "kidney",
    "price": 150,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-105",
    "code": "KID-15",
    "nameAr": "الفوسفور في بول 24 ساعة (24-Hour Urine Phosphorus)",
    "nameEn": "24-Hour Urine Phosphorus",
    "category": "kidney",
    "price": 150,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-106",
    "code": "KID-16",
    "nameAr": "الأوكسالات في بول 24 ساعة (24-Hour Urine Oxalate)",
    "nameEn": "24-Hour Urine Oxalate",
    "category": "kidney",
    "price": 320,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-107",
    "code": "KID-17",
    "nameAr": "السترات في بول 24 ساعة (24-Hour Urine Citrate)",
    "nameEn": "24-Hour Urine Citrate",
    "category": "kidney",
    "price": 340,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-108",
    "code": "KID-18",
    "nameAr": "الصوديوم في بول 24 ساعة (24-Hour Urine Sodium)",
    "nameEn": "24-Hour Urine Sodium",
    "category": "kidney",
    "price": 130,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-109",
    "code": "KID-19",
    "nameAr": "البوتاسيوم في بول 24 ساعة (24-Hour Urine Potassium)",
    "nameEn": "24-Hour Urine Potassium",
    "category": "kidney",
    "price": 130,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-110",
    "code": "KID-20",
    "nameAr": "الماغنسيوم في بول 24 ساعة (24-Hour Urine Magnesium)",
    "nameEn": "24-Hour Urine Magnesium",
    "category": "kidney",
    "price": 160,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-111",
    "code": "KID-21",
    "nameAr": "السيستين في البول النوعي والكمي (Urine Cystine Screen & Quantitative)",
    "nameEn": "Urine Cystine for Cystinuria",
    "category": "kidney",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-112",
    "code": "KID-22",
    "nameAr": "بروتين بنس جونس بالبول (Bence-Jones Protein Urine Screen)",
    "nameEn": "Bence-Jones Protein Heat Test & Electrophoresis",
    "category": "kidney",
    "price": 190,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-113",
    "code": "KID-23",
    "nameAr": "تفريد بروتينات البول الكهربائي (Urine Protein Electrophoresis - UPEP)",
    "nameEn": "Urine Protein Electrophoresis UPEP",
    "category": "kidney",
    "price": 290,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-114",
    "code": "KID-24",
    "nameAr": "التثبيت المناعي لبروتينات البول (Urine Immunofixation - U-IFE)",
    "nameEn": "Urine Immunofixation Electrophoresis",
    "category": "kidney",
    "price": 580,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-115",
    "code": "KID-25",
    "nameAr": "إنزيم N-أسيتيل غلوكوزامينيداز بالبول (Urine NAG - Renal Tubular Marker)",
    "nameEn": "Urine N-Acetyl-beta-D-Glucosaminidase",
    "category": "kidney",
    "price": 420,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-116",
    "code": "LIP-01",
    "nameAr": "الكوليسترول الكلي (Total Cholesterol)",
    "nameEn": "Total Cholesterol",
    "category": "lipids",
    "price": 90,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-117",
    "code": "LIP-02",
    "nameAr": "الدهون الثلاثية (Triglycerides)",
    "nameEn": "Triglycerides",
    "category": "lipids",
    "price": 100,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-118",
    "code": "LIP-03",
    "nameAr": "الكوليسترول عالي الكثافة / النافع (HDL Cholesterol)",
    "nameEn": "High Density Lipoprotein HDL",
    "category": "lipids",
    "price": 90,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-119",
    "code": "LIP-04",
    "nameAr": "الكوليسترول منخفض الكثافة / الضار (LDL Cholesterol Direct)",
    "nameEn": "Low Density Lipoprotein LDL Direct",
    "category": "lipids",
    "price": 110,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-120",
    "code": "LIP-05",
    "nameAr": "الكوليسترول شديد انخفاض الكثافة (VLDL Cholesterol)",
    "nameEn": "Very Low Density Lipoprotein VLDL",
    "category": "lipids",
    "price": 60,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-121",
    "code": "LIP-06",
    "nameAr": "ملف الدهون الشامل (Complete Lipid Profile)",
    "nameEn": "Complete Lipid Profile Full Panel",
    "category": "lipids",
    "price": 280,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-122",
    "code": "LIP-07",
    "nameAr": "أبوليبوبروتين أ1 (Apolipoprotein A1 - Apo A1)",
    "nameEn": "Apolipoprotein A1",
    "category": "lipids",
    "price": 240,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-123",
    "code": "LIP-08",
    "nameAr": "أبوليبوبروتين ب (Apolipoprotein B - Apo B)",
    "nameEn": "Apolipoprotein B",
    "category": "lipids",
    "price": 240,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-124",
    "code": "LIP-09",
    "nameAr": "البروتين الدهني أ (Lipoprotein a - Lp(a))",
    "nameEn": "Lipoprotein (a) High Sensitivity",
    "category": "lipids",
    "price": 380,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-125",
    "code": "LIP-10",
    "nameAr": "حمض الهوموسيستين (Homocysteine Quantitative)",
    "nameEn": "Serum Homocysteine",
    "category": "lipids",
    "price": 390,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-126",
    "code": "LIP-11",
    "nameAr": "نسبة الكوليسترول إلى HDL (Cholesterol / HDL Ratio)",
    "nameEn": "Cholesterol / HDL Ratio",
    "category": "lipids",
    "price": 40,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-127",
    "code": "LIP-12",
    "nameAr": "نسبة LDL إلى HDL (LDL / HDL Ratio)",
    "nameEn": "LDL / HDL Ratio",
    "category": "lipids",
    "price": 40,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-128",
    "code": "LIP-13",
    "nameAr": "الكوليسترول غير مرتفع الكثافة (Non-HDL Cholesterol)",
    "nameEn": "Non-HDL Cholesterol",
    "category": "lipids",
    "price": 40,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-129",
    "code": "LIP-14",
    "nameAr": "نسبة Apo B إلى Apo A1 (Apo B / Apo A1 Ratio)",
    "nameEn": "Apolipoprotein B / A1 Ratio",
    "category": "lipids",
    "price": 60,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-130",
    "code": "LIP-15",
    "nameAr": "أبوليبوبروتين هـ ونمطه الجيني (ApoE Genotyping)",
    "nameEn": "ApoE Genotyping for Alzheimer & Cardio Risk",
    "category": "lipids",
    "price": 850,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-131",
    "code": "LIP-16",
    "nameAr": "الأحماض الدهنية الحرة غير المؤسترة (Free Fatty Acids - NEFA)",
    "nameEn": "Non-Esterified Fatty Acids (NEFA)",
    "category": "lipids",
    "price": 350,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-132",
    "code": "LIP-17",
    "nameAr": "إنزيم الليباز البروتيني الدهني (Lipoprotein Lipase - LPL)",
    "nameEn": "Lipoprotein Lipase Activity",
    "category": "lipids",
    "price": 680,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-133",
    "code": "LIP-18",
    "nameAr": "الأوكسي كوليسترول المؤكسد (Oxidized LDL - Ox-LDL)",
    "nameEn": "Oxidized LDL ELISA",
    "category": "lipids",
    "price": 490,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-134",
    "code": "LIP-19",
    "nameAr": "الفوسفوليبيدات في مصل الدم (Serum Phospholipids)",
    "nameEn": "Serum Total Phospholipids",
    "category": "lipids",
    "price": 280,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-135",
    "code": "LIP-20",
    "nameAr": "ألفا توكوفيرول نسبة للدهون (Vitamin E / Total Lipids Ratio)",
    "nameEn": "Vitamin E / Lipids Ratio",
    "category": "lipids",
    "price": 580,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-136",
    "code": "CAR-01",
    "nameAr": "تروبونين عالي الحساسية (hs-Troponin I)",
    "nameEn": "High Sensitivity Troponin I",
    "category": "cardiac",
    "price": 380,
    "duration": "خلال 45 دقيقة",
    "active": true
  },
  {
    "id": "t-137",
    "code": "CAR-02",
    "nameAr": "تروبونين تي عالي الحساسية (hs-Troponin T)",
    "nameEn": "High Sensitivity Troponin T",
    "category": "cardiac",
    "price": 390,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-138",
    "code": "CAR-03",
    "nameAr": "إنزيم عضلة القلب (CK-MB Mass)",
    "nameEn": "Creatine Kinase-MB Mass",
    "category": "cardiac",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-139",
    "code": "CAR-04",
    "nameAr": "إنزيم الكرياتين كاينيز الكلي (Total CPK / CK)",
    "nameEn": "Creatine Kinase Total",
    "category": "cardiac",
    "price": 130,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-140",
    "code": "CAR-05",
    "nameAr": "الميوجلوبين (Myoglobin Quantitative)",
    "nameEn": "Serum Myoglobin",
    "category": "cardiac",
    "price": 240,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-141",
    "code": "CAR-06",
    "nameAr": "ببتيد الناتريوريتك الدماغي (NT-proBNP)",
    "nameEn": "NT-proBNP Heart Failure Marker",
    "category": "cardiac",
    "price": 680,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-142",
    "code": "CAR-07",
    "nameAr": "بي إن بي الببتيد الأذيني للقلب (BNP)",
    "nameEn": "BNP Peptide for Heart Failure",
    "category": "cardiac",
    "price": 650,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-143",
    "code": "CAR-08",
    "nameAr": "إنزيم الجلوتاميك أوكسالواسيتيك ترانس أمينيز القلبي (AST / SGOT Cardiac)",
    "nameEn": "AST Cardiac Fraction",
    "category": "cardiac",
    "price": 90,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-144",
    "code": "CAR-09",
    "nameAr": "إنزيم LDH الأيزوإنزيم 1 و 2 (LDH Isoenzymes 1 & 2)",
    "nameEn": "LDH Isoenzymes (Flipped Pattern)",
    "category": "cardiac",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-145",
    "code": "CAR-10",
    "nameAr": "بروتين المايلوبيروكسيداز القلبي (Cardiac Myeloperoxidase - MPO)",
    "nameEn": "Cardiac Myeloperoxidase",
    "category": "cardiac",
    "price": 550,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-146",
    "code": "CAR-11",
    "nameAr": "جالكتين 3 لتليف القلب (Galectin-3 Heart Failure & Fibrosis)",
    "nameEn": "Galectin-3 for Cardiac Fibrosis",
    "category": "cardiac",
    "price": 720,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-147",
    "code": "CAR-12",
    "nameAr": "عامل تمايز النمو 15 (GDF-15 Cardiovascular Marker)",
    "nameEn": "Growth Differentiation Factor 15",
    "category": "cardiac",
    "price": 750,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-148",
    "code": "CAR-13",
    "nameAr": "الأحماض الدهنية المرتبطة ببروتين القلب (H-FABP)",
    "nameEn": "Heart-type Fatty Acid-Binding Protein",
    "category": "cardiac",
    "price": 590,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-149",
    "code": "CAR-14",
    "nameAr": "بروتين سي التفاعلي فائق الحساسية التاجي (Cardiac hs-CRP)",
    "nameEn": "Cardiac High Sensitivity CRP",
    "category": "cardiac",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-150",
    "code": "CAR-15",
    "nameAr": "إنزيم الفوسفوليباز A2 المصاحب للبروتين الدهني (Lp-PLA2 / PLAC Test)",
    "nameEn": "Lp-PLA2 Plaque Instability Activity",
    "category": "cardiac",
    "price": 850,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-151",
    "code": "DIA-01",
    "nameAr": "سكر الدم الصائم (Fasting Blood Sugar - FBS)",
    "nameEn": "Fasting Blood Glucose",
    "category": "diabetes",
    "price": 70,
    "duration": "خلال 45 دقيقة",
    "active": true
  },
  {
    "id": "t-152",
    "code": "DIA-02",
    "nameAr": "سكر الدم الفاطر بساعتين (Post Prandial - 2hr PP)",
    "nameEn": "2-Hour Postprandial Blood Glucose",
    "category": "diabetes",
    "price": 70,
    "duration": "خلال 45 دقيقة",
    "active": true
  },
  {
    "id": "t-153",
    "code": "DIA-03",
    "nameAr": "سكر الدم العشوائي (Random Blood Sugar - RBS)",
    "nameEn": "Random Blood Glucose",
    "category": "diabetes",
    "price": 60,
    "duration": "خلال 30 دقيقة",
    "active": true
  },
  {
    "id": "t-154",
    "code": "DIA-04",
    "nameAr": "السكر التراكمي (HbA1c - Glycated Hemoglobin)",
    "nameEn": "Hemoglobin A1c (NGSP Certified)",
    "category": "diabetes",
    "price": 190,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-155",
    "code": "DIA-05",
    "nameAr": "إنسولين الدم الصائم (Fasting Serum Insulin)",
    "nameEn": "Fasting Serum Insulin by ECLIA",
    "category": "diabetes",
    "price": 240,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-156",
    "code": "DIA-06",
    "nameAr": "مؤشر مقاومة الإنسولين (HOMA-IR Index)",
    "nameEn": "HOMA-IR Calculation",
    "category": "diabetes",
    "price": 290,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-157",
    "code": "DIA-07",
    "nameAr": "سي ببتيد الصائم (Fasting C-Peptide)",
    "nameEn": "Fasting C-Peptide",
    "category": "diabetes",
    "price": 260,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-158",
    "code": "DIA-08",
    "nameAr": "سي ببتيد بعد الأكل بساعتين (Postprandial C-Peptide)",
    "nameEn": "Postprandial C-Peptide",
    "category": "diabetes",
    "price": 260,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-159",
    "code": "DIA-09",
    "nameAr": "منحنى السكر بالدم (OGTT 75g - 3 samples)",
    "nameEn": "Oral Glucose Tolerance Test 75g (3 samples)",
    "category": "diabetes",
    "price": 220,
    "duration": "خلال 3 ساعات",
    "active": true
  },
  {
    "id": "t-160",
    "code": "DIA-10",
    "nameAr": "منحنى السكر للحوامل (OGTT 100g Pregnancy 4 points)",
    "nameEn": "OGTT 100g Pregnancy 4 points",
    "category": "diabetes",
    "price": 280,
    "duration": "خلال 4 ساعات",
    "active": true
  },
  {
    "id": "t-161",
    "code": "DIA-11",
    "nameAr": "الفركتوزامين (Serum Fructosamine)",
    "nameEn": "Serum Fructosamine",
    "category": "diabetes",
    "price": 220,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-162",
    "code": "DIA-12",
    "nameAr": "الأجسام المضادة للغلوتامات ديكاربوكسيلاز (Anti-GAD Antibodies)",
    "nameEn": "Glutamic Acid Decarboxylase Autoantibodies",
    "category": "diabetes",
    "price": 550,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-163",
    "code": "DIA-13",
    "nameAr": "الأجسام المضادة لخلايا جزر البنكرياس (Islet Cell Antibodies - ICA)",
    "nameEn": "Islet Cell Antibodies",
    "category": "diabetes",
    "price": 520,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-164",
    "code": "DIA-14",
    "nameAr": "الكيتونات في الدم كمي (Blood Beta-Hydroxybutyrate)",
    "nameEn": "Beta-Hydroxybutyrate Quantitative",
    "category": "diabetes",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-165",
    "code": "DIA-15",
    "nameAr": "اللاكتات في الدم (Blood Lactic Acid)",
    "nameEn": "Plasma Lactate (Sodium Fluoride on Ice)",
    "category": "diabetes",
    "price": 220,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-166",
    "code": "DIA-16",
    "nameAr": "إنسولين ما بعد الأكل بساعتين (Postprandial Insulin)",
    "nameEn": "2-Hour Postprandial Insulin",
    "category": "diabetes",
    "price": 240,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-167",
    "code": "DIA-17",
    "nameAr": "الأجسام المضادة لبروتين التيروزين فوسفاتاز 2 (Anti-IA2 Antibodies)",
    "nameEn": "Islet Antigen 2 (IA-2) Autoantibodies",
    "category": "diabetes",
    "price": 580,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-168",
    "code": "DIA-18",
    "nameAr": "البروإنسولين السليم بالدم (Intact Proinsulin)",
    "nameEn": "Intact Proinsulin by Chemiluminescence",
    "category": "diabetes",
    "price": 590,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-169",
    "code": "DIA-19",
    "nameAr": "الأحماض الأمينية متفرعة السلسلة (BCAA)",
    "nameEn": "Branched-Chain Amino Acids HPLC",
    "category": "diabetes",
    "price": 780,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-170",
    "code": "DIA-20",
    "nameAr": "الأديبونيكتين (Serum Adiponectin)",
    "nameEn": "Serum Adiponectin by ELISA",
    "category": "diabetes",
    "price": 490,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-171",
    "code": "THY-01",
    "nameAr": "الهرمون المنشط للغدة الدرقية (TSH)",
    "nameEn": "Thyroid Stimulating Hormone Ultrasensitive",
    "category": "thyroid",
    "price": 160,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-172",
    "code": "THY-02",
    "nameAr": "الثيروكسين الحر (Free T4)",
    "nameEn": "Free Thyroxine (FT4)",
    "category": "thyroid",
    "price": 170,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-173",
    "code": "THY-03",
    "nameAr": "ثلاثي يود الثيرونين الحر (Free T3)",
    "nameEn": "Free Triiodothyronine (FT3)",
    "category": "thyroid",
    "price": 170,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-174",
    "code": "THY-04",
    "nameAr": "الثيروكسين الكلي (Total T4)",
    "nameEn": "Total Thyroxine (TT4)",
    "category": "thyroid",
    "price": 150,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-175",
    "code": "THY-05",
    "nameAr": "ثلاثي يود الثيرونين الكلي (Total T3)",
    "nameEn": "Total Triiodothyronine (TT3)",
    "category": "thyroid",
    "price": 150,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-176",
    "code": "THY-06",
    "nameAr": "الأجسام المضادة لبيروكسيداز الدرقية (Anti-TPO)",
    "nameEn": "Anti-Thyroid Peroxidase Antibodies",
    "category": "thyroid",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-177",
    "code": "THY-07",
    "nameAr": "الأجسام المضادة للثيروجلوبيولين (Anti-TG)",
    "nameEn": "Anti-Thyroglobulin Antibodies",
    "category": "thyroid",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-178",
    "code": "THY-08",
    "nameAr": "الثيروجلوبيولين كمي (Serum Thyroglobulin - Tg)",
    "nameEn": "Thyroglobulin Quantitative",
    "category": "thyroid",
    "price": 380,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-179",
    "code": "THY-09",
    "nameAr": "الأجسام المضادة لمستقبلات TSH (TRAb / TSI)",
    "nameEn": "TSH Receptor Antibodies",
    "category": "thyroid",
    "price": 550,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-180",
    "code": "THY-10",
    "nameAr": "الجلوبيولين الرابط للثيروكسين (TBG)",
    "nameEn": "Thyroxine-Binding Globulin",
    "category": "thyroid",
    "price": 360,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-181",
    "code": "THY-11",
    "nameAr": "T3 العكسي (Reverse T3 - rT3)",
    "nameEn": "Reverse Triiodothyronine",
    "category": "thyroid",
    "price": 650,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-182",
    "code": "THY-12",
    "nameAr": "فحص الغدة الدرقية المتكامل (TSH + FT3 + FT4)",
    "nameEn": "Complete Thyroid Profile",
    "category": "thyroid",
    "price": 450,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-183",
    "code": "THY-13",
    "nameAr": "فحص المناعة الدرقية الشامل (Anti-TPO + Anti-TG)",
    "nameEn": "Thyroid Autoimmune Panel",
    "category": "thyroid",
    "price": 590,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-184",
    "code": "THY-14",
    "nameAr": "مؤشر الثيروكسين الحر المحسوب (Free Thyroxine Index - FTI)",
    "nameEn": "Free Thyroxine Index (T7)",
    "category": "thyroid",
    "price": 180,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-185",
    "code": "THY-15",
    "nameAr": "اختبار التقاط هرمون الغدة الدرقية (T-Uptake / Thyroid Binding Ratio)",
    "nameEn": "Thyroid Uptake / T-Uptake",
    "category": "thyroid",
    "price": 160,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-186",
    "code": "THY-16",
    "nameAr": "كالسيتونين الغدة الدرقية (Calcitonin)",
    "nameEn": "Serum Calcitonin Ultrasensitive",
    "category": "thyroid",
    "price": 420,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-187",
    "code": "THY-17",
    "nameAr": "الهرمون المنبه لإفراز الدرقية (TRH Stimulation Test - 3 samples)",
    "nameEn": "TRH Stimulation Protocol (0, 20, 60 min)",
    "category": "thyroid",
    "price": 550,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-188",
    "code": "THY-18",
    "nameAr": "الأجسام المضادة لـ T3 و T4 الذاتية (Anti-T3 & Anti-T4 Autoantibodies)",
    "nameEn": "Thyroid Hormone Autoantibodies",
    "category": "thyroid",
    "price": 480,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-189",
    "code": "HOR-01",
    "nameAr": "هرمون التستوستيرون الكلي للذكور (Total Testosterone)",
    "nameEn": "Total Testosterone by ECLIA",
    "category": "hormones",
    "price": 240,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-190",
    "code": "HOR-02",
    "nameAr": "هرمون التستوستيرون الحر (Free Testosterone)",
    "nameEn": "Free Testosterone ELISA/RIA",
    "category": "hormones",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-191",
    "code": "HOR-03",
    "nameAr": "هرمون التستوستيرون الحيوي المتاح (Bioavailable Testosterone)",
    "nameEn": "Bioavailable Testosterone Calculation",
    "category": "hormones",
    "price": 350,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-192",
    "code": "HOR-04",
    "nameAr": "هرمون البرولاكتين / هرمون الحليب (Prolactin)",
    "nameEn": "Serum Prolactin by ECLIA",
    "category": "hormones",
    "price": 200,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-193",
    "code": "HOR-05",
    "nameAr": "هرمون البرولاكتين الجزئي الضخم (Macroprolactin)",
    "nameEn": "Macroprolactin PEG Precipitation",
    "category": "hormones",
    "price": 360,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-194",
    "code": "HOR-06",
    "nameAr": "هرمون إف إس إتش (FSH - Follicle Stimulating Hormone)",
    "nameEn": "FSH by ECLIA",
    "category": "hormones",
    "price": 190,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-195",
    "code": "HOR-07",
    "nameAr": "هرمون إل إتش (LH - Luteinizing Hormone)",
    "nameEn": "LH by ECLIA",
    "category": "hormones",
    "price": 190,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-196",
    "code": "HOR-08",
    "nameAr": "هرمون الاستراديول (Estradiol E2)",
    "nameEn": "Serum Estradiol (E2)",
    "category": "hormones",
    "price": 210,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-197",
    "code": "HOR-09",
    "nameAr": "هرمون البروجسترون (Progesterone Day 21)",
    "nameEn": "Progesterone (Mid-Luteal Day 21)",
    "category": "hormones",
    "price": 210,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-198",
    "code": "HOR-10",
    "nameAr": "هرمون مخزون المبيض (AMH - Anti-Müllerian Hormone)",
    "nameEn": "Anti-Müllerian Hormone Gen II",
    "category": "hormones",
    "price": 480,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-199",
    "code": "HOR-11",
    "nameAr": "هرمون دي هيدرو إيبي أندروستيرون سلفات (DHEA-S)",
    "nameEn": "Dehydroepiandrosterone Sulfate",
    "category": "hormones",
    "price": 280,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-200",
    "code": "HOR-12",
    "nameAr": "الأندروستينديون (Androstenedione)",
    "nameEn": "Serum Androstenedione",
    "category": "hormones",
    "price": 350,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-201",
    "code": "HOR-13",
    "nameAr": "17-هيدروكسي بروجسترون (17-OH Progesterone)",
    "nameEn": "17-Hydroxyprogesterone by LC-MS/MS or RIA",
    "category": "hormones",
    "price": 380,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-202",
    "code": "HOR-14",
    "nameAr": "الجلوبيولين الرابط للهرمونات الجنسية (SHBG)",
    "nameEn": "Sex Hormone-Binding Globulin",
    "category": "hormones",
    "price": 310,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-203",
    "code": "HOR-15",
    "nameAr": "الداي هيدروتستوستيرون (Dihydrotestosterone - DHT)",
    "nameEn": "Dihydrotestosterone by HPLC/EIA",
    "category": "hormones",
    "price": 520,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-204",
    "code": "HOR-16",
    "nameAr": "هرمون الكورتيزول الصباحي (Cortisol Morning 8 AM)",
    "nameEn": "Morning Serum Cortisol (8:00 AM)",
    "category": "hormones",
    "price": 240,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-205",
    "code": "HOR-17",
    "nameAr": "هرمون الكورتيزول المسائي (Cortisol Evening 4-8 PM)",
    "nameEn": "Evening Serum Cortisol",
    "category": "hormones",
    "price": 240,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-206",
    "code": "HOR-18",
    "nameAr": "الكورتيزول الحر في البول 24 ساعة (24-Hour Urine Free Cortisol)",
    "nameEn": "24-Hour Urine Free Cortisol",
    "category": "hormones",
    "price": 380,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-207",
    "code": "HOR-19",
    "nameAr": "الهرمون الموجه لقشر الكظر (ACTH Plasma)",
    "nameEn": "Adrenocorticotropic Hormone (EDTA on Ice)",
    "category": "hormones",
    "price": 380,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-208",
    "code": "HOR-20",
    "nameAr": "هرمون النمو (Growth Hormone - GH Fasting)",
    "nameEn": "Fasting Growth Hormone",
    "category": "hormones",
    "price": 260,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-209",
    "code": "HOR-21",
    "nameAr": "عامل النمو شبيه الإنسولين 1 (IGF-1 / Somatomedin C)",
    "nameEn": "Insulin-like Growth Factor 1",
    "category": "hormones",
    "price": 460,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-210",
    "code": "HOR-22",
    "nameAr": "البروتين الرابط لعامل النمو 3 (IGFBP-3)",
    "nameEn": "IGF-Binding Protein 3",
    "category": "hormones",
    "price": 490,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-211",
    "code": "HOR-23",
    "nameAr": "هرمون الغدة الجار درقية السليم (PTH Intact Molecule)",
    "nameEn": "Intact Parathyroid Hormone (iPTH)",
    "category": "hormones",
    "price": 340,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-212",
    "code": "HOR-24",
    "nameAr": "هرمون الألدوستيرون في الدم (Serum Aldosterone)",
    "nameEn": "Serum Aldosterone (Upright/Supine)",
    "category": "hormones",
    "price": 440,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-213",
    "code": "HOR-25",
    "nameAr": "نشاط الرينين في البلازما (Plasma Renin Activity - PRA)",
    "nameEn": "Plasma Renin Activity",
    "category": "hormones",
    "price": 460,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-214",
    "code": "HOR-26",
    "nameAr": "هرمون الحمل الرقمي الكمي (Beta-HCG Quantitative)",
    "nameEn": "Total Beta-HCG Quantitative",
    "category": "hormones",
    "price": 190,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-215",
    "code": "HOR-27",
    "nameAr": "هرمون الحمل النوعي السريع (Beta-HCG Qualitative)",
    "nameEn": "Pregnancy Rapid Test Urine/Serum",
    "category": "hormones",
    "price": 60,
    "duration": "خلال 20 دقيقة",
    "active": true
  },
  {
    "id": "t-216",
    "code": "HOR-28",
    "nameAr": "الهرمون المضاد لإدرار البول / الفازوبريسين (ADH / Vasopressin)",
    "nameEn": "Antidiuretic Hormone",
    "category": "hormones",
    "price": 580,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-217",
    "code": "HOR-29",
    "nameAr": "هرمون الجاسترين (Serum Gastrin Fasting)",
    "nameEn": "Serum Gastrin",
    "category": "hormones",
    "price": 390,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-218",
    "code": "HOR-30",
    "nameAr": "الإسترون (Estrone - E1)",
    "nameEn": "Serum Estrone by LC-MS/MS",
    "category": "hormones",
    "price": 460,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-219",
    "code": "HOR-31",
    "nameAr": "الإستريول غير المقترن للحوامل (Free Estriol - uE3)",
    "nameEn": "Unconjugated Estriol (uE3)",
    "category": "hormones",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-220",
    "code": "HOR-32",
    "nameAr": "البروتين البلازمي A المصاحب للحمل (PAPP-A for First Trimester Screen)",
    "nameEn": "Pregnancy-Associated Plasma Protein A",
    "category": "hormones",
    "price": 450,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-221",
    "code": "HOR-33",
    "nameAr": "هرمون المشيمة البشري اللاكتوجيني (Human Placental Lactogen - HPL)",
    "nameEn": "Human Placental Lactogen",
    "category": "hormones",
    "price": 390,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-222",
    "code": "HOR-34",
    "nameAr": "البروتين ألفا فيتوبروتين للأجنة (Maternal Serum AFP)",
    "nameEn": "Maternal Serum AFP (15-20 weeks)",
    "category": "hormones",
    "price": 280,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-223",
    "code": "HOR-35",
    "nameAr": "هرمون الإنهيبين ب (Inhibin B)",
    "nameEn": "Serum Inhibin B by ELISA",
    "category": "hormones",
    "price": 620,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-224",
    "code": "HOR-36",
    "nameAr": "هرمون الإنهيبين أ (Inhibin A for Quad Screen)",
    "nameEn": "Inhibin A for Quadruple Test",
    "category": "hormones",
    "price": 580,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-225",
    "code": "HOR-37",
    "nameAr": "هرمون الميلاتونين (Serum / Saliva Melatonin)",
    "nameEn": "Melatonin Level by RIA",
    "category": "hormones",
    "price": 550,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-226",
    "code": "HOR-38",
    "nameAr": "الأوكسيتوسين / هرمون الولادة والحب (Serum Oxytocin)",
    "nameEn": "Serum Oxytocin by ELISA",
    "category": "hormones",
    "price": 590,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-227",
    "code": "HOR-39",
    "nameAr": "هرمون اللبتين الحر والبروتين الرابط (Free Leptin Index)",
    "nameEn": "Free Leptin Index Calculation",
    "category": "hormones",
    "price": 580,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-228",
    "code": "HOR-40",
    "nameAr": "الهرمون المفرز لموجهة الغدد التناسلية (GnRH Stimulation Protocol)",
    "nameEn": "GnRH Stimulation Test (4 samples)",
    "category": "hormones",
    "price": 680,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-229",
    "code": "HOR-41",
    "nameAr": "اختبار تثبيط الديكساميثازون للكورتيزول (Dexamethasone Suppression 1mg)",
    "nameEn": "Overnight Dexamethasone Suppression Test",
    "category": "hormones",
    "price": 280,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-230",
    "code": "HOR-42",
    "nameAr": "اختبار تحفيز الغدة النخامية بالأنسولين (Insulin Tolerance Test - ITT)",
    "nameEn": "Insulin Tolerance Test",
    "category": "hormones",
    "price": 980,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-231",
    "code": "HOR-43",
    "nameAr": "هرمون التستوستيرون في اللعاب (Salivary Testosterone)",
    "nameEn": "Salivary Free Testosterone by LC-MS",
    "category": "hormones",
    "price": 450,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-232",
    "code": "HOR-44",
    "nameAr": "الكورتيزول في اللعاب الليلي (Late-Night Salivary Cortisol)",
    "nameEn": "Late-Night Salivary Cortisol (11:00 PM)",
    "category": "hormones",
    "price": 340,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-233",
    "code": "HOR-45",
    "nameAr": "الأجسام المضادة للهرمونات الموجهة للغدد (Anti-Pituitary Antibodies)",
    "nameEn": "Anti-Pituitary Autoantibodies",
    "category": "hormones",
    "price": 750,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-234",
    "code": "VIT-01",
    "nameAr": "فيتامين د3 الكلي (Vitamin D3 - 25-Hydroxy Total)",
    "nameEn": "Vitamin D 25-OH Total by CLIA/HPLC",
    "category": "vitamins",
    "price": 380,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-235",
    "code": "VIT-02",
    "nameAr": "فيتامين ب12 (Vitamin B12 - Cyanocobalamin)",
    "nameEn": "Vitamin B12 Quantitative",
    "category": "vitamins",
    "price": 350,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-236",
    "code": "VIT-03",
    "nameAr": "حمض الفوليك بالدم (Serum Folic Acid / Folate)",
    "nameEn": "Serum Folate by CLIA",
    "category": "vitamins",
    "price": 320,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-237",
    "code": "VIT-04",
    "nameAr": "حمض الفوليك داخل كرات الدم الحمراء (RBC Folate)",
    "nameEn": "Red Blood Cell Folate (Hemolysate)",
    "category": "vitamins",
    "price": 480,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-238",
    "code": "VIT-05",
    "nameAr": "مخزون الحديد بالجسم (Serum Ferritin)",
    "nameEn": "Serum Ferritin by Chemiluminescence",
    "category": "vitamins",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-239",
    "code": "VIT-06",
    "nameAr": "الحديد في الدم والسعة الكلية (Serum Iron & TIBC)",
    "nameEn": "Serum Iron & Total Iron Binding Capacity",
    "category": "vitamins",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-240",
    "code": "VIT-07",
    "nameAr": "نسبة تشبع الترانسفيرين المحسوبة (Transferrin Saturation %)",
    "nameEn": "Transferrin Saturation Index",
    "category": "vitamins",
    "price": 70,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-241",
    "code": "VIT-08",
    "nameAr": "الترانسفيرين كمي (Serum Transferrin Quantitative)",
    "nameEn": "Serum Transferrin",
    "category": "vitamins",
    "price": 220,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-242",
    "code": "VIT-09",
    "nameAr": "مستقبلات الترانسفيرين الذائبة (Soluble Transferrin Receptor - sTfR)",
    "nameEn": "Soluble Transferrin Receptor",
    "category": "vitamins",
    "price": 520,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-243",
    "code": "VIT-10",
    "nameAr": "فيتامين أ في الدم (Vitamin A - Retinol)",
    "nameEn": "Vitamin A (Retinol) by HPLC",
    "category": "vitamins",
    "price": 550,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-244",
    "code": "VIT-11",
    "nameAr": "فيتامين هـ (Vitamin E - Alpha-Tocopherol)",
    "nameEn": "Vitamin E (Tocopherol) by HPLC",
    "category": "vitamins",
    "price": 550,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-245",
    "code": "VIT-12",
    "nameAr": "فيتامين سي (Vitamin C - Ascorbic Acid)",
    "nameEn": "Vitamin C (Ascorbic Acid) by HPLC",
    "category": "vitamins",
    "price": 480,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-246",
    "code": "VIT-13",
    "nameAr": "فيتامين ب1 / الثيامين (Vitamin B1 - Thiamine Pyrophosphate)",
    "nameEn": "Vitamin B1 (Thiamine) Whole Blood HPLC",
    "category": "vitamins",
    "price": 620,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-247",
    "code": "VIT-14",
    "nameAr": "فيتامين ب6 / البيريدوكسين (Vitamin B6 - Pyridoxal 5-Phosphate)",
    "nameEn": "Vitamin B6 (PLP) by HPLC",
    "category": "vitamins",
    "price": 590,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-248",
    "code": "VIT-15",
    "nameAr": "فيتامين ب2 / الريبوفلافين (Vitamin B2 - Riboflavin)",
    "nameEn": "Vitamin B2 by HPLC",
    "category": "vitamins",
    "price": 580,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-249",
    "code": "VIT-16",
    "nameAr": "فيتامين ب5 / حمض البانتوثينيك (Vitamin B5 - Pantothenic Acid)",
    "nameEn": "Vitamin B5 by LC-MS/MS",
    "category": "vitamins",
    "price": 650,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-250",
    "code": "VIT-17",
    "nameAr": "فيتامين ب7 / البيوتين (Vitamin B7 - Biotin)",
    "nameEn": "Serum Biotin (Vitamin H/B7)",
    "category": "vitamins",
    "price": 580,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-251",
    "code": "VIT-18",
    "nameAr": "فيتامين ك1 (Vitamin K1 - Phylloquinone)",
    "nameEn": "Vitamin K1 by HPLC",
    "category": "vitamins",
    "price": 680,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-252",
    "code": "VIT-19",
    "nameAr": "الكالسيوم الكلي في الدم (Total Serum Calcium)",
    "nameEn": "Total Calcium Arsenazo/CPC",
    "category": "vitamins",
    "price": 90,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-253",
    "code": "VIT-20",
    "nameAr": "الكالسيوم الأيوني الحر (Ionized Calcium Direct ISE)",
    "nameEn": "Ionized Calcium by ISE (pH adjusted)",
    "category": "vitamins",
    "price": 120,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-254",
    "code": "VIT-21",
    "nameAr": "المغنيسيوم في الدم (Serum Magnesium)",
    "nameEn": "Serum Magnesium Xylidyl Blue",
    "category": "vitamins",
    "price": 110,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-255",
    "code": "VIT-22",
    "nameAr": "المغنيسيوم داخل كرات الدم الحمراء (RBC Magnesium)",
    "nameEn": "Intra-erythrocytic Magnesium",
    "category": "vitamins",
    "price": 420,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-256",
    "code": "VIT-23",
    "nameAr": "الفوسفور غير العضوي (Serum Inorganic Phosphorus)",
    "nameEn": "Serum Inorganic Phosphorus Phosphomolybdate",
    "category": "vitamins",
    "price": 90,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-257",
    "code": "VIT-24",
    "nameAr": "الصوديوم في الدم (Serum Sodium - Na+)",
    "nameEn": "Serum Sodium by ISE Direct",
    "category": "vitamins",
    "price": 85,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-258",
    "code": "VIT-25",
    "nameAr": "البوتاسيوم في الدم (Serum Potassium - K+)",
    "nameEn": "Serum Potassium by ISE Direct",
    "category": "vitamins",
    "price": 85,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-259",
    "code": "VIT-26",
    "nameAr": "الكلوريد في الدم (Serum Chloride - Cl-)",
    "nameEn": "Serum Chloride by ISE",
    "category": "vitamins",
    "price": 85,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-260",
    "code": "VIT-27",
    "nameAr": "الأملاح والمعادن بالدم (Electrolytes Panel Na / K / Cl)",
    "nameEn": "Electrolytes Panel (Na, K, Cl)",
    "category": "vitamins",
    "price": 180,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-261",
    "code": "VIT-28",
    "nameAr": "بيكربونات الدم / ثاني أكسيد الكربون الكلي (Serum Bicarbonate / CO2)",
    "nameEn": "Total Bicarbonate (HCO3) / CO2",
    "category": "vitamins",
    "price": 120,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-262",
    "code": "VIT-29",
    "nameAr": "الزنك في الدم (Serum Zinc Trace Element)",
    "nameEn": "Serum Zinc by Atomic Absorption/ICP-MS",
    "category": "vitamins",
    "price": 290,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-263",
    "code": "VIT-30",
    "nameAr": "النحاس في الدم (Serum Copper Trace Element)",
    "nameEn": "Serum Copper by ICP-MS",
    "category": "vitamins",
    "price": 290,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-264",
    "code": "VIT-31",
    "nameAr": "النحاس في بول 24 ساعة (24-Hour Urine Copper)",
    "nameEn": "24-Hour Urine Copper Quantitative",
    "category": "vitamins",
    "price": 360,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-265",
    "code": "VIT-32",
    "nameAr": "السيلينيوم في الدم (Serum Selenium)",
    "nameEn": "Serum Selenium by ICP-MS",
    "category": "vitamins",
    "price": 380,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-266",
    "code": "VIT-33",
    "nameAr": "الكروم في الدم (Serum Chromium)",
    "nameEn": "Serum Chromium by ICP-MS",
    "category": "vitamins",
    "price": 440,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-267",
    "code": "VIT-34",
    "nameAr": "المنجنيز في الدم (Blood Manganese)",
    "nameEn": "Whole Blood Manganese by ICP-MS",
    "category": "vitamins",
    "price": 440,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-268",
    "code": "VIT-35",
    "nameAr": "الرصاص في الدم للأطفال والكبار (Blood Lead Level - BLL)",
    "nameEn": "Blood Lead Level Quantitative by ICP-MS",
    "category": "vitamins",
    "price": 320,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-269",
    "code": "VIT-36",
    "nameAr": "الزئبق في الدم والبول (Blood / Urine Mercury)",
    "nameEn": "Mercury Quantitative by ICP-MS",
    "category": "vitamins",
    "price": 420,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-270",
    "code": "VIT-37",
    "nameAr": "الزرنيخ في الدم والبول (Arsenic Heavy Metal)",
    "nameEn": "Arsenic Level by ICP-MS",
    "category": "vitamins",
    "price": 440,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-271",
    "code": "VIT-38",
    "nameAr": "الكادميوم في الدم (Blood Cadmium)",
    "nameEn": "Blood Cadmium by ICP-MS",
    "category": "vitamins",
    "price": 420,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-272",
    "code": "VIT-39",
    "nameAr": "لوحة المعادن الثقيلة والسموم الشاملة (Heavy Metals Panel: 4 Metals)",
    "nameEn": "Comprehensive Heavy Metals Panel (Lead, Mercury, Arsenic, Cadmium)",
    "category": "vitamins",
    "price": 990,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-273",
    "code": "VIT-40",
    "nameAr": "فيتامين ب المركب الشامل (B-Complex Panel: B1, B2, B6, B12, Folate)",
    "nameEn": "B-Complex Profile by HPLC & CLIA",
    "category": "vitamins",
    "price": 1250,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-274",
    "code": "IMM-01",
    "nameAr": "بروتين سي التفاعلي الكمي (CRP Quantitative Turbidimetric)",
    "nameEn": "C-Reactive Protein Quantitative",
    "category": "immunology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-275",
    "code": "IMM-02",
    "nameAr": "سي آر بي عالي الحساسية للقلب والشرايين (hs-CRP Cardiac)",
    "nameEn": "High Sensitivity CRP for Cardiovascular Risk",
    "category": "immunology",
    "price": 220,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-276",
    "code": "IMM-03",
    "nameAr": "عامل الروماتويد الكمي (Rheumatoid Factor - RF Quantitative)",
    "nameEn": "Rheumatoid Factor Quantitative",
    "category": "immunology",
    "price": 140,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-277",
    "code": "IMM-04",
    "nameAr": "الأجسام المضادة لسيترولين الببتيد الحلقي (Anti-CCP Antibodies)",
    "nameEn": "Anti-Cyclic Citrullinated Peptide IgG (Anti-CCP)",
    "category": "immunology",
    "price": 380,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-278",
    "code": "IMM-05",
    "nameAr": "الأجسام المضادة للنواة بالفلورسين المخفف (ANA by IFA on HEp-2 cells)",
    "nameEn": "Antinuclear Antibodies by IFA (Titer & Pattern)",
    "category": "immunology",
    "price": 340,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-279",
    "code": "IMM-06",
    "nameAr": "الأجسام المضادة للحمض النووي ثنائي الخيط (Anti-dsDNA Quantitative)",
    "nameEn": "Anti-Double Stranded DNA Quantitative (CLIA/IFA)",
    "category": "immunology",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-280",
    "code": "IMM-07",
    "nameAr": "لوحة مستضدات النواة القابلة للاستخلاص الشاملة (ENA 14 Profile Full Blot)",
    "nameEn": "Extractable Nuclear Antigen Profile (14 Autoantibodies)",
    "category": "immunology",
    "price": 850,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-281",
    "code": "IMM-08",
    "nameAr": "الأجسام المضادة لمستضد سميث (Anti-Smith Antibodies - Anti-Sm)",
    "nameEn": "Anti-Smith (Sm) Antibodies",
    "category": "immunology",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-282",
    "code": "IMM-09",
    "nameAr": "الأجسام المضادة لـ RNP (Anti-U1-RNP Antibodies)",
    "nameEn": "Anti-RNP Antibodies Quantitative",
    "category": "immunology",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-283",
    "code": "IMM-10",
    "nameAr": "الأجسام المضادة لـ SSA / Ro (Anti-SSA / Ro-60 & Ro-52)",
    "nameEn": "Anti-SSA (Ro) Antibodies",
    "category": "immunology",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-284",
    "code": "IMM-11",
    "nameAr": "الأجسام المضادة لـ SSB / La (Anti-SSB / La Antibodies)",
    "nameEn": "Anti-SSB (La) Antibodies",
    "category": "immunology",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-285",
    "code": "IMM-12",
    "nameAr": "الأجسام المضادة لـ Scl-70 لتصلب الجلد (Anti-Scl-70 / Topoisomerase I)",
    "nameEn": "Anti-Scl-70 Antibodies",
    "category": "immunology",
    "price": 360,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-286",
    "code": "IMM-13",
    "nameAr": "الأجسام المضادة لـ Jo-1 لالتهاب العضلات (Anti-Jo-1 Histidyl-tRNA)",
    "nameEn": "Anti-Jo-1 Antibodies",
    "category": "immunology",
    "price": 360,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-287",
    "code": "IMM-14",
    "nameAr": "الأجسام المضادة لسنترومير الكروموسوم (Anti-Centromere Antibodies - ACA)",
    "nameEn": "Anti-Centromere Antibodies (CREST Syndrome)",
    "category": "immunology",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-288",
    "code": "IMM-15",
    "nameAr": "الأجسام المضادة للهستونات (Anti-Histone Antibodies)",
    "nameEn": "Anti-Histone Antibodies",
    "category": "immunology",
    "price": 360,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-289",
    "code": "IMM-16",
    "nameAr": "الأجسام المضادة لسيتوبلازم العدلات (ANCA Screen c-ANCA & p-ANCA by IFA)",
    "nameEn": "ANCA Screening by IFA (c-ANCA & p-ANCA)",
    "category": "immunology",
    "price": 420,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-290",
    "code": "IMM-17",
    "nameAr": "مضادات بروتيناز 3 كمي (Anti-PR3 / c-ANCA Quantitative)",
    "nameEn": "Anti-Proteinase 3 (PR3) Quantitative",
    "category": "immunology",
    "price": 380,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-291",
    "code": "IMM-18",
    "nameAr": "مضادات المايلوبيروكسيداز كمي (Anti-MPO / p-ANCA Quantitative)",
    "nameEn": "Anti-Myeloperoxidase (MPO) Quantitative",
    "category": "immunology",
    "price": 380,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-292",
    "code": "IMM-19",
    "nameAr": "الأجسام المضادة للغشاء القاعدي الكبيبي (Anti-GBM Antibodies)",
    "nameEn": "Anti-Glomerular Basement Membrane Antibodies",
    "category": "immunology",
    "price": 450,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-293",
    "code": "IMM-20",
    "nameAr": "مكمل المناعة سي 3 (Complement Component C3 Quantitative)",
    "nameEn": "Complement C3 Quantitative",
    "category": "immunology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-294",
    "code": "IMM-21",
    "nameAr": "مكمل المناعة سي 4 (Complement Component C4 Quantitative)",
    "nameEn": "Complement C4 Quantitative",
    "category": "immunology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-295",
    "code": "IMM-22",
    "nameAr": "النشاط الإجمالي للمتممة المناعية (Total Hemolytic Complement - CH50)",
    "nameEn": "CH50 Total Complement Activity",
    "category": "immunology",
    "price": 360,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-296",
    "code": "IMM-23",
    "nameAr": "الغلوبيولين المناعي ج كمي (Serum Immunoglobulin G - IgG)",
    "nameEn": "Immunoglobulin G Quantitative",
    "category": "immunology",
    "price": 180,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-297",
    "code": "IMM-24",
    "nameAr": "الغلوبيولين المناعي أ كمي (Serum Immunoglobulin A - IgA)",
    "nameEn": "Immunoglobulin A Quantitative",
    "category": "immunology",
    "price": 180,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-298",
    "code": "IMM-25",
    "nameAr": "الغلوبيولين المناعي م كمي (Serum Immunoglobulin M - IgM)",
    "nameEn": "Immunoglobulin M Quantitative",
    "category": "immunology",
    "price": 180,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-299",
    "code": "IMM-26",
    "nameAr": "الغلوبيولين المناعي هـ الكلي للحساسية (Total Serum IgE Quantitative)",
    "nameEn": "Total Serum IgE Quantitative by CLIA",
    "category": "immunology",
    "price": 190,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-300",
    "code": "IMM-27",
    "nameAr": "الغلوبيولين المناعي د (Serum Immunoglobulin D - IgD)",
    "nameEn": "Immunoglobulin D Quantitative",
    "category": "immunology",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-301",
    "code": "IMM-28",
    "nameAr": "مضادات الفوسفوليبيد الكاردiolipin IgG (Anti-Cardiolipin IgG)",
    "nameEn": "Anti-Cardiolipin Antibodies IgG",
    "category": "immunology",
    "price": 240,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-302",
    "code": "IMM-29",
    "nameAr": "مضادات الفوسفوليبيد الكاردiolipin IgM (Anti-Cardiolipin IgM)",
    "nameEn": "Anti-Cardiolipin Antibodies IgM",
    "category": "immunology",
    "price": 240,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-303",
    "code": "IMM-30",
    "nameAr": "مضادات بيتا 2 غليكوبروتين 1 IgG (Anti-Beta-2 Glycoprotein I IgG)",
    "nameEn": "Anti-Beta-2 Glycoprotein 1 IgG",
    "category": "immunology",
    "price": 280,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-304",
    "code": "IMM-31",
    "nameAr": "مضادات بيتا 2 غليكوبروتين 1 IgM (Anti-Beta-2 Glycoprotein I IgM)",
    "nameEn": "Anti-Beta-2 Glycoprotein 1 IgM",
    "category": "immunology",
    "price": 280,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-305",
    "code": "IMM-32",
    "nameAr": "الأجسام المضادة للعضلات الملساء (Anti-Smooth Muscle Antibodies - ASMA)",
    "nameEn": "Anti-Smooth Muscle Antibodies (ASMA) by IFA",
    "category": "immunology",
    "price": 340,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-306",
    "code": "IMM-33",
    "nameAr": "الأجسام المضادة للميكروسومات الكبدية والكلوية (Anti-LKM-1 Antibodies)",
    "nameEn": "Anti-Liver Kidney Microsome 1 (Anti-LKM1)",
    "category": "immunology",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-307",
    "code": "IMM-34",
    "nameAr": "الأجسام المضادة للميتوكوندريا (Anti-Mitochondrial Antibodies - AMA M2)",
    "nameEn": "Anti-Mitochondrial Antibodies (AMA M2) Quantitative",
    "category": "immunology",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-308",
    "code": "IMM-35",
    "nameAr": "الأجسام المضادة لمستقبلات الأسيتيل كولين (AChR Antibodies)",
    "nameEn": "Acetylcholine Receptor Antibodies for Myasthenia",
    "category": "immunology",
    "price": 750,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-309",
    "code": "IMM-36",
    "nameAr": "الأجسام المضادة لـ MuSK (Anti-MuSK Antibodies)",
    "nameEn": "Muscle-Specific Kinase (MuSK) Antibodies",
    "category": "immunology",
    "price": 850,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-310",
    "code": "IMM-37",
    "nameAr": "الأجسام المضادة للغشاء المياليني للأعصاب (Anti-MAG Antibodies)",
    "nameEn": "Anti-Myelin-Associated Glycoprotein",
    "category": "immunology",
    "price": 780,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-311",
    "code": "IMM-38",
    "nameAr": "الأجسام المضادة لقنوات الكالسيوم (Voltage-Gated Calcium Channel - VGCC)",
    "nameEn": "VGCC Antibodies (Lambert-Eaton Syndrome)",
    "category": "immunology",
    "price": 890,
    "duration": "7 أيام",
    "active": true
  },
  {
    "id": "t-312",
    "code": "IMM-39",
    "nameAr": "الأجسام المضادة للأكوابورين 4 لالتهاب العصب البصري (NMO / AQP4-IgG)",
    "nameEn": "Aquaporin-4 (NMO) IgG Cell-Based Assay",
    "category": "immunology",
    "price": 850,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-313",
    "code": "IMM-40",
    "nameAr": "الأجسام المضادة لـ MOG (Anti-MOG IgG)",
    "nameEn": "Myelin Oligodendrocyte Glycoprotein Antibodies",
    "category": "immunology",
    "price": 850,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-314",
    "code": "IMM-41",
    "nameAr": "الأجسام المضادة لحمض الجلوتاميك ديكاربوكسيلاز العصبي (Anti-GAD 65 Neurological)",
    "nameEn": "Anti-GAD 65 High Titer (Stiff Person Syndrome)",
    "category": "immunology",
    "price": 650,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-315",
    "code": "IMM-42",
    "nameAr": "فحص الأجسام المضادة للبارانيوبلاستيك المتعدد (Paraneoplastic Autoantibody Panel)",
    "nameEn": "Paraneoplastic Neurological Syndrome Panel (Hu, Yo, Ri, CV2, Ma2, Amphiphysin)",
    "category": "immunology",
    "price": 1450,
    "duration": "7 إلى 10 أيام",
    "active": true
  },
  {
    "id": "t-316",
    "code": "IMM-43",
    "nameAr": "الأجسام المضادة لمستقبلات NMDA لالتهاب الدماغ المناعي (Anti-NMDAR)",
    "nameEn": "Anti-NMDA Receptor Encephalitis Antibodies",
    "category": "immunology",
    "price": 980,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-317",
    "code": "IMM-44",
    "nameAr": "الأجسام المضادة للكولاجين من النوع الثاني (Anti-Type II Collagen Antibodies)",
    "nameEn": "Anti-Type II Collagen Antibodies",
    "category": "immunology",
    "price": 480,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-318",
    "code": "IMM-45",
    "nameAr": "الأجسام المضادة للغشاء المصلي (Anti-Desmoglein 1 & 3 for Pemphigus)",
    "nameEn": "Anti-Desmoglein 1 & 3 ELISA",
    "category": "immunology",
    "price": 750,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-319",
    "code": "IMM-46",
    "nameAr": "الأجسام المضادة لـ BP180 و BP230 للفقاع الفقاعي (Bullous Pemphigoid Antibodies)",
    "nameEn": "Anti-BP180 & BP230 IgG ELISA",
    "category": "immunology",
    "price": 750,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-320",
    "code": "IMM-47",
    "nameAr": "الأجسام المضادة لخلايا البنكرياس الإنسولين الذاتية (Anti-Insulin Antibodies - IAA)",
    "nameEn": "Anti-Insulin Antibodies",
    "category": "immunology",
    "price": 390,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-321",
    "code": "IMM-48",
    "nameAr": "الأجسام المضادة لناقل الزنك 8 للسكري (Zinc Transporter 8 - ZnT8 Ab)",
    "nameEn": "Zinc Transporter 8 Autoantibodies",
    "category": "immunology",
    "price": 580,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-322",
    "code": "IMM-49",
    "nameAr": "الأجسام المضادة للمستقبلات الإنسولينية (Anti-Insulin Receptor Antibodies)",
    "nameEn": "Anti-Insulin Receptor Antibodies Type B",
    "category": "immunology",
    "price": 850,
    "duration": "7 أيام",
    "active": true
  },
  {
    "id": "t-323",
    "code": "IMM-50",
    "nameAr": "الأجسام المضادة للغدة الكظرية (Anti-Adrenal Cortex Antibodies)",
    "nameEn": "Anti-Adrenal Antibodies by IFA",
    "category": "immunology",
    "price": 450,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-324",
    "code": "ALL-01",
    "nameAr": "لوحة حساسية الاستنشاق والصدر الشاملة (Inhalant Allergy Panel 20 Allergens)",
    "nameEn": "Inhalant Specific IgE Panel (20 Allergens)",
    "category": "allergy",
    "price": 690,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-325",
    "code": "ALL-02",
    "nameAr": "لوحة حساسية الطعام الشاملة (Food Allergy Panel 30 Allergens)",
    "nameEn": "Food Specific IgE Panel (30 Food Allergens)",
    "category": "allergy",
    "price": 850,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-326",
    "code": "ALL-03",
    "nameAr": "لوحة حساسية الأطفال المتكاملة (Pediatric Atopy Panel 20 Allergens)",
    "nameEn": "Pediatric Allergy Screen (Food + Inhalant Mix)",
    "category": "allergy",
    "price": 690,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-327",
    "code": "ALL-04",
    "nameAr": "حساسية بروتين حليب البقر الجزئية (Cow Milk Protein Components: Casein, Lactalbumin)",
    "nameEn": "Cow Milk Component-Resolved Allergy Panel",
    "category": "allergy",
    "price": 580,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-328",
    "code": "ALL-05",
    "nameAr": "حساسية الفول السوداني الجزيئية (Peanut Allergen Components Ara h 1, 2, 3, 8, 9)",
    "nameEn": "Peanut Component Allergy Testing",
    "category": "allergy",
    "price": 780,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-329",
    "code": "ALL-06",
    "nameAr": "حساسية المضادات الحيوية / البنسلين (Penicillin G & V Specific IgE)",
    "nameEn": "Penicillin G & V Specific IgE",
    "category": "allergy",
    "price": 360,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-330",
    "code": "ALL-07",
    "nameAr": "حساسية الأموكسيسيلين (Amoxicillin Specific IgE)",
    "nameEn": "Amoxicillin Specific IgE",
    "category": "allergy",
    "price": 360,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-331",
    "code": "ALL-08",
    "nameAr": "حساسية الأسبرين ومضادات الالتهاب (Aspirin & NSAIDs Specific IgE / CAST)",
    "nameEn": "Aspirin Allergy CAST / Specific IgE",
    "category": "allergy",
    "price": 650,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-332",
    "code": "ALL-09",
    "nameAr": "حساسية سم النحل والزنبار (Honey Bee & Wasp Venom Specific IgE)",
    "nameEn": "Bee & Wasp Venom Specific IgE",
    "category": "allergy",
    "price": 480,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-333",
    "code": "ALL-10",
    "nameAr": "حساسية مادة اللاتكس / القفازات الطبية (Latex Specific IgE)",
    "nameEn": "Latex Specific IgE Assay",
    "category": "allergy",
    "price": 380,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-334",
    "code": "ALL-11",
    "nameAr": "حساسية الغلوتين والقمح النوعية (Wheat & Gluten Specific IgE)",
    "nameEn": "Wheat & Gluten Specific IgE",
    "category": "allergy",
    "price": 360,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-335",
    "code": "ALL-12",
    "nameAr": "حساسية فول الصويا (Soybean Specific IgE)",
    "nameEn": "Soybean Specific IgE",
    "category": "allergy",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-336",
    "code": "ALL-13",
    "nameAr": "حساسية بياض وصفار البيض (Egg White & Yolk Specific IgE)",
    "nameEn": "Egg White & Yolk Specific IgE",
    "category": "allergy",
    "price": 340,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-337",
    "code": "ALL-14",
    "nameAr": "حساسية الأسماك والمأكولات البحرية (Fish & Shellfish IgE Mix)",
    "nameEn": "Seafood & Shellfish Specific IgE Mix",
    "category": "allergy",
    "price": 420,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-338",
    "code": "ALL-15",
    "nameAr": "حساسية المكسرات المشكلة (Tree Nuts Specific IgE Mix)",
    "nameEn": "Tree Nuts Specific IgE Mix",
    "category": "allergy",
    "price": 440,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-339",
    "code": "ALL-16",
    "nameAr": "حساسية عثة الغبار المنزلي (Dermatophagoides pteronyssinus & farinae IgE)",
    "nameEn": "House Dust Mite Specific IgE (d1 & d2)",
    "category": "allergy",
    "price": 360,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-340",
    "code": "ALL-17",
    "nameAr": "حساسية شعر ولعاب القطط (Cat Dander Specific IgE - e1)",
    "nameEn": "Cat Dander Specific IgE",
    "category": "allergy",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-341",
    "code": "ALL-18",
    "nameAr": "حساسية وبر الكلاب (Dog Dander Specific IgE - e5)",
    "nameEn": "Dog Dander Specific IgE",
    "category": "allergy",
    "price": 320,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-342",
    "code": "ALL-19",
    "nameAr": "حساسية فطر الأسبرجلس الرئوي (Aspergillus fumigatus Specific IgE - m3)",
    "nameEn": "Aspergillus fumigatus Specific IgE",
    "category": "allergy",
    "price": 350,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-343",
    "code": "ALL-20",
    "nameAr": "حساسية حبوب لقاح النخيل والزيتون والأعشاب (Pollen Grass & Weed Mix)",
    "nameEn": "Grass & Weed Pollen IgE Mix",
    "category": "allergy",
    "price": 380,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-344",
    "code": "ALL-21",
    "nameAr": "لوحة حساسية التوابل والبهارات (Spices Allergy Panel)",
    "nameEn": "Spices Specific IgE Screen",
    "category": "allergy",
    "price": 580,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-345",
    "code": "ALL-22",
    "nameAr": "لوحة الأجسام المضادة IgG لحساسية عدم تحمل 220 طعام (Food Intolerance IgG 220 Foods)",
    "nameEn": "Food Print 220 Foods IgG Microarray",
    "category": "allergy",
    "price": 2850,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-346",
    "code": "ALL-23",
    "nameAr": "بصمة عدم تحمل 100 نوع طعام IgG (Food Intolerance 100 Foods)",
    "nameEn": "Food Intolerance 100 Foods IgG by Microarray",
    "category": "allergy",
    "price": 1850,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-347",
    "code": "ALL-24",
    "nameAr": "إنزيم ديامين أوكسيداز لحساسية الهيستامين (DAO - Diamine Oxidase Activity)",
    "nameEn": "Diamine Oxidase (DAO) for Histamine Intolerance",
    "category": "allergy",
    "price": 680,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-348",
    "code": "ALL-25",
    "nameAr": "التريبتاز الكلي لصدمة الحساسية وكثرة الخلايا البدينة (Total Serum Tryptase)",
    "nameEn": "Total Serum Tryptase (CLIA)",
    "category": "allergy",
    "price": 750,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-349",
    "code": "SER-01",
    "nameAr": "فيروس بي الكبدي المستضد السطحي (HBsAg Hepatitis B Surface)",
    "nameEn": "HBsAg by Chemiluminescence / ELISA",
    "category": "serology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-350",
    "code": "SER-02",
    "nameAr": "الأجسام المضادة السطحية لفيروس بي (HBsAb / Anti-HBs Quantitative)",
    "nameEn": "Anti-HBs Quantitative Titer",
    "category": "serology",
    "price": 180,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-351",
    "code": "SER-03",
    "nameAr": "الأجسام المضادة للب كبسولة فيروس بي الكلية (HBcAb Total)",
    "nameEn": "Anti-HBc Total (IgG + IgM)",
    "category": "serology",
    "price": 210,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-352",
    "code": "SER-04",
    "nameAr": "الأجسام المضادة للب كبسولة فيروس بي الحادة (HBcAb IgM)",
    "nameEn": "Anti-HBc IgM for Acute Hepatitis B",
    "category": "serology",
    "price": 220,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-353",
    "code": "SER-05",
    "nameAr": "مستضد الغلاف لفيروس بي (HBeAg)",
    "nameEn": "HBeAg (Marker of Active Viral Replication)",
    "category": "serology",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-354",
    "code": "SER-06",
    "nameAr": "الأجسام المضادة لمستضد الغلاف لفيروس بي (HBeAb / Anti-HBe)",
    "nameEn": "Anti-HBe Antibodies",
    "category": "serology",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-355",
    "code": "SER-07",
    "nameAr": "الأجسام المضادة لفيروس سي الكبدي (HCV Ab by ECLIA 4th Gen)",
    "nameEn": "Hepatitis C Virus Antibodies (4th Generation)",
    "category": "serology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-356",
    "code": "SER-08",
    "nameAr": "الأجسام المضادة لفيروس أ الكبدي الحاد (HAV IgM)",
    "nameEn": "Hepatitis A Virus Antibodies IgM",
    "category": "serology",
    "price": 180,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-357",
    "code": "SER-09",
    "nameAr": "الأجسام المضادة لفيروس أ الكلية (HAV Total IgG/IgM)",
    "nameEn": "Hepatitis A Virus Antibodies Total",
    "category": "serology",
    "price": 180,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-358",
    "code": "SER-10",
    "nameAr": "الأجسام المضادة لفيروس دي / دلتا الكبدي (Anti-HDV Total & IgM)",
    "nameEn": "Hepatitis D (Delta) Virus Antibodies",
    "category": "serology",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-359",
    "code": "SER-11",
    "nameAr": "الأجسام المضادة لفيروس إي الكبدي (HEV IgM & IgG)",
    "nameEn": "Hepatitis E Virus Antibodies",
    "category": "serology",
    "price": 360,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-360",
    "code": "SER-12",
    "nameAr": "فيروس نقص المناعة البشري كومبو (HIV 1 & 2 Ag/Ab Combo 4th Gen)",
    "nameEn": "HIV 1/2 Antigen/Antibody 4th Generation Combo",
    "category": "serology",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-361",
    "code": "SER-13",
    "nameAr": "اختبار الزهري السريع غير النوعي (RPR / VDRL Titer)",
    "nameEn": "RPR / VDRL Syphilis Screen with Titer",
    "category": "serology",
    "price": 100,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-362",
    "code": "SER-14",
    "nameAr": "اختبار الزهري النوعي التأكيدي (TPHA / Syphilis Specific Titer)",
    "nameEn": "Treponema Pallidum Hemagglutination (TPHA)",
    "category": "serology",
    "price": 190,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-363",
    "code": "SER-15",
    "nameAr": "التوكسوبلازما / داء القطط IgG كمي (Toxoplasma Gondii IgG)",
    "nameEn": "Toxoplasma Gondii IgG Quantitative (IU/mL)",
    "category": "serology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-364",
    "code": "SER-16",
    "nameAr": "التوكسوبلازما / داء القطط IgM (Toxoplasma Gondii IgM)",
    "nameEn": "Toxoplasma Gondii IgM",
    "category": "serology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-365",
    "code": "SER-17",
    "nameAr": "قوة ارتباط أجسام التوكسوبلازما (Toxoplasma IgG Avidity Test)",
    "nameEn": "Toxoplasma IgG Avidity Test",
    "category": "serology",
    "price": 380,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-366",
    "code": "SER-18",
    "nameAr": "الحصبة الألمانية IgG كمي (Rubella IgG Quantitative)",
    "nameEn": "Rubella Virus IgG Quantitative",
    "category": "serology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-367",
    "code": "SER-19",
    "nameAr": "الحصبة الألمانية IgM (Rubella IgM)",
    "nameEn": "Rubella Virus IgM",
    "category": "serology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-368",
    "code": "SER-20",
    "nameAr": "الفيروس المضخم للخلايا IgG (Cytomegalovirus CMV IgG)",
    "nameEn": "CMV IgG Quantitative",
    "category": "serology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-369",
    "code": "SER-21",
    "nameAr": "الفيروس المضخم للخلايا IgM (Cytomegalovirus CMV IgM)",
    "nameEn": "CMV IgM",
    "category": "serology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-370",
    "code": "SER-22",
    "nameAr": "فيروس الهربس البسيط النوع الأول والثاني IgG (HSV 1 & 2 IgG)",
    "nameEn": "Herpes Simplex Virus 1 & 2 IgG",
    "category": "serology",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-371",
    "code": "SER-23",
    "nameAr": "فيروس الهربس البسيط النوع الأول والثاني IgM (HSV 1 & 2 IgM)",
    "nameEn": "Herpes Simplex Virus 1 & 2 IgM",
    "category": "serology",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-372",
    "code": "SER-24",
    "nameAr": "باقة التورش المتكاملة للحوامل (TORCH Panel 8 Tests IgG & IgM)",
    "nameEn": "TORCH Panel (Toxo, Rubella, CMV, HSV IgG & IgM)",
    "category": "serology",
    "price": 690,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-373",
    "code": "SER-25",
    "nameAr": "الأجسام المضادة لفيروس إبشتاين بار كبسولة الفيروس (EBV VCA IgM)",
    "nameEn": "EBV Viral Capsid Antigen (VCA) IgM",
    "category": "serology",
    "price": 260,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-374",
    "code": "SER-26",
    "nameAr": "الأجسام المضادة لفيروس إبشتاين بار كبسولة الفيروس (EBV VCA IgG)",
    "nameEn": "EBV VCA IgG",
    "category": "serology",
    "price": 260,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-375",
    "code": "SER-27",
    "nameAr": "الأجسام المضادة لمستضد نواة إبشتاين بار (EBNA-1 IgG)",
    "nameEn": "EBV Nuclear Antigen 1 (EBNA-1) IgG",
    "category": "serology",
    "price": 280,
    "duration": "نفس اليوم",
    "active": true
  },
  {
    "id": "t-376",
    "code": "SER-28",
    "nameAr": "فحص فيدال للتيفود والباراتيفود (Widal Agglutination Test)",
    "nameEn": "Widal Agglutination Test (TO, TH, AO, BO, AH, BH)",
    "category": "serology",
    "price": 110,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-377",
    "code": "SER-29",
    "nameAr": "فحص التيفود السريع (Typhidot IgM & IgG Rapid)",
    "nameEn": "Typhidot Rapid IgM / IgG",
    "category": "serology",
    "price": 160,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-378",
    "code": "SER-30",
    "nameAr": "فحص الحمى المالطية / البروسيلا (Brucella Agglutination Melitensis & Abortus)",
    "nameEn": "Brucella Standard Agglutination Test (Wright Test)",
    "category": "serology",
    "price": 140,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-379",
    "code": "SER-31",
    "nameAr": "فحص بروسيلا كومبس للحالات المزمنة (Brucella Coombs Test)",
    "nameEn": "Brucella Coombs / Antiglobulin Test",
    "category": "serology",
    "price": 240,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-380",
    "code": "SER-32",
    "nameAr": "الميكروب السبحي / حمى الروماتيزم الكمي (ASOT - Anti-Streptolysin O)",
    "nameEn": "Anti-Streptolysin O (ASOT) Quantitative",
    "category": "serology",
    "price": 130,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-381",
    "code": "SER-33",
    "nameAr": "الأجسام المضادة للإنزيم الهاضم للدنا للمكورات السبحية (Anti-DNase B)",
    "nameEn": "Anti-DNase B Quantitative",
    "category": "serology",
    "price": 340,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-382",
    "code": "SER-34",
    "nameAr": "الأجسام المضادة لليشمانيا (Leishmania Antibodies)",
    "nameEn": "Leishmania Antibodies by IFA / ELISA",
    "category": "serology",
    "price": 380,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-383",
    "code": "SER-35",
    "nameAr": "الأجسام المضادة للبلهارسيا (Schistosoma Antibodies by IHA/ELISA)",
    "nameEn": "Schistosoma Antibodies",
    "category": "serology",
    "price": 260,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-384",
    "code": "SER-36",
    "nameAr": "الأجسام المضادة للفاشيولا / دودة الكبد (Fasciola Hepatica Antibodies)",
    "nameEn": "Fasciola Antibodies ELISA",
    "category": "serology",
    "price": 320,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-385",
    "code": "SER-37",
    "nameAr": "الأجسام المضادة للأكياس المائية للكلاب (Hydatid Cyst / Echinococcus Ab)",
    "nameEn": "Echinococcus Granulosus (Hydatid) Antibodies",
    "category": "serology",
    "price": 340,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-386",
    "code": "SER-38",
    "nameAr": "الأجسام المضادة لداء الفيل والفلاريا (Filaria Antibodies)",
    "nameEn": "Filariasis Antibodies",
    "category": "serology",
    "price": 360,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-387",
    "code": "SER-39",
    "nameAr": "مستضد فيروس حمى الضنك السريع (Dengue NS1 Antigen)",
    "nameEn": "Dengue NS1 Antigen Rapid Test",
    "category": "serology",
    "price": 240,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-388",
    "code": "SER-40",
    "nameAr": "الأجسام المضادة لحمى الضنك (Dengue IgM & IgG)",
    "nameEn": "Dengue Virus Antibodies IgM / IgG",
    "category": "serology",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-389",
    "code": "SER-41",
    "nameAr": "تحليل السل الكامن المتقدم بالدم (QuantiFERON-TB Gold Plus)",
    "nameEn": "QuantiFERON-TB Gold Plus (4 Tubes)",
    "category": "serology",
    "price": 1450,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-390",
    "code": "SER-42",
    "nameAr": "مستضد فيروس كورونا السريع (COVID-19 Antigen Rapid)",
    "nameEn": "SARS-CoV-2 Rapid Antigen",
    "category": "serology",
    "price": 120,
    "duration": "خلال 20 دقيقة",
    "active": true
  },
  {
    "id": "t-391",
    "code": "SER-43",
    "nameAr": "فيروس كورونا المستضد التماثلي للأجسام المضادة (COVID-19 Spike IgG Quantitative)",
    "nameEn": "SARS-CoV-2 Anti-Spike IgG Quantitative",
    "category": "serology",
    "price": 250,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-392",
    "code": "SER-44",
    "nameAr": "مستضد الإنفلونزا أ و ب السريع (Influenza A & B Rapid Ag)",
    "nameEn": "Influenza A/B Antigen Rapid",
    "category": "serology",
    "price": 180,
    "duration": "خلال 20 دقيقة",
    "active": true
  },
  {
    "id": "t-393",
    "code": "SER-45",
    "nameAr": "المستضد السريع للفيروس المخلوي التنفسي (RSV Antigen Rapid)",
    "nameEn": "Respiratory Syncytial Virus (RSV) Antigen",
    "category": "serology",
    "price": 190,
    "duration": "خلال نصف ساعة",
    "active": true
  },
  {
    "id": "t-394",
    "code": "PCR-01",
    "nameAr": "التحليل الكمي لفيروس سي بالـ PCR (HCV RNA Quantitative Real-Time PCR)",
    "nameEn": "HCV RNA Viral Load Real-Time PCR (IU/mL)",
    "category": "pcr",
    "price": 590,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-395",
    "code": "PCR-02",
    "nameAr": "التحليل الكمي لفيروس بي بالـ PCR (HBV DNA Quantitative Real-Time PCR)",
    "nameEn": "HBV DNA Viral Load Real-Time PCR (IU/mL)",
    "category": "pcr",
    "price": 650,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-396",
    "code": "PCR-03",
    "nameAr": "التحليل الكمي لفيروس نقص المناعة بالـ PCR (HIV-1 RNA Viral Load)",
    "nameEn": "HIV-1 RNA Viral Load by Real-Time PCR",
    "category": "pcr",
    "price": 980,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-397",
    "code": "PCR-04",
    "nameAr": "الكشف الكمي لفيروس سيتوميجالو بالـ PCR (CMV DNA Quantitative PCR)",
    "nameEn": "CMV DNA Quantitative PCR",
    "category": "pcr",
    "price": 750,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-398",
    "code": "PCR-05",
    "nameAr": "الكشف الكمي لفيروس إبشتاين بار بالـ PCR (EBV DNA Quantitative PCR)",
    "nameEn": "EBV DNA Quantitative PCR",
    "category": "pcr",
    "price": 750,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-399",
    "code": "PCR-06",
    "nameAr": "النمط الجيني لفيروس الورم الحليمي عالي الخطورة (HPV High-Risk Genotyping 14 Types)",
    "nameEn": "HPV High-Risk DNA Genotyping (16, 18, 31, 33, 45, etc.)",
    "category": "pcr",
    "price": 950,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-400",
    "code": "PCR-07",
    "nameAr": "بكتيريا السل / الدرن بالـ PCR ومقاومة الريفامبيسين (TB PCR / GeneXpert MTB/RIF)",
    "nameEn": "GeneXpert MTB/RIF Molecular Assay",
    "category": "pcr",
    "price": 850,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-401",
    "code": "PCR-08",
    "nameAr": "طفرة العامل الخامس لايدن بالـ PCR (Factor V Leiden G1691A Mutation)",
    "nameEn": "Factor V Leiden Mutation by Real-Time PCR",
    "category": "pcr",
    "price": 550,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-402",
    "code": "PCR-09",
    "nameAr": "طفرة البروثرومبين العامل الثاني بالـ PCR (Prothrombin G20210A Mutation)",
    "nameEn": "Prothrombin Factor II Mutation PCR",
    "category": "pcr",
    "price": 550,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-403",
    "code": "PCR-10",
    "nameAr": "طفرات إنزيم MTHFR بالـ PCR للجلطات والإجهاض (MTHFR C677T & A1298C)",
    "nameEn": "MTHFR Gene Mutations (C677T & A1298C) by PCR",
    "category": "pcr",
    "price": 650,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-404",
    "code": "PCR-11",
    "nameAr": "باقة التخثر الوراثي الثلاثية الكاملة (Thrombophilia Trio Panel: Factor V, Prothrombin, MTHFR)",
    "nameEn": "Thrombophilia 3 Genes DNA Panel by PCR",
    "category": "pcr",
    "price": 1450,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-405",
    "code": "PCR-12",
    "nameAr": "طفرة جين JAK2 V617F لسرطان كثرة كرات الدم (JAK2 V617F Quantitative PCR)",
    "nameEn": "JAK2 V617F Mutation Quantitative PCR",
    "category": "pcr",
    "price": 950,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-406",
    "code": "PCR-13",
    "nameAr": "جين BCR-ABL الكمي للوكيميا النخاعية (BCR-ABL1 Major IS Quantitative PCR)",
    "nameEn": "BCR-ABL1 Transcript Quantitative (International Scale)",
    "category": "pcr",
    "price": 1650,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-407",
    "code": "PCR-14",
    "nameAr": "طفرة جين BRAF V600E للأورام (BRAF V600E Mutation by Real-Time PCR)",
    "nameEn": "BRAF V600E Mutation Analysis",
    "category": "pcr",
    "price": 1250,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-408",
    "code": "PCR-15",
    "nameAr": "طفرات جين KRAS للقولون والرئة (KRAS Codons 12, 13, 61 Mutation Analysis)",
    "nameEn": "KRAS Mutation Panel by Real-Time PCR",
    "category": "pcr",
    "price": 1450,
    "duration": "7 أيام",
    "active": true
  },
  {
    "id": "t-409",
    "code": "PCR-16",
    "nameAr": "طفرات جين NRAS للأورام (NRAS Mutation Analysis)",
    "nameEn": "NRAS Mutation Panel by PCR",
    "category": "pcr",
    "price": 1450,
    "duration": "7 أيام",
    "active": true
  },
  {
    "id": "t-410",
    "code": "PCR-17",
    "nameAr": "طفرات جين EGFR لسرطان الرئة (EGFR Mutations Exons 18-21 by PCR)",
    "nameEn": "EGFR Kinase Domain Mutations",
    "category": "pcr",
    "price": 1850,
    "duration": "7 إلى 10 أيام",
    "active": true
  },
  {
    "id": "t-411",
    "code": "PCR-18",
    "nameAr": "طفرات جين التليف الكيسي الأكثر شيوعاً (Cystic Fibrosis CFTR 36 Mutations)",
    "nameEn": "CFTR 36 Common Mutations Panel",
    "category": "pcr",
    "price": 1650,
    "duration": "7 إلى 10 أيام",
    "active": true
  },
  {
    "id": "t-412",
    "code": "PCR-19",
    "nameAr": "حذف الكروموسوم Y لعقم الرجال (Y-Chromosome Microdeletions AZF a, b, c)",
    "nameEn": "Y-Chromosome Microdeletion by Multiplex PCR",
    "category": "pcr",
    "price": 1150,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-413",
    "code": "PCR-20",
    "nameAr": "جين حمى البحر الأبيض المتوسط الوراثية (FMF Gene 12 Mutations by Reverse Blot/PCR)",
    "nameEn": "Familial Mediterranean Fever (MEFV Gene 12 Mutations)",
    "category": "pcr",
    "price": 950,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-414",
    "code": "PCR-21",
    "nameAr": "الفحص الوراثي للسيلياك / حساسية القمح (HLA-DQ2 & HLA-DQ8 by PCR)",
    "nameEn": "HLA-DQ2 / HLA-DQ8 Celiac Disease Genetics",
    "category": "pcr",
    "price": 950,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-415",
    "code": "PCR-22",
    "nameAr": "النمط الجيني HLA-B27 لالتهاب الفقار اللاصق (HLA-B27 by PCR / Flow Cytometry)",
    "nameEn": "HLA-B27 Typing by Real-Time PCR",
    "category": "pcr",
    "price": 490,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-416",
    "code": "PCR-23",
    "nameAr": "النمط الجيني HLA-B51 لمرض بهجت (HLA-B51 Typing by PCR)",
    "nameEn": "HLA-B51 for Behçet Disease",
    "category": "pcr",
    "price": 550,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-417",
    "code": "PCR-24",
    "nameAr": "النمط الجيني HLA-B*5701 لفرط حساسية أدوية الإيدز (HLA-B*5701 Typing)",
    "nameEn": "HLA-B*5701 Abacavir Hypersensitivity",
    "category": "pcr",
    "price": 650,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-418",
    "code": "PCR-25",
    "nameAr": "جين داء ترسب الأصبغة الدموية الوراثي (HFE Gene C282Y & H63D Mutations)",
    "nameEn": "HFE Hereditary Hemochromatosis Mutations",
    "category": "pcr",
    "price": 750,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-419",
    "code": "PCR-26",
    "nameAr": "طفرة جين FLT3-ITD للوكيميا الحادة (FLT3 Mutation by PCR)",
    "nameEn": "FLT3 Mutation Analysis for AML Prognosis",
    "category": "pcr",
    "price": 1150,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-420",
    "code": "PCR-27",
    "nameAr": "طفرة جين NPM1 للوكيميا النخاعية (NPM1 Mutation Analysis)",
    "nameEn": "NPM1 Mutation Analysis for AML",
    "category": "pcr",
    "price": 1150,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-421",
    "code": "PCR-28",
    "nameAr": "الكشف الجزيئي عن فيروس الهربس البسيط بالـ PCR (HSV 1 & 2 DNA PCR)",
    "nameEn": "HSV 1/2 DNA Detection by Real-Time PCR",
    "category": "pcr",
    "price": 750,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-422",
    "code": "PCR-29",
    "nameAr": "الكشف الجزيئي عن فيروس الحماق النطاقي بالـ PCR (VZV DNA PCR)",
    "nameEn": "Varicella Zoster Virus DNA PCR",
    "category": "pcr",
    "price": 750,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-423",
    "code": "PCR-30",
    "nameAr": "الكشف الجزيئي المتعدد عن ميكروبات الجهاز التنفسي (Respiratory Viral & Bacterial PCR Multiplex)",
    "nameEn": "Respiratory Pathogens Multiplex Panel (20 Targets)",
    "category": "pcr",
    "price": 1850,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-424",
    "code": "TUM-01",
    "nameAr": "دلالات أورام البروستاتا الكلي (Total PSA)",
    "nameEn": "Total Prostate Specific Antigen (CLIA)",
    "category": "tumors",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-425",
    "code": "TUM-02",
    "nameAr": "دلالات أورام البروستاتا الحر (Free PSA)",
    "nameEn": "Free Prostate Specific Antigen",
    "category": "tumors",
    "price": 280,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-426",
    "code": "TUM-03",
    "nameAr": "نسبة PSA الحر إلى الكلي المحسوبة (Free / Total PSA Ratio)",
    "nameEn": "Free / Total PSA Ratio %",
    "category": "tumors",
    "price": 60,
    "duration": "فوري",
    "active": true
  },
  {
    "id": "t-427",
    "code": "TUM-04",
    "nameAr": "دلالات أورام الجهاز الهضمي والقولون (CEA)",
    "nameEn": "Carcinoembryonic Antigen (CLIA)",
    "category": "tumors",
    "price": 250,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-428",
    "code": "TUM-05",
    "nameAr": "دلالات أورام البنكرياس والقنوات المرارية (CA 19-9)",
    "nameEn": "Cancer Antigen 19-9",
    "category": "tumors",
    "price": 290,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-429",
    "code": "TUM-06",
    "nameAr": "دلالات أورام المبيض وبطانة الرحم (CA 125)",
    "nameEn": "Cancer Antigen 125",
    "category": "tumors",
    "price": 290,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-430",
    "code": "TUM-07",
    "nameAr": "دلالات أورام الثدي (CA 15-3)",
    "nameEn": "Cancer Antigen 15-3",
    "category": "tumors",
    "price": 290,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-431",
    "code": "TUM-08",
    "nameAr": "ألفا فيتو بروتين لدلالات الكبد والأجنة (AFP)",
    "nameEn": "Alpha-Fetoprotein Tumor Marker",
    "category": "tumors",
    "price": 250,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-432",
    "code": "TUM-09",
    "nameAr": "بروتين البربخ البشري 4 للمبيض (HE4 - Human Epididymis Protein 4)",
    "nameEn": "Human Epididymis Protein 4 (HE4)",
    "category": "tumors",
    "price": 650,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-433",
    "code": "TUM-10",
    "nameAr": "مؤشر روما لخطورة أورام المبيض (ROMA Index: CA-125 + HE4 + Menopausal Status)",
    "nameEn": "ROMA Score (Risk of Ovarian Malignancy Algorithm)",
    "category": "tumors",
    "price": 890,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-434",
    "code": "TUM-11",
    "nameAr": "دلالات أورام المعدة (CA 72-4)",
    "nameEn": "Cancer Antigen 72-4",
    "category": "tumors",
    "price": 360,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-435",
    "code": "TUM-12",
    "nameAr": "إنولاز الخلايا العصبية النوعي (Neuron-Specific Enolase - NSE)",
    "nameEn": "Neuron-Specific Enolase",
    "category": "tumors",
    "price": 450,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-436",
    "code": "TUM-13",
    "nameAr": "سيفرا 21-1 لأورام الرئة والمثانة (Cyfra 21-1 - Cytokeratin 19 Fragments)",
    "nameEn": "Cyfra 21-1 (Cytokeratin 19 Fragments)",
    "category": "tumors",
    "price": 480,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-437",
    "code": "TUM-14",
    "nameAr": "مستضد سرطان الخلايا الحرشفية (SCC - Squamous Cell Carcinoma Antigen)",
    "nameEn": "Squamous Cell Carcinoma Antigen",
    "category": "tumors",
    "price": 480,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-438",
    "code": "TUM-15",
    "nameAr": "الكروموجرانين أ للأورام العصبية الصماوية (Chromogranin A - CgA)",
    "nameEn": "Chromogranin A Quantitative ELISA",
    "category": "tumors",
    "price": 680,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-439",
    "code": "TUM-16",
    "nameAr": "حمض 5-هيدروكسي إندول أسيتيك بالبول (5-HIAA Urine 24h)",
    "nameEn": "5-Hydroxyindoleacetic Acid (5-HIAA) 24h Urine",
    "category": "tumors",
    "price": 550,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-440",
    "code": "TUM-17",
    "nameAr": "الميتانيفرين والنورميتانيفرين الحرة في البلازما (Free Plasma Metanephrines)",
    "nameEn": "Plasma Free Metanephrines & Normetanephrines",
    "category": "tumors",
    "price": 850,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-441",
    "code": "TUM-18",
    "nameAr": "الميتانيفرين الكلية في بول 24 ساعة (24-Hour Urine Fractionated Metanephrines)",
    "nameEn": "24-Hour Urine Total Metanephrines",
    "category": "tumors",
    "price": 580,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-442",
    "code": "TUM-19",
    "nameAr": "حمض الفانيليل مانديليك في بول 24 ساعة (VMA 24h Urine)",
    "nameEn": "Vanillylmandelic Acid (VMA) 24-Hour Urine",
    "category": "tumors",
    "price": 420,
    "duration": "3 أيام",
    "active": true
  },
  {
    "id": "t-443",
    "code": "TUM-20",
    "nameAr": "الكاتيكولامينات الكلية في البول (Urine Free Catecholamines: Adrenaline, Noradrenaline, Dopamine)",
    "nameEn": "Fractionated Urine Catecholamines HPLC",
    "category": "tumors",
    "price": 750,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-444",
    "code": "TUM-21",
    "nameAr": "الكاتيكولامينات الحرة في البلازما (Plasma Catecholamines HPLC)",
    "nameEn": "Plasma Catecholamines (Epi, Norepi, Dopamine)",
    "category": "tumors",
    "price": 850,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-445",
    "code": "TUM-22",
    "nameAr": "الألفا فيتو بروتين L3 النسبة النوعية للكبد (AFP-L3 %)",
    "nameEn": "AFP-L3 % Fractionation",
    "category": "tumors",
    "price": 950,
    "duration": "5 إلى 7 أيام",
    "active": true
  },
  {
    "id": "t-446",
    "code": "TUM-23",
    "nameAr": "البروثرومبين المحرض بنقص فيتامين ك للكبد (PIVKA-II / DCP)",
    "nameEn": "DCP / PIVKA-II Liver Cancer Biomarker",
    "category": "tumors",
    "price": 750,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-447",
    "code": "TUM-24",
    "nameAr": "بروتين بيتا 2 ميكروجلوبيولين الدم للأورام الليمفاوية (Serum Beta-2 Microglobulin)",
    "nameEn": "Serum Beta-2 Microglobulin for Myeloma Staging",
    "category": "tumors",
    "price": 290,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-448",
    "code": "TUM-25",
    "nameAr": "الفوسفاتاز الحمضي البروستاتي (Prostatic Acid Phosphatase - PAP)",
    "nameEn": "Prostatic Acid Phosphatase Enzymatic",
    "category": "tumors",
    "price": 210,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-449",
    "code": "TUM-26",
    "nameAr": "دلالات أورام الثدي المحسوبة (CA 27-29)",
    "nameEn": "Cancer Antigen 27-29",
    "category": "tumors",
    "price": 450,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-450",
    "code": "TUM-27",
    "nameAr": "الأجسام المضادة للأورام العصبية Hu (Anti-Hu / ANNA-1)",
    "nameEn": "Anti-Hu Antibodies (ANNA-1)",
    "category": "tumors",
    "price": 750,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-451",
    "code": "TUM-28",
    "nameAr": "الأجسام المضادة للأورام Yo لتنكس المخيخ (Anti-Yo / PCA-1)",
    "nameEn": "Anti-Yo Antibodies (PCA-1)",
    "category": "tumors",
    "price": 750,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-452",
    "code": "TDM-01",
    "nameAr": "مستوى الديجوكسين لعضلة القلب بالدم (Serum Digoxin Level)",
    "nameEn": "Serum Digoxin Therapeutic Level",
    "category": "tdm",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-453",
    "code": "TDM-02",
    "nameAr": "مستوى الكاربامازيبين لعلاج الصرع (Carbamazepine / Tegretol Level)",
    "nameEn": "Serum Carbamazepine Level",
    "category": "tdm",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-454",
    "code": "TDM-03",
    "nameAr": "مستوى حمض الفالبرويك / الديباكين (Valproic Acid / Depakine Level)",
    "nameEn": "Valproic Acid (Depakine) Level",
    "category": "tdm",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-455",
    "code": "TDM-04",
    "nameAr": "مستوى الفينيتوين / الإيبانوتين (Phenytoin / Epanutin Level)",
    "nameEn": "Serum Phenytoin Level Total",
    "category": "tdm",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-456",
    "code": "TDM-05",
    "nameAr": "مستوى الفينوباربيتال (Phenobarbital Level)",
    "nameEn": "Serum Phenobarbital Level",
    "category": "tdm",
    "price": 260,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-457",
    "code": "TDM-06",
    "nameAr": "مستوى الليثيوم للطب النفسي (Serum Lithium Level)",
    "nameEn": "Serum Lithium by ISE",
    "category": "tdm",
    "price": 180,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-458",
    "code": "TDM-07",
    "nameAr": "مستوى الثيوفيللين لحساسية الصدر والربو (Serum Theophylline)",
    "nameEn": "Serum Theophylline Level",
    "category": "tdm",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-459",
    "code": "TDM-08",
    "nameAr": "مستوى الميثوتريكسات للأورام والروماتويد (Methotrexate MTX Level)",
    "nameEn": "High-Dose Methotrexate Level Monitoring",
    "category": "tdm",
    "price": 480,
    "duration": "خلال 3 ساعات",
    "active": true
  },
  {
    "id": "t-460",
    "code": "TDM-09",
    "nameAr": "مستوى السيكلوسبورين لمثبطات المناعة (Cyclosporine A - Whole Blood)",
    "nameEn": "Cyclosporine Whole Blood Trough Level (C0/C2)",
    "category": "tdm",
    "price": 520,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-461",
    "code": "TDM-10",
    "nameAr": "مستوى التاكروليموس لمثبطات المناعة (Tacrolimus / FK506 Whole Blood)",
    "nameEn": "Tacrolimus Whole Blood Level",
    "category": "tdm",
    "price": 550,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-462",
    "code": "TDM-11",
    "nameAr": "مستوى السيروليموس / الرابامايسين (Sirolimus / Rapamycin Whole Blood)",
    "nameEn": "Sirolimus Whole Blood Level",
    "category": "tdm",
    "price": 650,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-463",
    "code": "TDM-12",
    "nameAr": "مستوى الإيفروليموس (Everolimus Whole Blood Level)",
    "nameEn": "Everolimus Whole Blood Level",
    "category": "tdm",
    "price": 650,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-464",
    "code": "TDM-13",
    "nameAr": "مستوى الفانكوميسين بالدم (Vancomycin Peak & Trough Level)",
    "nameEn": "Vancomycin Peak / Trough Level",
    "category": "tdm",
    "price": 290,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-465",
    "code": "TDM-14",
    "nameAr": "مستوى الجنتاميسين بالدم (Gentamicin Peak & Trough Level)",
    "nameEn": "Gentamicin Level",
    "category": "tdm",
    "price": 290,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-466",
    "code": "TDM-15",
    "nameAr": "مستوى الأميكاسين بالدم (Amikacin Level)",
    "nameEn": "Amikacin Level",
    "category": "tdm",
    "price": 320,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-467",
    "code": "TDM-16",
    "nameAr": "مستوى الباراسيتامول / الأسيتامينوفين بالدم (Acetaminophen Level)",
    "nameEn": "Serum Acetaminophen Level for Toxicity",
    "category": "tdm",
    "price": 280,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-468",
    "code": "TDM-17",
    "nameAr": "مستوى الساليسيلات / الأسبرين بالدم (Salicylate Level)",
    "nameEn": "Serum Salicylate Level",
    "category": "tdm",
    "price": 260,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-469",
    "code": "TDM-18",
    "nameAr": "تحليل المخدرات الشامل السداسي بالبول (6-Drug Abuse Screen in Urine)",
    "nameEn": "6-Panel Drug Abuse Screen (THC, Opiates, Tramadol, Benzo, Amphetamine, Cocaine)",
    "category": "tdm",
    "price": 240,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-470",
    "code": "TDM-19",
    "nameAr": "تحليل المخدرات الشامل العشاري بالبول (10-Drug Abuse Screen in Urine)",
    "nameEn": "10-Panel Comprehensive Drug Screen",
    "category": "tdm",
    "price": 380,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-471",
    "code": "TDM-20",
    "nameAr": "تحليل الحشيش والبانجو النوعي والكمي (Cannabinoids / THC Urine Confirmation)",
    "nameEn": "THC Quantitative Confirmation",
    "category": "tdm",
    "price": 150,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-472",
    "code": "TDM-21",
    "nameAr": "تحليل الترامادول بالبول النوعي والكمي (Tramadol in Urine)",
    "nameEn": "Tramadol Detection in Urine",
    "category": "tdm",
    "price": 140,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-473",
    "code": "TDM-22",
    "nameAr": "تحليل الشابو والآيس بالبول (Methamphetamine / Crystal Meth in Urine)",
    "nameEn": "Methamphetamine (Crystal Meth) Screen",
    "category": "tdm",
    "price": 160,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-474",
    "code": "TDM-23",
    "nameAr": "تحليل المواد الأفيونية والهيروين بالبول (Opiates / Morphine Screen)",
    "nameEn": "Opiates Screen in Urine",
    "category": "tdm",
    "price": 140,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-475",
    "code": "TDM-24",
    "nameAr": "تحليل البنزوديازيبينات والمهدئات (Benzodiazepines Screen)",
    "nameEn": "Benzodiazepines in Urine",
    "category": "tdm",
    "price": 140,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-476",
    "code": "TDM-25",
    "nameAr": "تحليل الكحول الإيثيلي في الدم القانوني (Blood Alcohol Concentration - BAC)",
    "nameEn": "Blood Ethanol / Alcohol Level (Enzymatic / Headspace GC)",
    "category": "tdm",
    "price": 280,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-477",
    "code": "MIC-01",
    "nameAr": "مزرعة بول وحساسية المضادات الحيوية (Urine Culture & Sensitivity)",
    "nameEn": "Urine Culture & Antibiotic Sensitivity (Count & ID)",
    "category": "microbiology",
    "price": 280,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-478",
    "code": "MIC-02",
    "nameAr": "مزرعة دم هوائية ولاهوائية مع الحساسية (Blood Culture Aerobic & Anaerobic)",
    "nameEn": "Blood Culture & Sensitivity (2 Bottles)",
    "category": "microbiology",
    "price": 450,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-479",
    "code": "MIC-03",
    "nameAr": "مزرعة بلغم وحساسية المضادات الحيوية (Sputum Culture & Sensitivity)",
    "nameEn": "Sputum Culture & Sensitivity",
    "category": "microbiology",
    "price": 280,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-480",
    "code": "MIC-04",
    "nameAr": "مزرعة صديد وجروح وحساسية (Pus / Wound Swab Culture & Sensitivity)",
    "nameEn": "Wound Swab / Pus Culture & Sensitivity",
    "category": "microbiology",
    "price": 280,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-481",
    "code": "MIC-05",
    "nameAr": "مزرعة مسحة حلق وميكروبات اللوزتين (Throat Swab Culture & Sensitivity)",
    "nameEn": "Throat Swab Culture for Group A Strep",
    "category": "microbiology",
    "price": 260,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-482",
    "code": "MIC-06",
    "nameAr": "مزرعة براز وميكروبات الجهاز الهضمي (Stool Culture & Sensitivity)",
    "nameEn": "Stool Culture for Salmonella, Shigella & Campy",
    "category": "microbiology",
    "price": 290,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-483",
    "code": "MIC-07",
    "nameAr": "مزرعة سائل منوي وحساسية (Semen Culture & Sensitivity)",
    "nameEn": "Semen Culture & Sensitivity",
    "category": "microbiology",
    "price": 290,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-484",
    "code": "MIC-08",
    "nameAr": "مزرعة مسحة مهبلية وحساسية (High Vaginal Swab Culture - HVS)",
    "nameEn": "Vaginal Swab Culture & Sensitivity",
    "category": "microbiology",
    "price": 280,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-485",
    "code": "MIC-09",
    "nameAr": "مزرعة مسحة عنق الرحم (Endocervical Swab Culture)",
    "nameEn": "Endocervical Swab Culture for Gonorrhea & Chlamydia",
    "category": "microbiology",
    "price": 340,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-486",
    "code": "MIC-10",
    "nameAr": "مزرعة مسحة مجرى البول للرجال (Urethral Swab Culture & Sensitivity)",
    "nameEn": "Urethral Swab Culture",
    "category": "microbiology",
    "price": 290,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-487",
    "code": "MIC-11",
    "nameAr": "مزرعة مسحة العين وإفرازات الملتحمة (Eye Swab Culture & Sensitivity)",
    "nameEn": "Conjunctival / Eye Swab Culture",
    "category": "microbiology",
    "price": 280,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-488",
    "code": "MIC-12",
    "nameAr": "مزرعة مسحة الأذن (Ear Swab Culture & Sensitivity)",
    "nameEn": "Ear Discharge Culture & Sensitivity",
    "category": "microbiology",
    "price": 280,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-489",
    "code": "MIC-13",
    "nameAr": "مزرعة مسحة الأنف للميكروب العنقودي الذهبي المقاوم (MRSA Nasal Screen)",
    "nameEn": "MRSA Nasal Swab Screening Culture",
    "category": "microbiology",
    "price": 290,
    "duration": "48 ساعة",
    "active": true
  },
  {
    "id": "t-490",
    "code": "MIC-14",
    "nameAr": "مزرعة السائل النخاعي الشوكي وحساسية (CSF Culture & Sensitivity)",
    "nameEn": "Cerebrospinal Fluid Culture & Gram Stain",
    "category": "microbiology",
    "price": 480,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-491",
    "code": "MIC-15",
    "nameAr": "مزرعة السائل الزلالي للمفاصل وحساسية (Synovial Fluid Culture)",
    "nameEn": "Synovial Fluid Culture & Sensitivity",
    "category": "microbiology",
    "price": 380,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-492",
    "code": "MIC-16",
    "nameAr": "مزرعة سائل الاستسقاء البطني وحساسية (Ascitic Fluid Culture)",
    "nameEn": "Peritoneal / Ascitic Fluid Culture",
    "category": "microbiology",
    "price": 380,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-493",
    "code": "MIC-17",
    "nameAr": "مزرعة سائل الغشاء البلوري للصدر (Pleural Fluid Culture)",
    "nameEn": "Pleural Fluid Culture & Sensitivity",
    "category": "microbiology",
    "price": 380,
    "duration": "48 إلى 72 ساعة",
    "active": true
  },
  {
    "id": "t-494",
    "code": "MIC-18",
    "nameAr": "فحص وصبغة الفطريات بهيدروكسيد البوتاسيوم (Fungal KOH Preparation)",
    "nameEn": "Fungal Examination by 10% KOH",
    "category": "microbiology",
    "price": 120,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-495",
    "code": "MIC-19",
    "nameAr": "مزرعة الفطريات على بيئة سابورو وحساسيتها (Fungal Culture on Sabouraud)",
    "nameEn": "Fungal Culture & Identification",
    "category": "microbiology",
    "price": 320,
    "duration": "10 إلى 21 يوماً",
    "active": true
  },
  {
    "id": "t-496",
    "code": "MIC-20",
    "nameAr": "صبغة زيل نلسون المقاومة للأحماض لميكروب الدرن (AFB Smear by ZN Stain)",
    "nameEn": "Acid-Fast Bacilli (AFB) Smear Examination (3 Samples)",
    "category": "microbiology",
    "price": 180,
    "duration": "خلال 4 ساعات",
    "active": true
  },
  {
    "id": "t-497",
    "code": "MIC-21",
    "nameAr": "مزرعة بكتيريا السل على بيئة لونشتين ينسن (Lowenstein-Jensen TB Culture)",
    "nameEn": "Mycobacterium Tuberculosis Culture (LJ Medium)",
    "category": "microbiology",
    "price": 480,
    "duration": "4 إلى 8 أسابيع",
    "active": true
  },
  {
    "id": "t-498",
    "code": "MIC-22",
    "nameAr": "صبغة جرام المجهرية المباشرة (Direct Gram Stain Examination)",
    "nameEn": "Direct Gram Stain Smear",
    "category": "microbiology",
    "price": 80,
    "duration": "خلال 30 دقيقة",
    "active": true
  },
  {
    "id": "t-499",
    "code": "MIC-23",
    "nameAr": "صبغة الحبر الهندي لفطريات السحايا (India Ink for Cryptococcus Neoformans)",
    "nameEn": "India Ink CSF Preparation",
    "category": "microbiology",
    "price": 140,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-500",
    "code": "MIC-24",
    "nameAr": "مزرعة بكتيريا الكلوستريديوم ديفيسيل المفرزة للسموم (Clostridium Difficile Toxin A/B)",
    "nameEn": "C. Difficile Toxin A/B & GDH Antigen by EIA",
    "category": "microbiology",
    "price": 420,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-501",
    "code": "MIC-25",
    "nameAr": "اختبار حساسية المضادات الحيوية الآلي ميك (Automated MIC Sensitivity - VITEK 2)",
    "nameEn": "Automated Minimum Inhibitory Concentration (MIC)",
    "category": "microbiology",
    "price": 380,
    "duration": "24 ساعة",
    "active": true
  },
  {
    "id": "t-502",
    "code": "PAR-01",
    "nameAr": "تحليل بول كامل ميكروسكوبي وكيميائي (Complete Urinalysis - Automated & Microscopic)",
    "nameEn": "Complete Urinalysis with Microscopy",
    "category": "microbiology",
    "price": 70,
    "duration": "خلال 45 دقيقة",
    "active": true
  },
  {
    "id": "t-503",
    "code": "PAR-02",
    "nameAr": "تحليل براز كامل بالمجهر وفحص الطفيليات (Complete Stool Examination)",
    "nameEn": "Complete Stool Analysis & Parasitology",
    "category": "microbiology",
    "price": 70,
    "duration": "خلال 45 دقيقة",
    "active": true
  },
  {
    "id": "t-504",
    "code": "PAR-03",
    "nameAr": "الدم الخفي بالبراز المناعي المتطور (FOBT / FIT Immunochemical)",
    "nameEn": "Fecal Occult Blood Test (FIT)",
    "category": "microbiology",
    "price": 140,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-505",
    "code": "PAR-04",
    "nameAr": "مستضد الأميبا النسيجية بالبراز (Entamoeba Histolytica Antigen in Stool)",
    "nameEn": "Entamoeba Histolytica Adhesin Antigen by ELISA",
    "category": "microbiology",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-506",
    "code": "PAR-05",
    "nameAr": "مستضد طفيلي الجيارديا بالبراز (Giardia Lamblia Antigen in Stool)",
    "nameEn": "Giardia Lamblia Coproantigen by ELISA",
    "category": "microbiology",
    "price": 220,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-507",
    "code": "PAR-06",
    "nameAr": "مستضد طفيلي الكريبتوسبوريديوم بالبراز (Cryptosporidium Antigen / Modified ZN)",
    "nameEn": "Cryptosporidium Antigen & Modified Acid-Fast Stain",
    "category": "microbiology",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-508",
    "code": "PAR-07",
    "nameAr": "فحص مسحة شريط السلوفان للديدان الدبوسية (Scotch Tape Test for Enterobius)",
    "nameEn": "Scotch Tape Test for Pinworm (Enterobius vermicularis)",
    "category": "microbiology",
    "price": 90,
    "duration": "خلال نصف ساعة",
    "active": true
  },
  {
    "id": "t-509",
    "code": "PAR-08",
    "nameAr": "فحص السائل المنوي المحوسب الشامل (CASA Semen Analysis)",
    "nameEn": "Computer-Assisted Semen Analysis (CASA)",
    "category": "microbiology",
    "price": 250,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-510",
    "code": "PAR-09",
    "nameAr": "اختبار حيوية الحيوانات المنوية بالصبغة الحية (Sperm Viability Eosin-Nigrosin)",
    "nameEn": "Sperm Viability Stain",
    "category": "microbiology",
    "price": 140,
    "duration": "ساعة",
    "active": true
  },
  {
    "id": "t-511",
    "code": "PAR-10",
    "nameAr": "سكر الفركتوز في السائل المنوي (Seminal Fructose Quantitative)",
    "nameEn": "Seminal Plasma Fructose Level",
    "category": "microbiology",
    "price": 160,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-512",
    "code": "PAR-11",
    "nameAr": "اختبار الأجسام المضادة للحيوانات المنوية (MAR Test - Mixed Antiglobulin Reaction)",
    "nameEn": "MAR Test for Anti-Sperm Antibodies (IgG)",
    "category": "microbiology",
    "price": 280,
    "duration": "ساعتان",
    "active": true
  },
  {
    "id": "t-513",
    "code": "PAR-12",
    "nameAr": "فحص تفتت المادة الوراثية للحيوانات المنوية (Sperm DNA Fragmentation Index - DFI)",
    "nameEn": "Sperm DNA Fragmentation Assay (SCD / TUNEL)",
    "category": "microbiology",
    "price": 850,
    "duration": "24 إلى 48 ساعة",
    "active": true
  },
  {
    "id": "t-514",
    "code": "PAR-13",
    "nameAr": "فحص سائل المفاصل الميكروسكوبي والبلورات (Synovial Fluid Analysis & Crystals)",
    "nameEn": "Synovial Fluid Cell Count & Polarized Crystals",
    "category": "microbiology",
    "price": 280,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-515",
    "code": "PAR-14",
    "nameAr": "فحص سائل الاستسقاء البروتيني الخلوي (Ascitic Fluid Analysis - SAAG Ratio)",
    "nameEn": "Ascitic Fluid Albumin Gradient (SAAG)",
    "category": "microbiology",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-516",
    "code": "PAR-15",
    "nameAr": "فحص سائل الرئة البلوري (Pleural Fluid Analysis: Exudate vs Transudate)",
    "nameEn": "Pleural Fluid Analysis (Light Criteria: Protein & LDH)",
    "category": "microbiology",
    "price": 240,
    "duration": "خلال ساعتين",
    "active": true
  },
  {
    "id": "t-517",
    "code": "PAR-16",
    "nameAr": "فحص السائل النخاعي الشوكي الخلوي والكيميائي (CSF Routine Analysis)",
    "nameEn": "Cerebrospinal Fluid Analysis (Protein, Glucose, Cells)",
    "category": "microbiology",
    "price": 320,
    "duration": "خلال ساعة",
    "active": true
  },
  {
    "id": "t-518",
    "code": "PAR-17",
    "nameAr": "شريط بروتين الميالين القاعدي بالسائل النخاعي (CSF Myelin Basic Protein - MBP)",
    "nameEn": "Myelin Basic Protein in CSF",
    "category": "microbiology",
    "price": 750,
    "duration": "5 أيام",
    "active": true
  },
  {
    "id": "t-519",
    "code": "PAR-18",
    "nameAr": "أشرطة قلة النسائل بالسائل النخاعي والدم (CSF & Serum Oligoclonal Bands - OCB)",
    "nameEn": "Oligoclonal Bands by Isoelectric Focusing (IEF)",
    "category": "microbiology",
    "price": 950,
    "duration": "3 إلى 5 أيام",
    "active": true
  },
  {
    "id": "t-520",
    "code": "PAR-19",
    "nameAr": "مؤشر الغلوبيولين المناعي ج بالسائل النخاعي (CSF IgG Index)",
    "nameEn": "CSF IgG Index (CSF IgG / Albumin Ratio)",
    "category": "microbiology",
    "price": 420,
    "duration": "24 ساعة",
    "active": true
  }
];
