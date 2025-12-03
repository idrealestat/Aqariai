# 📱 **Wasata AI - مواصفات صفحة تسجيل الدخول لـ FlutterFlow**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🎨 WASATA AI LOGIN PAGE - FLUTTERFLOW SPECS 🎨        ║
║                                                               ║
║   وصف تفصيلي كامل | جاهز للتنفيذ في FlutterFlow           ║
║   التصميم الحالي بدون تغيير                                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📐 **1. Layout الرئيسي (Main Container)**

### **Container الخارجي:**

```yaml
Widget: Container
Properties:
  - width: MediaQuery width (100%)
  - height: MediaQuery height (100%)
  - direction: RTL
  - padding: EdgeInsets.all(16)
  
Decoration:
  - type: BoxDecoration
  - gradient: LinearGradient
    - begin: Alignment.topLeft
    - end: Alignment.bottomRight
    - colors:
      - Color(0x0D01411C)  # rgba(1, 65, 28, 0.05)
      - Color(0xFFFFFFFF)  # white
      - Color(0x0DD4AF37)  # rgba(212, 175, 55, 0.05)
    - stops: [0.0, 0.5, 1.0]
```

---

### **ScrollView (للتجاوب):**

```yaml
Widget: SingleChildScrollView
Properties:
  - physics: AlwaysScrollableScrollPhysics
  - padding: EdgeInsets.symmetric(vertical: 20)
  
Child: Center(
  child: Container(
    width: min(400, MediaQuery.width - 32)
    # Mobile: 100% - padding
    # Desktop: max 400px
  )
)
```

---

## 🎴 **2. البطاقة الرئيسية (Main Card)**

### **Card Container:**

```yaml
Widget: Container
Properties:
  - width: 100% (من parent)
  - constraints:
      maxWidth: 400  # Desktop
      maxWidth: double.infinity  # Mobile
  
Decoration:
  - type: BoxDecoration
  - color: Color(0xFFFFFFFF)  # white
  - borderRadius: BorderRadius.circular(24)  # Desktop
  - borderRadius: BorderRadius.circular(16)  # Mobile < 640px
  - boxShadow:
    - color: Color(0x40000000)  # rgba(0, 0, 0, 0.25)
    - offset: Offset(0, 25)
    - blurRadius: 50
    - spreadRadius: -12
  - border: Border.all(
      color: Color(0xFFF3F4F6),  # gray-100
      width: 1
    )

Responsive Breakpoints:
  - < 640px: borderRadius 16, padding 20
  - 640-768px: borderRadius 20, padding 24
  - > 768px: borderRadius 24, padding 32
```

---

## 🎨 **3. الهيدر (Header Section)**

### **Header Container:**

```yaml
Widget: Container
Properties:
  - width: 100%
  - padding: 
      EdgeInsets.all(40)  # Desktop
      EdgeInsets.all(24)  # Mobile
  - alignment: Alignment.center
  
Decoration:
  - type: BoxDecoration
  - gradient: LinearGradient
    - begin: Alignment.centerRight
    - end: Alignment.centerLeft
    - colors:
      - Color(0xFF01411C)      # #01411C
      - Color(0xE601411C)      # rgba(1, 65, 28, 0.9)
    - stops: [0.0, 1.0]
  - borderRadius: BorderRadius.only(
      topLeft: Radius.circular(24),   # Desktop
      topRight: Radius.circular(24)   # Desktop
    )

Child Stack (للزخارف):
  - Background Decorations (opacity: 0.1)
  - Logo & Text (z-index: 10)
```

---

### **الزخارف الخلفية:**

```yaml
Widget: Stack
Position: Absolute
Children:
  
  # دائرة علوية يسار
  - Positioned(
      top: 0,
      left: 0,
      child: Container(
        width: 160,  # Desktop | 128 Mobile
        height: 160,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Color(0x1AD4AF37),  # rgba(212, 175, 55, 0.1)
          blur: 48
        )
      )
    )
  
  # دائرة سفلية يمين
  - Positioned(
      bottom: 0,
      right: 0,
      child: Container(
        width: 160,
        height: 160,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Color(0x1AD4AF37),
          blur: 48
        )
      )
    )

Animation: 
  - Both circles: pulse animation (2s, infinite)
  - Delay: 1s between circles
```

---

### **3.1 الشعار (Logo):**

```yaml
Widget: Column
Alignment: Center
Children:

  # حاوية الشعار
  - Container:
      width: 80   # Desktop
      height: 80  # Desktop
      width: 64   # Mobile < 640px
      height: 64  # Mobile < 640px
      
      decoration:
        - color: Color(0xFFFFFFFF)  # white
        - borderRadius: BorderRadius.circular(16)  # Desktop
        - borderRadius: BorderRadius.circular(12)  # Mobile
        - boxShadow:
          - color: Color(0x1A000000)  # rgba(0, 0, 0, 0.1)
          - offset: Offset(0, 10)
          - blurRadius: 15
          - spreadRadius: -3
      
      margin: EdgeInsets.only(bottom: 16)  # Desktop
      margin: EdgeInsets.only(bottom: 12)  # Mobile
      
      child: Center(
        # أيقونة SVG
        child: CustomPaint(
          size: Size(48, 48)  # Desktop
          size: Size(40, 40)  # Mobile
          painter: HouseIconPainter()
        )
      )

Hover Effect:
  - Transform.scale(1.05)
  - Duration: 300ms
  - Curve: Curves.easeOut
```

