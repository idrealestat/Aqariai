#!/bin/bash

# =======================================================
# سكريبت تشغيل جميع خدمات وسِيطي
# يشغل API Server + Worker + Realtime Server
# =======================================================

echo "🚀 تشغيل جميع خدمات وسِيطي..."

# تحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت"
    exit 1
fi

# تحقق من وجود المتطلبات
if [ ! -f "package.json" ]; then
    echo "❌ package.json غير موجود"
    exit 1
fi

# تحقق من وجود ملف البيئة
if [ ! -f ".env" ]; then
    echo "⚠️  ملف .env غير موجود، نسخ من .env.example"
    cp .env.example .env
fi

# تثبيت المتطلبات إذا لم تكن موجودة
if [ ! -d "node_modules" ]; then
    echo "📦 تثبيت المتطلبات..."
    npm install
fi

# إنشاء مجلدات الملفات
mkdir -p uploads/properties
mkdir -p logs

echo "✅ جاري تشغيل الخدمات..."

# تشغيل الخدمات في الخلفية
echo "🌐 تشغيل API Server..."
NODE_ENV=development node app.js > logs/api.log 2>&1 &
API_PID=$!

sleep 2

echo "⚙️  تشغيل Background Worker..."
NODE_ENV=development node worker.js > logs/worker.log 2>&1 &
WORKER_PID=$!

sleep 2

echo "📡 تشغيل Realtime Server..."
NODE_ENV=development node realtime-server.js > logs/realtime.log 2>&1 &
REALTIME_PID=$!

sleep 3

# حفظ PIDs للإيقاف اللاحق
echo $API_PID > .api.pid
echo $WORKER_PID > .worker.pid
echo $REALTIME_PID > .realtime.pid

echo ""
echo "🎉 تم تشغيل جميع الخدمات بنجاح!"
echo ""
echo "📊 الخدمات النشطة:"
echo "   🌐 API Server:      http://localhost:3000"
echo "   📡 Realtime Server: http://localhost:4000"
echo "   ⚙️  Background Worker: نشط"
echo ""
echo "📋 الروابط المهمة:"
echo "   🏥 Health Check:    http://localhost:3000/health"
echo "   📖 API Info:        http://localhost:3000/api/v1"
echo "   📚 Documentation:   openapi.yaml"
echo ""
echo "📝 ملفات السجلات:"
echo "   API:      logs/api.log"
echo "   Worker:   logs/worker.log"
echo "   Realtime: logs/realtime.log"
echo ""
echo "⏹️  لإيقاف الخدمات: ./scripts/stop-all.sh"
echo ""

# مراقبة الخدمات
echo "🔍 مراقبة الخدمات (Ctrl+C للخروج)..."
tail -f logs/*.log