import type { Prize, PrizeCategory } from '../types';

interface RawPrizeSeed {
  id: string;
  title: string;
  discountLabel: string;
  category: PrizeCategory;
  description: string;
  validHours: number;
  weight: number;
  stock: number;
}

const RAW_PRIZES: RawPrizeSeed[] = [
  // 1. DISCOUNT — خصومات
  { id: 'prz_disc_15', title: 'خصم 15% على جميع التحاليل', discountLabel: 'خصم 15%', category: 'DISCOUNT', description: 'خصم فوري 15% على جميع التحاليل الطبية في فروع معامل RT أو السحب المنزلي.', validHours: 72, weight: 25, stock: 100 },
  { id: 'prz_disc_20', title: 'خصم 20% على جميع التحاليل', discountLabel: 'خصم 20%', category: 'DISCOUNT', description: 'خصم فوري 20% على جميع التحاليل الطبية في معامل RT.', validHours: 72, weight: 25, stock: 100 },
  { id: 'prz_disc_25', title: 'خصم 25% على جميع التحاليل', discountLabel: 'خصم 25%', category: 'DISCOUNT', description: 'خصم فوري 25% على جميع التحاليل الطبية في معامل RT.', validHours: 72, weight: 22, stock: 100 },
  { id: 'prz_disc_30', title: 'خصم 30% على جميع التحاليل', discountLabel: 'خصم 30%', category: 'DISCOUNT', description: 'خصم فوري 30% على جميع التحاليل الطبية في معامل RT.', validHours: 72, weight: 20, stock: 100 },
  { id: 'prz_disc_40', title: 'خصم 40% على جميع التحاليل', discountLabel: 'خصم 40%', category: 'DISCOUNT', description: 'خصم مميز 40% على جميع التحاليل الطبية في معامل RT.', validHours: 48, weight: 16, stock: 80 },
  { id: 'prz_disc_50', title: 'خصم 50% على جميع التحاليل', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'خصم استثنائي 50% على جميع التحاليل الطبية في معامل RT.', validHours: 48, weight: 12, stock: 60 },
  { id: 'prz_disc_60', title: 'خصم 60% على جميع التحاليل', discountLabel: 'خصم 60%', category: 'DISCOUNT', description: 'خصم خاص 60% على جميع التحاليل الطبية في معامل RT.', validHours: 48, weight: 8, stock: 40 },
  { id: 'prz_disc_70', title: 'خصم 70% على جميع التحاليل', discountLabel: 'خصم 70%', category: 'DISCOUNT', description: 'خصم كبير 70% على جميع التحاليل الطبية في معامل RT.', validHours: 48, weight: 5, stock: 30 },
  { id: 'prz_disc_80', title: 'خصم 80% على جميع التحاليل', discountLabel: 'خصم 80%', category: 'DISCOUNT', description: 'خصم ذهبي 80% على جميع التحاليل الطبية في معامل RT.', validHours: 24, weight: 3, stock: 20 },
  { id: 'prz_disc_pick_50', title: 'خصم 50% على تحليل من اختيارك', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'اختر أي تحليل تريده واحصل على خصم فوري 50% عند الحجز.', validHours: 72, weight: 18, stock: 80 },
  { id: 'prz_disc_pick_70', title: 'خصم 70% على تحليل من اختيارك', discountLabel: 'خصم 70%', category: 'DISCOUNT', description: 'اختر أي تحليل تريده واحصل على خصم فوري 70% عند الحجز.', validHours: 48, weight: 10, stock: 50 },
  { id: 'prz_disc_pick_80', title: 'خصم 80% على تحليل من اختيارك', discountLabel: 'خصم 80%', category: 'DISCOUNT', description: 'اختر أي تحليل تريده واحصل على خصم فوري 80% عند الحجز.', validHours: 48, weight: 6, stock: 30 },
  { id: 'prz_disc_pkg_basic_50', title: 'خصم 50% على باقة الفحص الأساسي', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'خصم 50% على باقة الفحص الأساسي الشاملة للاطمئنان الدوري.', validHours: 72, weight: 18, stock: 80 },
  { id: 'prz_disc_pkg_adv_50', title: 'خصم 50% على باقة الفحص المتقدم', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'خصم 50% على باقة الفحص المتقدم للاطمئنان الشامل.', validHours: 72, weight: 15, stock: 60 },
  { id: 'prz_disc_pkg_vip_50', title: 'خصم 50% على باقة VIP', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'خصم 50% على باقة VIP الفاخرة من معامل RT.', validHours: 72, weight: 10, stock: 40 },
  { id: 'prz_disc_check_basic_50', title: 'خصم 50% على الفحص الأساسي', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'خصم فوري 50% على باقة الفحص الأساسي (399 جنيه).', validHours: 72, weight: 16, stock: 70 },
  { id: 'prz_disc_check_adv_50', title: 'خصم 50% على الفحص المتقدم', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'خصم فوري 50% على باقة الفحص المتقدم (555 جنيه).', validHours: 72, weight: 14, stock: 60 },
  { id: 'prz_disc_check_vip_50', title: 'خصم 50% على فحص VIP', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'خصم فوري 50% على باقة فحص VIP (999 جنيه).', validHours: 72, weight: 10, stock: 40 },
  { id: 'prz_disc_adv_half', title: 'فحص متقدم بنصف السعر', discountLabel: 'نصف السعر', category: 'DISCOUNT', description: 'احصل على الفحص المتقدم بنصف السعر خلال فترة سريان الجائزة.', validHours: 72, weight: 14, stock: 60 },
  { id: 'prz_disc_vip_70', title: 'فحص VIP بخصم 70%', discountLabel: 'خصم 70%', category: 'DISCOUNT', description: 'عرض استثنائي: فحص VIP بخصم 70% في معامل RT.', validHours: 48, weight: 6, stock: 25 },
  { id: 'prz_disc_home_50', title: 'خصم 50% على الزيارة المنزلية', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'خصم 50% على رسوم خدمة السحب المنزلي من أي مكان.', validHours: 96, weight: 20, stock: 100 },
  { id: 'prz_disc_family_50', title: 'خصم 50% لأحد أفراد الأسرة', discountLabel: 'خصم 50%', category: 'DISCOUNT', description: 'هدية عائلية: خصم 50% لأحد أفراد أسرتك على تحاليله.', validHours: 72, weight: 16, stock: 80 },
  { id: 'prz_disc_friend_70', title: 'خصم 70% لصديقك', discountLabel: 'خصم 70%', category: 'DISCOUNT', description: 'شارك الخير: خصم 70% لصديقك عند حجزه في معامل RT.', validHours: 72, weight: 10, stock: 50 },
  { id: 'prz_disc_pair_code', title: 'كود خصم خاص لك ولصديقك', discountLabel: 'خصم مزدوج', category: 'DISCOUNT', description: 'كود خصم مميز يسري لك ولصديقك معاً في نفس الزيارة أو الحجز.', validHours: 72, weight: 15, stock: 70 },
  { id: 'prz_disc_family_3', title: 'خصم عائلي على 3 أفراد', discountLabel: 'خصم عائلي', category: 'DISCOUNT', description: 'خصم عائلي خاص يشمل 3 أفراد من نفس الأسرة.', validHours: 96, weight: 12, stock: 50 },

  // 2. FREE_SERVICE — تحاليل وفحوصات وزيارات
  { id: 'prz_free_cbc', title: 'تحليل CBC مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل صورة الدم الكاملة (CBC) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 22, stock: 80 },
  { id: 'prz_free_esr', title: 'تحليل ESR مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل سرعة الترسيب (ESR) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 20, stock: 80 },
  { id: 'prz_free_crp', title: 'تحليل CRP مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل البروتين التفاعلي (CRP) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_fbs', title: 'تحليل FBS مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل سكر الدم الصائم (FBS) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 22, stock: 90 },
  { id: 'prz_free_hba1c', title: 'تحليل HbA1c مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل السكر التراكمي (HbA1c) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 60 },
  { id: 'prz_free_alt', title: 'تحليل ALT مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل إنزيم الكبد (ALT / SGPT) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_ast', title: 'تحليل AST مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل إنزيم الكبد (AST / SGOT) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_creat', title: 'تحليل Creatinine مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل وظائف الكلى (Creatinine) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 20, stock: 80 },
  { id: 'prz_free_urea', title: 'تحليل Urea مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل البولينا في الدم (Urea) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 20, stock: 80 },
  { id: 'prz_free_uric', title: 'تحليل Uric Acid مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل حمض اليوريك للنقرس (Uric Acid) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_ca', title: 'تحليل Calcium مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل الكالسيوم في الدم مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_vitd', title: 'تحليل Vitamin D مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل فيتامين د (Vitamin D) مجاناً بالكامل في معامل RT.', validHours: 48, weight: 10, stock: 40 },
  { id: 'prz_free_vitb12', title: 'تحليل Vitamin B12 مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل فيتامين ب12 (Vitamin B12) مجاناً بالكامل في معامل RT.', validHours: 48, weight: 10, stock: 40 },
  { id: 'prz_free_tsh', title: 'تحليل TSH مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل الغدة الدرقية (TSH) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 14, stock: 50 },
  { id: 'prz_free_ferritin', title: 'تحليل Ferritin مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل مخزون الحديد (Ferritin) مجاناً بالكامل في معامل RT.', validHours: 48, weight: 12, stock: 50 },
  { id: 'prz_free_iron', title: 'تحليل Iron مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل الحديد في الدم (Iron) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 16, stock: 60 },
  { id: 'prz_free_chol', title: 'تحليل Cholesterol مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل الكوليسترول الكلي مجاناً بالكامل في معامل RT.', validHours: 72, weight: 20, stock: 80 },
  { id: 'prz_free_tg', title: 'تحليل Triglycerides مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل الدهون الثلاثية (Triglycerides) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 20, stock: 80 },
  { id: 'prz_free_hdl', title: 'تحليل HDL مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل الكوليسترول النافع (HDL) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_ldl', title: 'تحليل LDL مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل الكوليسترول الضار (LDL) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_albumin', title: 'تحليل Albumin مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل الألبيومين (Albumin) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_tp', title: 'تحليل Total Protein مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل البروتين الكلي (Total Protein) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_bili', title: 'تحليل Bilirubin مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل الصفراء (Bilirubin) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 18, stock: 70 },
  { id: 'prz_free_ggt', title: 'تحليل GGT مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'تحليل إنزيم الكبد والمرارة (GGT) مجاناً بالكامل في معامل RT.', validHours: 72, weight: 16, stock: 60 },
  { id: 'prz_free_pkg_399', title: 'فحص أساسي 399 جنيه مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'باقة الفحص الأساسي (بقيمة 399 جنيه) مجاناً بالكامل في معامل RT.', validHours: 48, weight: 8, stock: 30 },
  { id: 'prz_free_pkg_555', title: 'فحص متقدم 555 جنيه مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'باقة الفحص المتقدم (بقيمة 555 جنيه) مجاناً بالكامل في معامل RT.', validHours: 48, weight: 5, stock: 20 },
  { id: 'prz_free_pkg_999', title: 'فحص VIP 999 جنيه مجاناً', discountLabel: 'مجاني 100%', category: 'FREE_SERVICE', description: 'باقة فحص VIP الشاملة (بقيمة 999 جنيه) مجاناً بالكامل في معامل RT.', validHours: 48, weight: 3, stock: 10 },
  { id: 'prz_free_basic_family', title: 'فحص أساسي مجاني لأحد أفراد أسرتك', discountLabel: 'مجاني للأسرة', category: 'FREE_SERVICE', description: 'أهدِ باقة الفحص الأساسي مجاناً لأحد أفراد أسرتك.', validHours: 72, weight: 8, stock: 30 },
  { id: 'prz_free_full_pick', title: 'فحص شامل مجاني لشخص تختاره', discountLabel: 'فحص شامل مجاني', category: 'FREE_SERVICE', description: 'فحص شامل مجاني لشخص عزيز تختاره بنفسك في معامل RT.', validHours: 48, weight: 5, stock: 20 },
  { id: 'prz_free_test_family', title: 'تحليل مجاني لأحد أفراد الأسرة', discountLabel: 'مجاني للأسرة', category: 'FREE_SERVICE', description: 'تحليل طبي مجاني لأحد أفراد أسرتك عند الحجز.', validHours: 72, weight: 14, stock: 60 },
  { id: 'prz_free_basic_person', title: 'فحص أساسي مجاني لشخص من أسرتك', discountLabel: 'فحص مجاني', category: 'FREE_SERVICE', description: 'فحص أساسي مجاني لشخص تختاره من أفراد أسرتك.', validHours: 72, weight: 8, stock: 30 },
  { id: 'prz_free_test_friend', title: 'تحليل مجاني لصديق تختاره', discountLabel: 'مجاني لصديق', category: 'FREE_SERVICE', description: 'أهدِ تحليلاً مجانياً لصديق تختاره في معامل RT.', validHours: 72, weight: 12, stock: 50 },
  { id: 'prz_free_vip_home', title: 'فحص VIP مجاني + زيارة منزلية مجانية', discountLabel: 'VIP + سحب مجاني', category: 'FREE_SERVICE', description: 'الجائزة المميزة: فحص VIP كامل مجاناً مع خدمة السحب المنزلي مجاناً.', validHours: 48, weight: 3, stock: 10 },
  { id: 'prz_free_home_visit', title: 'زيارة منزلية مجانية', discountLabel: 'سحب مجاني', category: 'FREE_SERVICE', description: 'خدمة سحب عينات من المنزل مجاناً بدون أي رسوم انتقال.', validHours: 96, weight: 22, stock: 100 },
  { id: 'prz_free_home_family', title: 'زيارة منزلية مجانية لشخص من أسرتك', discountLabel: 'سحب مجاني للأسرة', category: 'FREE_SERVICE', description: 'خدمة سحب عينات منزلية مجانية لأحد أفراد أسرتك.', validHours: 96, weight: 16, stock: 70 },
  { id: 'prz_free_home_two', title: 'زيارتان منزليتان مجاناً', discountLabel: 'زيارتان مجاناً', category: 'FREE_SERVICE', description: 'رصيد زيارتين منزليتين مجانيتين لسحب العينات.', validHours: 168, weight: 10, stock: 40 },
  { id: 'prz_free_home_vip', title: 'زيارة منزلية VIP', discountLabel: 'سحب VIP مجاني', category: 'FREE_SERVICE', description: 'زيارة منزلية VIP بأولوية قصوى وخدمة فائقة في الموعد المحدد.', validHours: 96, weight: 12, stock: 50 },
  { id: 'prz_free_home_bday', title: 'زيارة منزلية مجانية في عيد ميلادك', discountLabel: 'هدية عيد ميلاد', category: 'FREE_SERVICE', description: 'احتفل بصحتك: زيارة سحب منزلي مجانية خلال شهر أو يوم عيد ميلادك.', validHours: 168, weight: 10, stock: 50 },
  { id: 'prz_free_delivery', title: 'توصيل نتائج التحاليل مجاناً', discountLabel: 'توصيل مجاني', category: 'FREE_SERVICE', description: 'توصيل التقرير المطبوع لنتائج التحاليل حتى باب المنزل مجاناً.', validHours: 96, weight: 20, stock: 100 },
  { id: 'prz_free_home_with_pkg', title: 'زيارة منزلية مجانية عند حجز باقة الفحص الشامل', discountLabel: 'زيارة مجانية', category: 'FREE_SERVICE', description: 'سحب منزلي مجاني بالكامل عند حجز أي من باقات الفحص الشامل.', validHours: 96, weight: 18, stock: 80 },

  // 3. PHYSICAL_GIFT — هدايا مادية
  { id: 'prz_phys_gift_love', title: 'هدية لشخص تحبه من RT LAB', discountLabel: 'هدية عينية', category: 'PHYSICAL_GIFT', description: 'هدية مادية مميزة مقدمة من معامل RT لشخص تحبه.', validHours: 72, weight: 14, stock: 50 },
  { id: 'prz_phys_bday_gift', title: 'هدية عيد ميلاد من RT LAB', discountLabel: 'هدية عيد ميلاد', category: 'PHYSICAL_GIFT', description: 'هدية مادية خاصة بمناسبة عيد الميلاد من أسرة معامل RT.', validHours: 168, weight: 12, stock: 50 },
  { id: 'prz_phys_voucher_100', title: 'قسيمة شراء بقيمة 100 جنيه', discountLabel: 'قسيمة 100 ج.م', category: 'PHYSICAL_GIFT', description: 'قسيمة مالية بقيمة 100 جنيه قابلة للاستخدام في خدمات معامل RT.', validHours: 168, weight: 14, stock: 60 },
  { id: 'prz_phys_voucher_200', title: 'قسيمة شراء بقيمة 200 جنيه', discountLabel: 'قسيمة 200 ج.م', category: 'PHYSICAL_GIFT', description: 'قسيمة مالية بقيمة 200 جنيه قابلة للاستخدام في خدمات معامل RT.', validHours: 168, weight: 8, stock: 35 },
  { id: 'prz_phys_voucher_500', title: 'قسيمة شراء بقيمة 500 جنيه', discountLabel: 'قسيمة 500 ج.م', category: 'PHYSICAL_GIFT', description: 'قسيمة ذهبية بقيمة 500 جنيه قابلة للاستخدام في معامل RT.', validHours: 168, weight: 4, stock: 15 },
  { id: 'prz_phys_full_box', title: 'فرصة الفوز ببوكس هدايا كامل', discountLabel: 'بوكس هدايا كامل', category: 'PHYSICAL_GIFT', description: 'تأهل لاستلام بوكس هدايا مادي متكامل من معامل RT.', validHours: 72, weight: 6, stock: 20 },
  { id: 'prz_phys_golden_box', title: 'THE GOLDEN HAPPINESS BOX – الجائزة الكبرى من RT LAB', discountLabel: 'الجائزة الكبرى', category: 'PHYSICAL_GIFT', description: 'البوكس الذهبي: الجائزة الكبرى الحصرية من معامل RT للتحاليل التشخيصية.', validHours: 72, weight: 2, stock: 5 },

  // 4. SURPRISE — مفاجآت والسحب
  { id: 'prz_surp_lucky_rt', title: 'أنت من المحظوظين في RT LAB', discountLabel: 'محظوظ RT LAB', category: 'SURPRISE', description: 'تهانينا! اسمك ضمن قائمة المحظوظين في معامل RT بميزة إضافية خاصة عند تشريفك.', validHours: 96, weight: 16, stock: 80 },
  { id: 'prz_surp_dr_rami', title: 'جائزة خاصة من دكتور رامي مختار', discountLabel: 'إهداء خاص', category: 'SURPRISE', description: 'جائزة وإهداء خاص ومميز من د. رامي مختار — استشاري الباثولوجيا الإكلينيكية.', validHours: 96, weight: 10, stock: 40 },
  { id: 'prz_surp_monthly_draw', title: 'ادخل السحب الشهري على الجائزة الكبرى', discountLabel: 'دخول السحب', category: 'SURPRISE', description: 'تم إدراج اسمك رسمياً في السحب الشهري لمعامل RT على الجائزة الكبرى.', validHours: 168, weight: 20, stock: 150 },
  { id: 'prz_surp_two_gifts', title: 'هديتان بدلاً من هدية واحدة', discountLabel: 'هديتان معاً', category: 'SURPRISE', description: 'مفاجأة سارة: ستحصل على هديتين عند تواصلك مع استقبال المعمل!', validHours: 72, weight: 12, stock: 50 },
  { id: 'prz_surp_share', title: 'فرصة مشاركة جائزتك مع شخص آخر', discountLabel: 'مشاركة الهدية', category: 'SURPRISE', description: 'مفاجأة مشاركة: يمكنك منح نفس ميزة جائزتك لشخص إضافي تختاره.', validHours: 72, weight: 14, stock: 60 },
  { id: 'prz_surp_raffle_ticket', title: 'تذكرة إضافية للسحب الشهري', discountLabel: 'تذكرة سحب', category: 'SURPRISE', description: 'تمت إضافة تذكرة إضافية باسمك لدخول السحب الشهري على الجوائز الكبرى.', validHours: 168, weight: 20, stock: 150 },
  { id: 'prz_surp_next_visit', title: 'مفاجأة تنتظرك في زيارتك القادمة', discountLabel: 'مفاجأة بالفرع', category: 'SURPRISE', description: 'مفاجأة خاصة محجوزة باسمك تُسلّم لك عند تشريفك في زيارتك القادمة.', validHours: 168, weight: 18, stock: 100 },
  { id: 'prz_surp_group_exclusive', title: 'جائزة حصرية لأعضاء جروب الفحص الشامل', discountLabel: 'حصرية للجروب', category: 'SURPRISE', description: 'مفاجأة وميزة حصرية مخصصة لأعضاء جروب الفحص الشامل لمعامل RT.', validHours: 72, weight: 14, stock: 70 },
  { id: 'prz_surp_vip_care', title: 'أنت تستحق معاملة VIP', discountLabel: 'معاملة VIP', category: 'SURPRISE', description: 'أولوية قصوى دون انتظار + ضيافة خاصة + متابعة طبية مباشرة من المعمل.', validHours: 96, weight: 16, stock: 80 },
  { id: 'prz_surp_happy_family', title: 'جائزة العائلة السعيدة', discountLabel: 'العائلة السعيدة', category: 'SURPRISE', description: 'مفاجأة عائلية خاصة من د. رامي مختار ومعامل RT لكل أفراد أسرتك.', validHours: 96, weight: 12, stock: 50 },

  // 5. PAID_OFFER — عروض مدفوعة خاصة (Slide 3 & 4: باقات بسعر خاص + 5 تحاليل بسعر معلن)
  { id: 'prz_paid_5tests_299', title: 'باقة 5 تحاليل أساسية بسعر خاص معلن 299 جنيه', discountLabel: 'عرض 299 ج.م', category: 'PAID_OFFER', description: 'باقة مدفوعة خاصة تشمل 5 تحاليل اطمئنان أساسية (CBC + FBS + Creatinine + ALT + Uric Acid) بسعر معلن 299 جنيه فقط.', validHours: 96, weight: 22, stock: 120 },
  { id: 'prz_paid_checkup_399', title: 'باقة الفحص الأساسي المعلنة بسعر 399 جنيه + خصم 15% إضافي', discountLabel: 'باقة 399 ج.م', category: 'PAID_OFFER', description: 'عرض باقة الفحص الأساسي المعلنة بسعر 399 جنيه شاملة سحب العينة والتقرير المعتمد.', validHours: 96, weight: 20, stock: 100 },
  { id: 'prz_paid_adv_555', title: 'باقة الفحص المتقدم الشاملة بسعر خاص 555 جنيه', discountLabel: 'باقة 555 ج.م', category: 'PAID_OFFER', description: 'عرض باقة الفحص المتقدم بسعر معلن 555 جنيه تشمل الكبد والكلى والسكر التراكمي والدهون.', validHours: 96, weight: 18, stock: 80 },
  { id: 'prz_paid_5vitamins_499', title: 'عرض باقة 5 تحاليل فيتامينات ومعادن بسعر خاص 499 جنيه', discountLabel: 'عرض 499 ج.م', category: 'PAID_OFFER', description: 'باقة مدفوعة موفرة تشمل (Vitamin D + B12 + Ferritin + Calcium + CBC) بسعر معلن 499 جنيه.', validHours: 96, weight: 16, stock: 80 },
  { id: 'prz_paid_vip_999', title: 'باقة VIP الشاملة بسعر خاص 999 جنيه + أولوية حجز', discountLabel: 'باقة VIP 999 ج.م', category: 'PAID_OFFER', description: 'عرض باقة VIP الشاملة بسعر خاص 999 جنيه مع أولوية حجز ونتائج سريعة.', validHours: 96, weight: 10, stock: 40 },
];

function detectFastingRequirement(title: string): string {
  const t = title.toLowerCase();
  if (
    t.includes('fbs') ||
    t.includes('cholesterol') ||
    t.includes('triglycerides') ||
    t.includes('hdl') ||
    t.includes('ldl')
  ) {
    return 'التحضير الطبي: يتطلب صياماً من 8 إلى 12 ساعة (يُسمح بشرب الماء فقط) قبل سحب العينة.';
  }
  if (t.includes('iron') && !t.includes('ferritin')) {
    return 'التحضير الطبي: يُفضل سحب العينة صباحاً مع صيام 8 ساعات للحصول على أدق قراءة للحديد.';
  }
  if (t.includes('فحص أساسي') || t.includes('فحص متقدم') || t.includes('فحص vip') || t.includes('باقة') || t.includes('فحص شامل')) {
    return 'التحضير الطبي: قد تتطلب بعض تحاليل الباقة صيام 8–10 ساعات (ماء فقط) — سيتم تأكيد التحضير عند الحجز.';
  }
  if (
    t.includes('cbc') ||
    t.includes('esr') ||
    t.includes('crp') ||
    t.includes('hba1c') ||
    t.includes('alt') ||
    t.includes('ast') ||
    t.includes('creatinine') ||
    t.includes('urea') ||
    t.includes('uric') ||
    t.includes('calcium') ||
    t.includes('vitamin') ||
    t.includes('tsh') ||
    t.includes('ferritin') ||
    t.includes('albumin') ||
    t.includes('total protein') ||
    t.includes('bilirubin') ||
    t.includes('ggt')
  ) {
    return 'التحضير الطبي: لا يشترط الصيام لهذا التحليل ويمكن إجراؤه في أي وقت خلال مواعيد العمل.';
  }
  return '';
}

export function buildDefaultPrizeTerms(input: {
  title: string;
  category: PrizeCategory;
  validHours: number;
}): string {
  const lines: string[] = [];
  const t = input.title;
  const prep = detectFastingRequirement(t);

  if (input.category === 'DISCOUNT' || input.category === 'discount') {
    if (t.includes('الزيارة المنزلية')) {
      lines.push('نطاق العرض: يسري الخصم على رسوم خدمة السحب المنزلي فقط، وتُحسب التحاليل بالأسعار المعتمدة.');
    } else if (t.includes('من اختيارك')) {
      lines.push('نطاق العرض: يُطبق الخصم على تحليل واحد فقط من اختيار المريض من قائمة المعمل.');
    } else if (t.includes('باقة') || t.includes('فحص')) {
      lines.push('نطاق العرض: يسري الخصم على إجمالي سعر الباقة المحددة فقط، ولا ينقسم على زيارات متعددة.');
    } else if (t.includes('أسرة') || t.includes('صديق') || t.includes('عائلي')) {
      lines.push('نطاق العرض: يخص المستفيد المذكور بالعنوان (فرد من الأسرة أو صديق)، ويُثبت اسمه عند الحجز عبر الواتساب.');
    } else {
      lines.push('نطاق العرض: يُطبق الخصم على التحاليل الطبية الأساسية والتخصصية المعتمدة داخل فروع المعمل.');
    }
    lines.push('لا يُجمع هذا الخصم مع أي عروض أو تعاقدات أو خصومات أخرى سارية إلا بموافقة إدارة المعمل.');
  } else if (
    input.category === 'FREE_SERVICE' ||
    input.category === 'free_test' ||
    input.category === 'package' ||
    input.category === 'home_visit'
  ) {
    if (t.includes('زيارة منزلية') || t.includes('زيارتان') || t.includes('توصيل')) {
      lines.push('نطاق الخدمة: تشمل الخدمة النطاق الجغرافي المعتمد لفروع المعمل وبالتنسيق المسبق لموعد الانتقال عبر الواتساب.');
    } else if (t.includes('أسرة') || t.includes('أسرتك') || t.includes('صديق') || t.includes('شخص تختاره')) {
      lines.push('نطاق الخدمة: الهدية قابلة للإهداء لشخص واحد من الأسرة أو صديق تختاره، ويُذكر اسمه ورقمه عند تأكيد الحجز.');
    } else {
      lines.push('نطاق الخدمة: تُجرى الخدمة مجاناً بالكامل (تحليل أو باقة فحص) بدون أي رسوم إضافية عند الحضور للفرع.');
    }
    lines.push('في حالة طلب سحب منزلي للتحليل المجاني قد تُطبق رسوم الانتقال المعتادة ما لم تشمل الجائزة زيارة منزلية مجانية.');
  } else if (input.category === 'PHYSICAL_GIFT' || input.category === 'gift') {
    if (t.includes('قسيمة')) {
      lines.push('شروط القسيمة: تُخصم القيمة الكاملة للقسيمة لمرة واحدة من إجمالي فاتورة التحاليل ولا تُستبدل بنقود ولا يُرد فرق نقدي.');
    } else if (t.includes('THE GOLDEN HAPPINESS BOX') || t.includes('بوكس هدايا')) {
      lines.push('شروط التسليم: تُسلّم الجائزة المادية شخصياً بالفرع أو تُرتب مع الإدارة بعد مطابقة كود الفوز ورقم الهاتف المسجل.');
    } else {
      lines.push('شروط الاستلام: تُسلّم الهدية العينية عند الحضور للفرع أو مع فريق السحب المنزلي بشرط تأكيد الكود مسبقاً.');
    }
  } else if (input.category === 'PAID_OFFER') {
    lines.push('نطاق العرض المدفوع: السعر المعلن يشمل كافة التحاليل المحددة في الباقة ورسوم السحب بالفرع بدون أي رسوم خفية.');
    lines.push('تُجرى الباقة في أي فرع من فروع معامل RT خلال ساعات العمل الرسمية، ويُعلن أي تحضير مطلوب (كالصيام) بوضوح قبل السحب.');
  } else {
    if (t.includes('سحب') || t.includes('تذكرة')) {
      lines.push('آلية السحب: يُسجل كود الجائزة واسم العميل تلقائياً في السحب الشهري المعلن في معامل RT وتُعلن النتائج على القنوات الرسمية.');
    } else if (t.includes('جروب الفحص الشامل')) {
      lines.push('شرط الأهلية: مخصصة لأعضاء جروب الفحص الشامل لمعامل RT وتُفعل فور إرسال الكود لواتساب المعمل.');
    } else if (t.includes('مشاركة')) {
      lines.push('آلية المشاركة: تتيح لك منح نفس الميزة لشخص واحد تختاره عند حجز نفس الموعد أو التنسيق بالواتساب.');
    } else {
      lines.push('آلية التفعيل: تواصل عبر زر الواتساب لإثبات الكود وتحديد الموعد أو الاستفسار عن تفاصيل المفاجأة الخاصة بك.');
    }
  }

  if (prep) lines.push(prep);
  lines.push(`صلاحية الكود: سارية لمدة ${input.validHours} ساعة من لحظة فتح الصندوق، وتُستخدم لمرة واحدة فقط.`);
  lines.push('شرط الصرف: يلزم إرسال رسالة الكود لواتساب المعمل وتقديمه للاستقبال قبل انتهاء العداد الزمني.');

  return lines.join('\n');
}

export function resolvePrizeDistributionTier(prize: Pick<Prize, 'category' | 'title' | 'discountLabel' | 'distributionTier'>): NonNullable<Prize['distributionTier']> {
  if (prize.distributionTier) return prize.distributionTier;
  const t = `${prize.title} ${prize.discountLabel}`.toLowerCase();
  if (prize.category === 'PAID_OFFER') return 'paid_offer';
  if (prize.category === 'DISCOUNT' || prize.category === 'discount') {
    if (t.includes('60%') || t.includes('70%') || t.includes('80%')) return 'disc_high';
    return 'disc_mid';
  }
  if (
    prize.category === 'PHYSICAL_GIFT' ||
    prize.category === 'gift' ||
    t.includes('golden') ||
    t.includes('الجائزة الكبرى') ||
    t.includes('قسيمة') ||
    t.includes('vip 999')
  ) {
    return 'grand_prize';
  }
  if (prize.category === 'SURPRISE') return 'vip_surprise';
  return 'free_gift';
}

export const DEFAULT_PRIZES: Prize[] = RAW_PRIZES.map((p) => ({
  ...p,
  distributionTier: resolvePrizeDistributionTier(p),
  terms: buildDefaultPrizeTerms(p),
  usedCount: 0,
  active: true,
}));

export function resolvePrizeTermsLines(input: {
  prizeId?: string | null;
  title: string;
  category: PrizeCategory;
  terms?: string | null;
  validHours: number;
}): string[] {
  const direct = (input.terms || '').trim();
  if (direct) {
    return direct
      .split('\n')
      .map((line) => line.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);
  }
  const matched = DEFAULT_PRIZES.find(
    (p) => (input.prizeId && p.id === input.prizeId) || p.title === input.title
  );
  const raw = matched?.terms || buildDefaultPrizeTerms(input);
  return raw
    .split('\n')
    .map((line) => line.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean);
}

export const PRIZE_CATEGORY_META: Record<
  string,
  { label: string; shortLabel: string; badgeClass: string }
> = {
  DISCOUNT: {
    label: 'DISCOUNT — خصومات',
    shortLabel: 'خصومات',
    badgeClass: 'border-amber-300 bg-amber-50 text-amber-900',
  },
  FREE_SERVICE: {
    label: 'FREE_SERVICE — تحاليل وفحوصات وزيارات',
    shortLabel: 'تحاليل وخدمات مجانية',
    badgeClass: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  },
  PAID_OFFER: {
    label: 'PAID_OFFER — عروض وباقات مدفوعة خاصة',
    shortLabel: 'عرض مدفوع خاص',
    badgeClass: 'border-[#C9962D]/50 bg-[#FFF8EB] text-[#7A5600]',
  },
  PHYSICAL_GIFT: {
    label: 'PHYSICAL_GIFT — هدايا مادية وقسائم',
    shortLabel: 'هدايا مادية',
    badgeClass: 'border-[#5C1422]/25 bg-[#5C1422]/8 text-[#5C1422]',
  },
  SURPRISE: {
    label: 'SURPRISE — مفاجآت VIP والسحب والولاء',
    shortLabel: 'مفاجآت وولاء',
    badgeClass: 'border-[#7A1C2E]/25 bg-[#FDF2F4] text-[#5C1422]',
  },
  // Legacy fallback labels
  discount: {
    label: 'DISCOUNT — خصومات',
    shortLabel: 'خصومات',
    badgeClass: 'border-amber-300 bg-amber-50 text-amber-900',
  },
  free_test: {
    label: 'FREE_SERVICE — تحاليل وفحوصات وزيارات',
    shortLabel: 'تحاليل مجانية',
    badgeClass: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  },
  package: {
    label: 'FREE_SERVICE — تحاليل وفحوصات وزيارات',
    shortLabel: 'باقات فحص',
    badgeClass: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  },
  home_visit: {
    label: 'FREE_SERVICE — تحاليل وفحوصات وزيارات',
    shortLabel: 'زيارات منزلية',
    badgeClass: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  },
  gift: {
    label: 'PHYSICAL_GIFT — هدايا مادية',
    shortLabel: 'هدايا مادية',
    badgeClass: 'border-[#5C1422]/25 bg-[#5C1422]/8 text-[#5C1422]',
  },
};