---

### **أيقونة البيت (SVG Icon):**

```dart
// CustomPainter للأيقونة
class HouseIconPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // المسار الرئيسي - جسم البيت
    final pathFill = Path();
    pathFill.moveTo(size.width * 0.5, size.height * 0.083);  // Top center
    pathFill.lineTo(size.width * 0.125, size.height * 0.333); // Top left
    pathFill.lineTo(size.width * 0.125, size.height * 0.875); // Bottom left
    pathFill.lineTo(size.width * 0.375, size.height * 0.875); // Inner left
    pathFill.lineTo(size.width * 0.375, size.height * 0.583); // Inner top left
    pathFill.lineTo(size.width * 0.625, size.height * 0.583); // Inner top right
    pathFill.lineTo(size.width * 0.625, size.height * 0.875); // Inner right
    pathFill.lineTo(size.width * 0.875, size.height * 0.875); // Bottom right
    pathFill.lineTo(size.width * 0.875, size.height * 0.333); // Top right
    pathFill.close();
    
    // رسم المساحة المملوءة
    final paintFill = Paint()
      ..color = Color(0xFF01411C)  // #01411C
      ..style = PaintingStyle.fill;
    canvas.drawPath(pathFill, paintFill);
    
    // رسم الحدود الذهبية
    final paintStroke = Paint()
      ..color = Color(0xFFD4AF37)  // #D4AF37
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    canvas.drawPath(pathFill, paintStroke);
    
    // نجمة AI الصغيرة
    final circlePaint = Paint()
      ..color = Color(0xFFD4AF37)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(
      Offset(size.width * 0.792, size.height * 0.208),
      3,
      circlePaint
    );
  }
  
  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

// Animation للنجمة
AnimatedWidget:
  - Animation: ping (scale + opacity)
  - Duration: 1s
  - Repeat: infinite
```

---

### **3.2 اسم التطبيق:**

```yaml
Widget: Text
Properties:
  - text: "Wasata AI"
  - textAlign: TextAlign.center
  - textDirection: TextDirection.rtl
  
Style:
  - fontSize: 36  # Desktop (> 768px)
  - fontSize: 30  # Tablet (640-768px)
  - fontSize: 24  # Mobile (< 640px)
  - fontWeight: FontWeight.w700  # bold
  - color: Color(0xFFFFFFFF)  # white
  - letterSpacing: -0.5
  
Margin:
  - EdgeInsets.only(bottom: 8)
```

---

### **3.3 Tagline (الوصف):**

```yaml
Widget: Row
mainAxisAlignment: MainAxisAlignment.center
crossAxisAlignment: CrossAxisAlignment.center
Children:

  # خط ديكور أيسر
  - Container(
      width: 48,   # Desktop
      width: 32,   # Mobile
      height: 1,
      color: Color(0x80D4AF37)  # rgba(212, 175, 55, 0.5)
    )
  
  # Spacer
  - SizedBox(width: 8)
  
  # أيقونة Sparkles
  - Icon(
      Icons.auto_awesome,
      size: 16,   # Desktop
      size: 12,   # Mobile
      color: Color(0xFFD4AF37)  # gold
    )
  
  # النص
  - Text(
      "وساطة عقارية ذكية",
      style: TextStyle(
        fontSize: 14,   # Desktop
        fontSize: 12,   # Mobile
        color: Color(0xFFD4AF37),
        fontWeight: FontWeight.w400
      )
    )
  
  # أيقونة Sparkles
  - Icon(Icons.auto_awesome, ...)
  
  # Spacer
  - SizedBox(width: 8)
  
  # خط ديكور أيمن
  - Container(...)
```

---

## 📝 **4. محتوى النموذج (Form Section)**

### **Form Container:**

```yaml
Widget: Container
Properties:
  - padding: EdgeInsets.all(32)  # Desktop
  - padding: EdgeInsets.all(20)  # Mobile
  
Child: Column(
  crossAxisAlignment: CrossAxisAlignment.stretch,
  children: [...]
)
```

---

### **4.1 عنوان الترحيب:**

```yaml
Widget: Column
Children:

  # العنوان الرئيسي
  - Text(
      "مرحباً بك",
      textAlign: TextAlign.center,
      style: TextStyle(
        fontSize: 24,   # Desktop
        fontSize: 20,   # Mobile
        fontWeight: FontWeight.w700,
        color: Color(0xFF111827)  # gray-900
      )
    )
  
  # Spacer
  - SizedBox(height: 8)
  
  # النص الفرعي
  - Text(
      "سجل دخولك للوصول إلى حسابك",
      textAlign: TextAlign.center,
      style: TextStyle(
        fontSize: 16,   # Desktop
        fontSize: 14,   # Mobile
        fontWeight: FontWeight.w400,
        color: Color(0xFF6B7280)  # gray-600
      )
    )

Margin:
  - EdgeInsets.only(bottom: 32)  # Desktop
  - EdgeInsets.only(bottom: 24)  # Mobile
```

