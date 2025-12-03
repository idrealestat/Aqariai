/**
 * 🔧 أداة تصحيح أخطاء التخزين
 * ────────────────────────────────────────────────────────────────
 * 📌 الهدف: تسهيل تصحيح مشاكل localStorage و IndexedDB
 * ────────────────────────────────────────────────────────────────
 */

export const debugStorage = {
  /**
   * طباعة جميع بيانات المستخدم الحالي
   */
  printUserData() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 [DEBUG] بيانات المستخدم الحالي');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const user = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
    console.log('👤 User Object:', user);
    console.log('🆔 User ID:', user.id);
    console.log('📱 Phone:', user.phone);
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  },

  /**
   * طباعة جميع العروض
   */
  printOffers() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 [DEBUG] جميع العروض');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const user = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      console.error('❌ لا يوجد userId - لا يمكن جلب العروض');
      return;
    }
    
    const key = `owner-full-offers-${userId}`;
    const offers = JSON.parse(localStorage.getItem(key) || '[]');
    
    console.log(`🔑 المفتاح: ${key}`);
    console.log(`📊 عدد العروض: ${offers.length}`);
    
    offers.forEach((offer: any, index: number) => {
      console.log(`\n📦 العرض #${index + 1}:`);
      console.log(`   - ID: ${offer.id}`);
      console.log(`   - العنوان: ${offer.title}`);
      console.log(`   - المدينة: ${offer.city}`);
      console.log(`   - النوع: ${offer.propertyType}`);
      console.log(`   - الصور: ${offer.mediaIds?.length || 0}`);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  },

  /**
   * طباعة جميع مفاتيح localStorage
   */
  printAllKeys() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 [DEBUG] جميع مفاتيح localStorage');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const keys = Object.keys(localStorage);
    console.log(`📊 عدد المفاتيح: ${keys.length}`);
    
    keys.forEach((key, index) => {
      const value = localStorage.getItem(key);
      const size = value ? (value.length / 1024).toFixed(2) : '0';
      console.log(`${index + 1}. ${key} (${size} KB)`);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  },

  /**
   * مسح جميع البيانات (مع تأكيد)
   */
  clearAll() {
    if (!confirm('⚠️ هل أنت متأكد من حذف جميع البيانات؟')) {
      return;
    }

    const user = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
    const userId = user.id;

    if (userId) {
      localStorage.removeItem(`owner-full-offers-${userId}`);
      localStorage.removeItem(`owner-full-requests-${userId}`);
      localStorage.removeItem(`crm-customers-${userId}`);
    }

    localStorage.removeItem('marketplace-offers');
    localStorage.removeItem('broker-responses');
    localStorage.removeItem('crm_customers');

    // مسح IndexedDB
    import('./indexedDBStorage').then(({ clearAllMedia }) => {
      clearAllMedia().then(() => {
        console.log('✅ تم مسح جميع البيانات!');
        alert('✅ تم مسح جميع البيانات بنجاح!');
      });
    });
  },

  /**
   * إنشاء بيانات تجريبية
   */
  createDemoUser() {
    const demoUser = {
      id: 'demo-user-0501234567',
      name: 'مستخدم تجريبي',
      phone: '0501234567',
      type: 'individual',
      plan: 'bronze',
      email: 'demo@test.com'
    };

    localStorage.setItem('aqary-crm-user', JSON.stringify(demoUser));
    console.log('✅ تم إنشاء مستخدم تجريبي:', demoUser);
    return demoUser;
  },

  /**
   * التحقق من صحة البيانات
   */
  validate() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ [DEBUG] التحقق من صحة البيانات');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const user = JSON.parse(localStorage.getItem('aqary-crm-user') || '{}');
    
    const checks = {
      'user موجود': !!user && Object.keys(user).length > 0,
      'user.id موجود': !!user.id,
      'user.phone موجود': !!user.phone,
      'user.name موجود': !!user.name,
      'مفتاح العروض صحيح': user.id ? !!localStorage.getItem(`owner-full-offers-${user.id}`) : false,
      'مفتاح الطلبات صحيح': user.id ? !!localStorage.getItem(`owner-full-requests-${user.id}`) : false
    };

    Object.entries(checks).forEach(([check, result]) => {
      console.log(`${result ? '✅' : '❌'} ${check}`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return checks;
  }
};

// إتاحة الأداة عالمياً للاستخدام في Console
if (typeof window !== 'undefined') {
  (window as any).debugStorage = debugStorage;
  console.log('🔧 أداة التصحيح جاهزة! استخدم debugStorage في Console');
  console.log('📌 الأوامر المتاحة:');
  console.log('   - debugStorage.printUserData()   // طباعة بيانات المستخدم');
  console.log('   - debugStorage.printOffers()      // طباعة جميع العروض');
  console.log('   - debugStorage.printAllKeys()     // طباعة جميع المفاتيح');
  console.log('   - debugStorage.validate()         // التحقق من صحة البيانات');
  console.log('   - debugStorage.createDemoUser()   // إنشاء مستخدم تجريبي');
  console.log('   - debugStorage.clearAll()         // مسح جميع البيانات');
}
