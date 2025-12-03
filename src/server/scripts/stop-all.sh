#!/bin/bash

# =======================================================
# سكريبت إيقاف جميع خدمات وسِيطي
# يوقف API Server + Worker + Realtime Server بأمان
# =======================================================

echo "⏹️  إيقاف جميع خدمات وسِيطي..."

# قراءة PIDs من الملفات
if [ -f ".api.pid" ]; then
    API_PID=$(cat .api.pid)
    if kill -0 $API_PID 2>/dev/null; then
        echo "🌐 إيقاف API Server (PID: $API_PID)..."
        kill -TERM $API_PID
        sleep 2
        if kill -0 $API_PID 2>/dev/null; then
            echo "⚠️  إيقاف قسري للـ API Server..."
            kill -KILL $API_PID
        fi
    fi
    rm -f .api.pid
fi

if [ -f ".worker.pid" ]; then
    WORKER_PID=$(cat .worker.pid)
    if kill -0 $WORKER_PID 2>/dev/null; then
        echo "⚙️  إيقاف Background Worker (PID: $WORKER_PID)..."
        kill -TERM $WORKER_PID
        sleep 2
        if kill -0 $WORKER_PID 2>/dev/null; then
            echo "⚠️  إيقاف قسري للـ Worker..."
            kill -KILL $WORKER_PID
        fi
    fi
    rm -f .worker.pid
fi

if [ -f ".realtime.pid" ]; then
    REALTIME_PID=$(cat .realtime.pid)
    if kill -0 $REALTIME_PID 2>/dev/null; then
        echo "📡 إيقاف Realtime Server (PID: $REALTIME_PID)..."
        kill -TERM $REALTIME_PID
        sleep 2
        if kill -0 $REALTIME_PID 2>/dev/null; then
            echo "⚠️  إيقاف قسري للـ Realtime Server..."
            kill -KILL $REALTIME_PID
        fi
    fi
    rm -f .realtime.pid
fi

# تنظيف العمليات المتبقية
echo "🧹 تنظيف العمليات المتبقية..."
pkill -f "node app.js" 2>/dev/null || true
pkill -f "node worker.js" 2>/dev/null || true
pkill -f "node realtime-server.js" 2>/dev/null || true

echo "✅ تم إيقاف جميع الخدمات بنجاح!"
echo ""
echo "📝 ملفات السجلات محفوظة في مجلد logs/"
echo "🔄 لإعادة التشغيل: ./scripts/start-all.sh"