---

### **4.2 حقل الإيميل/الجوال:**

```yaml
Widget: Column
crossAxisAlignment: CrossAxisAlignment.start
Children:

  # Label
  - Text(
      "البريد الإلكتروني أو رقم الجوال",
      style: TextStyle(
        fontSize: 16,   # Desktop
        fontSize: 14,   # Mobile
        fontWeight: FontWeight.w500,
        color: Color(0xFF374151)  # gray-700
      )
    )
  
  # Spacer
  - SizedBox(height: 8)
  
  # حقل الإدخال
  - Container(
      height: 56,  # Desktop
      height: 48,  # Mobile
      
      child: TextField(
        textAlign: TextAlign.right,
        textDirection: TextDirection.rtl,
        keyboardType: TextInputType.text,
        
        decoration: InputDecoration(
          hintText: "example@email.com أو 05xxxxxxxx",
          hintStyle: TextStyle(
            fontSize: 16,   # Desktop
            fontSize: 14,   # Mobile
            color: Color(0xFF9CA3AF)  # gray-400
          ),
          
          # أيقونة يسار (تتغير ديناميكياً)
          prefixIcon: Padding(
            padding: EdgeInsets.only(left: 16, right: 12),
            child: Icon(
              _isEmail ? Icons.email_outlined : Icons.phone_outlined,
              size: 20,
              color: _isFocused 
                ? Color(0xFF01411C)   # عند Focus
                : Color(0xFF9CA3AF)   # Default
            )
          ),
          
          # Border - Default
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color: Color(0xFFE5E7EB),  # gray-200
              width: 2
            )
          ),
          
          # Border - Focus
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(
              color: Color(0xFF01411C),  # green
              width: 2
            )
          ),
          
          # Fill
          filled: true,
          fillColor: Color(0xFFFFFFFF),
          
          # Padding
          contentPadding: EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16
          )
        ),
        
        # Controller للتحقق من نوع الإدخال
        onChanged: (value) {
          setState(() {
            _isEmail = value.contains('@');
          });
        }
      )
    )

Margin:
  - EdgeInsets.only(bottom: 24)  # Desktop
  - EdgeInsets.only(bottom: 20)  # Mobile

Focus Effect:
  - عند Focus:
    - borderColor: #01411C
    - Ring: 4px rgba(1, 65, 28, 0.1)
    - Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
    - Icon color: #01411C
  
  - عند عدم Focus:
    - borderColor: #E5E7EB
    - No ring
    - No shadow
    - Icon color: #9CA3AF
```

---

### **منطق كشف الإيميل/الجوال:**

```dart
// State variables
bool _isEmail = false;
bool _isEmailFocused = false;

// في onChanged للـ TextField
onChanged: (String value) {
  setState(() {
    _isEmail = value.contains('@');
  });
}

// في onFocusChange
onFocusChange: (bool hasFocus) {
  setState(() {
    _isEmailFocused = hasFocus;
  });
}

// الأيقونة الديناميكية
Icon(
  _isEmail ? Icons.email_outlined : Icons.phone_outlined,
  color: _isEmailFocused 
    ? Color(0xFF01411C) 
    : Color(0xFF9CA3AF)
)
```

---

### **4.3 حقل كلمة المرور:**

```yaml
Widget: Column
crossAxisAlignment: CrossAxisAlignment.start
Children:

  # Label
  - Text(
      "كلمة المرور",
      style: TextStyle(
        fontSize: 16,   # Desktop
        fontSize: 14,   # Mobile
        fontWeight: FontWeight.w500,
        color: Color(0xFF374151)  # gray-700
      )
    )
  
  # Spacer
  - SizedBox(height: 8)
  
  # حقل الإدخال
  - Container(
      height: 56,  # Desktop
      height: 48,  # Mobile
      
      child: TextField(
        textAlign: TextAlign.right,
        textDirection: TextDirection.rtl,
        obscureText: !_showPassword,  # إخفاء/إظهار
        
        decoration: InputDecoration(
          hintText: "••••••••",
          hintStyle: TextStyle(
            fontSize: 16,
            color: Color(0xFF9CA3AF)
          ),
          
          # أيقونة القفل (يسار)
          prefixIcon: Padding(
            padding: EdgeInsets.only(left: 16, right: 12),
            child: Icon(
              Icons.lock_outline,
              size: 20,
              color: _isPasswordFocused 
                ? Color(0xFF01411C)
                : Color(0xFF9CA3AF)
            )
          ),
          
          # زر إظهار/إخفاء (يمين)
          suffixIcon: Padding(
            padding: EdgeInsets.only(right: 16, left: 12),
            child: IconButton(
              icon: Icon(
                _showPassword 
                  ? Icons.visibility_off_outlined 
                  : Icons.visibility_outlined,
                size: 20,
                color: Color(0xFF9CA3AF)
              ),
              onPressed: () {
                setState(() {
                  _showPassword = !_showPassword;
                });
              }
            )
          ),
          
          # نفس Borders من حقل الإيميل
          enabledBorder: OutlineInputBorder(...),
          focusedBorder: OutlineInputBorder(...),
          filled: true,
          fillColor: Color(0xFFFFFFFF),
          contentPadding: EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16
          )
        )
      )
    )

Margin:
  - EdgeInsets.only(bottom: 12)
```

---

### **منطق إظهار/إخفاء كلمة المرور:**

```dart
// State variable
bool _showPassword = false;

// زر Toggle
IconButton(
  icon: Icon(
    _showPassword 
      ? Icons.visibility_off_outlined 
      : Icons.visibility_outlined
  ),
  onPressed: () {
    setState(() {
      _showPassword = !_showPassword;
    });
  }
)

// TextField obscureText
TextField(
  obscureText: !_showPassword,
  ...
)
```

---

### **4.4 رابط "نسيت كلمة المرور":**

```yaml
Widget: Align
alignment: Alignment.centerRight
child: TextButton(
  onPressed: () {
    // Navigate to forgot password page
    print('نسيت كلمة المرور');
  },
  
  style: TextButton.styleFrom(
    padding: EdgeInsets.symmetric(
      horizontal: 0,
      vertical: 4
    ),
    minimumSize: Size.zero,
    tapTargetSize: MaterialTapTargetSize.shrinkWrap
  ),
  
  child: Text(
    "نسيت كلمة المرور؟",
    style: TextStyle(
      fontSize: 14,   # Desktop
      fontSize: 12,   # Mobile
      fontWeight: FontWeight.w500,
      color: Color(0xFF01411C),  # green
      decoration: TextDecoration.none
    )
  )
)

Margin:
  - EdgeInsets.only(bottom: 24)

Hover/Press Effect:
  - Hover: 
    - color: Color(0xFFD4AF37)  # gold
    - decoration: TextDecoration.underline
  - Active:
    - Transform.scale(0.95)
```

---

### **4.5 زر تسجيل الدخول:**

```yaml
Widget: ElevatedButton
Properties:
  - width: double.infinity  # full width
  - height: 56  # Desktop
  - height: 48  # Mobile
  
  onPressed: _isLoading ? null : _handleLogin,
  
  style: ElevatedButton.styleFrom(
    # الخلفية - تدرج
    backgroundColor: Colors.transparent,
    shadowColor: Colors.transparent,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12)
    ),
    padding: EdgeInsets.zero
  ),
  
  child: Ink(
    decoration: BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.centerRight,
        end: Alignment.centerLeft,
        colors: [
          Color(0xFF01411C),      # green
          Color(0xE601411C)       # green 90%
        ]
      ),
      borderRadius: BorderRadius.circular(12),
      boxShadow: [
        BoxShadow(
          color: Color(0x3301411C),  # rgba(1, 65, 28, 0.2)
          offset: Offset(0, 10),
          blurRadius: 15,
          spreadRadius: -3
        )
      ]
    ),
    
    child: Container(
      alignment: Alignment.center,
      child: _isLoading
        ? Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    Colors.white
                  )
                )
              ),
              SizedBox(width: 8),
              Text(
                "جاري التسجيل...",
                style: TextStyle(
                  fontSize: 18,   # Desktop
                  fontSize: 16,   # Mobile
                  fontWeight: FontWeight.w700,
                  color: Colors.white
                )
              )
            ]
          )
        : Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.arrow_back,
                size: 20,
                color: Colors.white
              ),
              SizedBox(width: 8),
              Text(
                "تسجيل الدخول",
                style: TextStyle(
                  fontSize: 18,   # Desktop
                  fontSize: 16,   # Mobile
                  fontWeight: FontWeight.w700,
                  color: Colors.white
                )
              )
            ]
          )
    )
  )

Margin:
  - EdgeInsets.only(bottom: 32)  # Desktop
  - EdgeInsets.only(bottom: 24)  # Mobile

Hover Effect:
  - Shadow increase:
    - offset: Offset(0, 20)
    - blurRadius: 25
    - spreadRadius: -5
    - color: rgba(1, 65, 28, 0.3)
  - Transform: translateY(-2px)
  - Duration: 300ms

Active Effect:
  - Transform.scale(0.98)
  - Duration: 100ms

Disabled State (_isLoading = true):
  - opacity: 0.7
  - cursor: not-allowed
```

---

### **منطق تسجيل الدخول:**

```dart
// State variable
bool _isLoading = false;

// Handle login
Future<void> _handleLogin() async {
  setState(() {
    _isLoading = true;
  });
  
  try {
    // محاكاة API call
    await Future.delayed(Duration(seconds: 2));
    
    print('Login with: ${_emailController.text}');
    
    // Navigate to dashboard
    Navigator.pushReplacementNamed(context, '/dashboard');
    
  } catch (e) {
    // Show error
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('حدث خطأ في تسجيل الدخول'),
        backgroundColor: Colors.red
      )
    );
  } finally {
    setState(() {
      _isLoading = false;
    });
  }
}
```

---

### **4.6 فاصل "أو":**

```yaml
Widget: Container
margin: EdgeInsets.symmetric(vertical: 32)  # Desktop
margin: EdgeInsets.symmetric(vertical: 24)  # Mobile

child: Stack(
  alignment: Alignment.center,
  children: [
    # الخط الأفقي
    Container(
      height: 2,
      width: double.infinity,
      color: Color(0xFFE5E7EB)  # gray-200
    ),
    
    # النص
    Container(
      padding: EdgeInsets.symmetric(horizontal: 16),
      color: Colors.white,
      child: Text(
        "أو",
        style: TextStyle(
          fontSize: 14,   # Desktop
          fontSize: 12,   # Mobile
          fontWeight: FontWeight.w500,
          color: Color(0xFF6B7280)  # gray-500
        )
      )
    )
  ]
)
```

---

### **4.7 زر نفاذ:**

```yaml
Widget: ElevatedButton
Properties:
  - width: double.infinity
  - height: 56  # Desktop
  - height: 48  # Mobile
  
  onPressed: _handleNafathLogin,
  
  style: ElevatedButton.styleFrom(
    backgroundColor: Colors.white,
    foregroundColor: Color(0xFF01411C),  # green
    side: BorderSide(
      color: Color(0xFF01411C),
      width: 2
    ),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12)
    ),
    elevation: 2,
    shadowColor: Color(0x1A01411C)  # rgba(1, 65, 28, 0.1)
  ),
  
  child: Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      # أيقونة نفاذ
      Container(
        width: 32,   # Desktop
        height: 32,  # Desktop
        width: 28,   # Mobile
        height: 28,  # Mobile
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Color(0xFF01411C)  # green
        ),
        child: Icon(
          Icons.shield_outlined,
          size: 20,   # Desktop
          size: 16,   # Mobile
          color: Colors.white
        )
      ),
      
      SizedBox(width: 12),
      
      # النص
      Text(
        "الدخول عبر نفاذ",
        style: TextStyle(
          fontSize: 18,   # Desktop
          fontSize: 16,   # Mobile
          fontWeight: FontWeight.w700,
          color: Color(0xFF01411C)
        )
      )
    ]
  )

Margin:
  - EdgeInsets.only(bottom: 32)  # Desktop
  - EdgeInsets.only(bottom: 24)  # Mobile

Hover Effect:
  - backgroundColor: Color(0xFF01411C)  # green
  - foregroundColor: Colors.white
  - Icon container background: Colors.white
  - Icon color: Color(0xFF01411C)
  - Shadow increase
  - Duration: 300ms

Active Effect:
  - Transform.scale(0.98)
  - Duration: 100ms
```

---

### **منطق نفاذ:**

```dart
void _handleNafathLogin() {
  print('Nafath login clicked - سيتم الربط لاحقاً');
  
  // هنا سيتم فتح نافذة نفاذ
  // أو التوجيه لصفحة نفاذ
}
```

---

### **4.8 صندوق الاشتراك:**

```yaml
Widget: Container
Properties:
  - width: double.infinity
  - padding: EdgeInsets.all(16)  # Desktop
  - padding: EdgeInsets.all(12)  # Mobile
  
Decoration:
  - type: BoxDecoration
  - gradient: LinearGradient(
      begin: Alignment.centerRight,
      end: Alignment.centerLeft,
      colors: [
        Color(0x1AD4AF37),  # rgba(212, 175, 55, 0.1)
        Color(0x0DD4AF37)   # rgba(212, 175, 55, 0.05)
      ]
    )
  - border: Border.all(
      color: Color(0x33D4AF37),  # rgba(212, 175, 55, 0.2)
      width: 1
    )
  - borderRadius: BorderRadius.circular(12)

Child: Row(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    # أيقونة الساعة
    Container(
      width: 32,   # Desktop
      height: 32,  # Desktop
      width: 28,   # Mobile
      height: 28,  # Mobile
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Color(0xFFD4AF37)  # gold
      ),
      child: Icon(
        Icons.schedule,
        size: 16,   # Desktop
        size: 14,   # Mobile
        color: Colors.white
      )
    ),
    
    SizedBox(width: 12),
    
    # النص
    Expanded(
      child: RichText(
        textDirection: TextDirection.rtl,
        text: TextSpan(
          style: TextStyle(
            fontSize: 14,   # Desktop
            fontSize: 12,   # Mobile
            color: Color(0xFF374151),  # gray-700
            height: 1.5
          ),
          children: [
            TextSpan(
              text: "أول شهر مجاني",
              style: TextStyle(
                fontWeight: FontWeight.w700,
                color: Color(0xFF01411C)  # green
              )
            ),
            TextSpan(text: "، بعدها الاشتراك "),
            TextSpan(
              text: "59 ريال/شهري",
              style: TextStyle(
                fontWeight: FontWeight.w700,
                color: Color(0xFFD4AF37)  # gold
              )
            )
          ]
        )
      )
    )
  ]
)

Margin:
  - EdgeInsets.only(bottom: 24)  # Desktop
  - EdgeInsets.only(bottom: 20)  # Mobile

Hover Effect (optional):
  - border color: rgba(212, 175, 55, 0.4)
  - Duration: 200ms
```

---

### **4.9 رابط التسجيل:**

```yaml
Widget: Container
alignment: Alignment.center
child: Row(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    Text(
      "ليس لديك حساب؟ ",
      style: TextStyle(
        fontSize: 16,   # Desktop
        fontSize: 14,   # Mobile
        color: Color(0xFF6B7280)  # gray-600
      )
    ),
    
    TextButton(
      onPressed: () {
        // Navigate to sign up
        print('التوجيه لصفحة التسجيل');
      },
      
      style: TextButton.styleFrom(
        padding: EdgeInsets.zero,
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap
      ),
      
      child: Text(
        "سجل الآن",
        style: TextStyle(
          fontSize: 16,   # Desktop
          fontSize: 14,   # Mobile
          fontWeight: FontWeight.w700,
          color: Color(0xFF01411C),  # green
          decoration: TextDecoration.none
        )
      )
    )
  ]
)

Margin:
  - EdgeInsets.only(top: 24)

Hover Effect (for button):
  - color: Color(0xFFD4AF37)  # gold
  - decoration: TextDecoration.underline
```

---

## 📄 **5. Footer (الروابط السفلية)**

### **Footer Container:**

```yaml
Widget: Container
margin: EdgeInsets.only(top: 32)  # Desktop
margin: EdgeInsets.only(top: 24)  # Mobile
alignment: Alignment.center

child: Column(
  children: [...]
)
```

---

### **5.1 الروابط:**

```yaml
Widget: Wrap
alignment: WrapAlignment.center
crossAxisAlignment: WrapCrossAlignment.center
spacing: 8   # Mobile
spacing: 16  # Desktop
runSpacing: 8
children: [
  
  # الشروط والأحكام
  TextButton(
    onPressed: () => print('الشروط والأحكام'),
    child: Text(
      "الشروط والأحكام",
      style: TextStyle(
        fontSize: 14,   # Desktop
        fontSize: 12,   # Mobile
        color: Color(0xFF6B7280)  # gray-600
      )
    )
  ),
  
  # Dot separator
  Text(
    "•",
    style: TextStyle(
      fontSize: 14,
      color: Color(0xFFD1D5DB)  # gray-300
    )
  ),
  
  # سياسة الخصوصية
  TextButton(
    onPressed: () => print('سياسة الخصوصية'),
    child: Text(
      "سياسة الخصوصية",
      style: TextStyle(
        fontSize: 14,
        color: Color(0xFF6B7280)
      )
    )
  ),
  
  # Dot separator
  Text("•", ...),
  
  # الدعم
  TextButton(
    onPressed: () => print('الدعم'),
    child: Text(
      "الدعم",
      style: TextStyle(
        fontSize: 14,
        color: Color(0xFF6B7280)
      )
    )
  )
]

Hover Effect (for buttons):
  - color: Color(0xFF01411C)  # green
```

---

### **5.2 Copyright:**

```yaml
Widget: Container
margin: EdgeInsets.only(top: 16)  # Desktop
margin: EdgeInsets.only(top: 12)  # Mobile

child: Text(
  "© 2024 Wasata AI. جميع الحقوق محفوظة",
  textAlign: TextAlign.center,
  style: TextStyle(
    fontSize: 12,   # Desktop
    fontSize: 10,   # Mobile
    color: Color(0xFF6B7280)  # gray-500
  )
)
```

---

## 🌟 **6. عناصر الديكور الخلفية**

### **دائرة علوية يسار:**

```yaml
Widget: Positioned
position:
  - top: 0
  - left: 0

child: Container(
  width: 256,   # Desktop (64 * 4)
  height: 256,  # Desktop
  width: 192,   # Mobile (48 * 4)
  height: 192,  # Mobile
  
  decoration: BoxDecoration(
    shape: BoxShape.circle,
    color: Color(0x0D01411C),  # rgba(1, 65, 28, 0.05)
    blur: 48
  ),
  
  transform: Matrix4.translationValues(-128, -128, 0)  # -50% offset
)

Animation:
  - Type: pulse (scale + opacity)
  - Duration: 2s
  - Delay: 0s
  - Repeat: infinite
```

---

### **دائرة سفلية يمين:**

```yaml
Widget: Positioned
position:
  - bottom: 0
  - right: 0

child: Container(
  width: 256,   # Desktop
  height: 256,  # Desktop
  width: 192,   # Mobile
  height: 192,  # Mobile
  
  decoration: BoxDecoration(
    shape: BoxShape.circle,
    color: Color(0x0DD4AF37),  # rgba(212, 175, 55, 0.05)
    blur: 48
  ),
  
  transform: Matrix4.translationValues(128, 128, 0)  # +50% offset
)

Animation:
  - Type: pulse
  - Duration: 2s
  - Delay: 1s
  - Repeat: infinite
```

---

## 🎨 **7. نظام الألوان الكامل**

```yaml
Primary Colors:
  - primary_green: 0xFF01411C      # #01411C - أخضر ملكي
  - secondary_gold: 0xFFD4AF37     # #D4AF37 - ذهبي

Gray Scale:
  - white: 0xFFFFFFFF              # #FFFFFF
  - gray_50: 0xFFF9FAFB           # #F9FAFB
  - gray_100: 0xFFF3F4F6          # #F3F4F6
  - gray_200: 0xFFE5E7EB          # #E5E7EB
  - gray_300: 0xFFD1D5DB          # #D1D5DB
  - gray_400: 0xFF9CA3AF          # #9CA3AF
  - gray_500: 0xFF6B7280          # #6B7280
  - gray_600: 0xFF4B5563          # #4B5563
  - gray_700: 0xFF374151          # #374151
  - gray_900: 0xFF111827          # #111827

Transparency (Alpha Channel):
  - 0x0D = 5%   (0.05)
  - 0x1A = 10%  (0.1)
  - 0x33 = 20%  (0.2)
  - 0x40 = 25%  (0.25)
  - 0x80 = 50%  (0.5)
  - 0xE6 = 90%  (0.9)

Usage Examples:
  - Background gradient start: Color(0x0D01411C)  # 5% green
  - Border gold: Color(0x33D4AF37)                # 20% gold
  - Shadow: Color(0x40000000)                     # 25% black
```

---

## 📏 **8. Responsive Breakpoints**

```yaml
Screen Sizes:
  
  # Small Mobile
  - < 640px:
      containerPadding: 12
      cardPadding: 20
      cardBorderRadius: 16
      headerPadding: 24
      logoSize: 64
      iconSize: 40
      headingSize: 24
      bodySize: 14
      buttonHeight: 48
      inputHeight: 48
  
  # Mobile
  - 640px - 768px:
      containerPadding: 16
      cardPadding: 24
      cardBorderRadius: 20
      headerPadding: 32
      logoSize: 72
      iconSize: 44
      headingSize: 28
      bodySize: 15
      buttonHeight: 52
      inputHeight: 52
  
  # Tablet
  - 768px - 1024px:
      containerPadding: 24
      cardPadding: 28
      cardBorderRadius: 22
      headerPadding: 36
      logoSize: 76
      iconSize: 46
      headingSize: 32
      bodySize: 16
      buttonHeight: 54
      inputHeight: 54
  
  # Desktop
  - > 1024px:
      containerPadding: 32
      cardPadding: 32
      cardBorderRadius: 24
      headerPadding: 40
      logoSize: 80
      iconSize: 48
      headingSize: 36
      bodySize: 16
      buttonHeight: 56
      inputHeight: 56

Card Max Width:
  - Mobile: 100% - padding
  - Desktop: 400px
```

---

## 🎬 **9. Animations (الحركات)**

### **Page Load Animation:**

```dart
// في initState
@override
void initState() {
  super.initState();
  
  _fadeController = AnimationController(
    duration: Duration(milliseconds: 500),
    vsync: this
  );
  
  _scaleController = AnimationController(
    duration: Duration(milliseconds: 500),
    vsync: this
  );
  
  _fadeAnimation = Tween<double>(
    begin: 0.0,
    end: 1.0
  ).animate(CurvedAnimation(
    parent: _fadeController,
    curve: Curves.easeOut
  ));
  
  _scaleAnimation = Tween<double>(
    begin: 0.95,
    end: 1.0
  ).animate(CurvedAnimation(
    parent: _scaleController,
    curve: Curves.easeOut
  ));
  
  // Start animations
  _fadeController.forward();
  _scaleController.forward();
}

// Wrap البطاقة الرئيسية
FadeTransition(
  opacity: _fadeAnimation,
  child: ScaleTransition(
    scale: _scaleAnimation,
    child: Container(/* البطاقة */)
  )
)
```

---

### **Logo Hover Animation:**

```dart
MouseRegion(
  onEnter: (_) {
    setState(() => _isLogoHovered = true);
  },
  onExit: (_) {
    setState(() => _isLogoHovered = false);
  },
  child: AnimatedContainer(
    duration: Duration(milliseconds: 300),
    curve: Curves.easeOut,
    transform: _isLogoHovered 
      ? Matrix4.identity()..scale(1.05)
      : Matrix4.identity(),
    child: Container(/* الشعار */)
  )
)
```

---

### **Pulse Animation (للدوائر):**

```dart
class PulsingCircle extends StatefulWidget {
  final double size;
  final Color color;
  final int delay;  // in milliseconds
  
  @override
  _PulsingCircleState createState() => _PulsingCircleState();
}

class _PulsingCircleState extends State<PulsingCircle> 
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;
  
  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this
    );
    
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.1
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut
    ));
    
    _opacityAnimation = Tween<double>(
      begin: 1.0,
      end: 0.8
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut
    ));
    
    // Start with delay
    Future.delayed(Duration(milliseconds: widget.delay), () {
      _controller.repeat(reverse: true);
    });
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Opacity(
            opacity: _opacityAnimation.value,
            child: Container(
              width: widget.size,
              height: widget.size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: widget.color
              )
            )
          )
        );
      }
    );
  }
}
```

---

### **Star Ping Animation:**

```dart
class PingingIcon extends StatefulWidget {
  @override
  _PingingIconState createState() => _PingingIconState();
}

class _PingingIconState extends State<PingingIcon> 
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;
  
  @override
  void initState() {
    super.initState();
    
    _controller = AnimationController(
      duration: Duration(seconds: 1),
      vsync: this
    )..repeat();
    
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 2.0
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut
    ));
    
    _opacityAnimation = Tween<double>(
      begin: 1.0,
      end: 0.0
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut
    ));
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // Ping effect
        AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Transform.scale(
              scale: _scaleAnimation.value,
              child: Opacity(
                opacity: _opacityAnimation.value,
                child: Container(
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFFD4AF37)
                  )
                )
              )
            );
          }
        ),
        
        // Static circle
        Container(
          width: 6,
          height: 6,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Color(0xFFD4AF37)
          )
        )
      ]
    );
  }
}
```

---

## 📱 **10. ملخص FlutterFlow Widgets**

```yaml
Hierarchy Tree:

Scaffold(
  body: Container(  # Background with gradient
    child: SingleChildScrollView(
      child: Center(
        child: Container(  # Max width 400px
          child: FadeTransition(  # Page load animation
            child: ScaleTransition(
              child: Container(  # Main Card
                child: Column(
                  children: [
                    
                    # Header Section
                    Container(  # Gradient header
                      child: Stack(
                        children: [
                          # Background decorations
                          # Logo column
                          # App name
                          # Tagline row
                        ]
                      )
                    ),
                    
                    # Form Section
                    Container(
                      child: Column(
                        children: [
                          # Welcome text
                          # Email/Phone field
                          # Password field
                          # Forgot password link
                          # Login button
                          # Divider
                          # Nafath button
                          # Subscription box
                          # Sign up link
                        ]
                      )
                    )
                  ]
                )
              )
            )
          )
        )
      )
    )
  )
)

# Footer (outside card)
Container(
  child: Column(
    children: [
      # Links row
      # Copyright
    ]
  )
)

# Background decorations (Positioned)
Stack(
  children: [
    # Top left circle
    # Bottom right circle
  ]
)
```

---

## ✅ **11. Checklist النهائي للتنفيذ**

```yaml
Layout:
  ✅ Main container مع gradient background
  ✅ ScrollView للتجاوب
  ✅ Card بـ max-width 400px
  ✅ RTL direction على كل العناصر

Header:
  ✅ Container مع gradient أخضر
  ✅ Logo 80×80 (Desktop) | 64×64 (Mobile)
  ✅ أيقونة SVG مخصصة (البيت + النجمة)
  ✅ اسم التطبيق "Wasata AI"
  ✅ Tagline مع sparkles icons
  ✅ Background decorations (دوائر ذهبية)

Form Fields:
  ✅ Email/Phone field مع كشف تلقائي
  ✅ أيقونة ديناميكية (Mail/Phone)
  ✅ Password field مع show/hide
  ✅ Focus states (#01411C border + ring)
  ✅ Placeholder نصوص
  ✅ Labels فوق الحقول

Actions:
  ✅ رابط "نسيت كلمة المرور"
  ✅ زر تسجيل دخول مع تدرج
  ✅ Loading state مع spinner
  ✅ Divider "أو"
  ✅ زر نفاذ مع أيقونة Shield

Info:
  ✅ صندوق الاشتراك مع تدرج ذهبي
  ✅ رابط التسجيل
  ✅ Footer روابط
  ✅ Copyright

Responsive:
  ✅ Breakpoints: < 640, 640-768, 768-1024, > 1024
  ✅ Adaptive sizes للحقول والأزرار
  ✅ Adaptive fonts
  ✅ Adaptive spacing

Animations:
  ✅ Page load (fade + scale)
  ✅ Logo hover (scale)
  ✅ Decorations pulse
  ✅ Star ping
  ✅ Button hover effects
  ✅ Focus animations

Colors:
  ✅ #01411C (primary green)
  ✅ #D4AF37 (secondary gold)
  ✅ Gray scale كامل
  ✅ Transparency values

States:
  ✅ _isEmail (للكشف التلقائي)
  ✅ _showPassword (إظهار/إخفاء)
  ✅ _isLoading (حالة التحميل)
  ✅ _isFocused (للحقول)

Functions:
  ✅ handleLogin()
  ✅ handleNafathLogin()
  ✅ handleForgotPassword()
  ✅ handleSignUp()
```

---

## 🎯 **12. ملخص سريع للتنفيذ**

```
1. إنشاء صفحة جديدة في FlutterFlow
2. تعيين direction = RTL
3. إضافة Background Container مع gradient
4. إضافة ScrollView
5. إضافة Card الرئيسية (400px max)
6. بناء Header مع:
   - Gradient background
   - Logo container (SVG custom)
   - App name text
   - Tagline row
7. بناء Form مع:
   - 2 TextFields (Email/Phone, Password)
   - 2 Buttons (Login, Nafath)
   - Links (Forgot password, Sign up)
   - Subscription box
8. إضافة Footer
9. إضافة Decorations (circles)
10. تطبيق Animations
11. تطبيق Responsive logic
12. ربط Backend APIs
```

---

**✅ الحالة:** جاهز للتنفيذ في FlutterFlow 100%

**📄 المرجع:** هذا الملف يحتوي على كل التفاصيل الدقيقة

**🎨 التصميم:** نسخة طبق الأصل من Wasata AI

**📱 التجاوب:** Fully Responsive لجميع الأجهزة

**⏱️ وقت التنفيذ المتوقع:** 2-3 ساعات في FlutterFlow
