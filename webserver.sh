#!/bin/bash
set -euo pipefail

PORT=10000
PM2_NAME="web_server_${PORT}"
TEMP_SCRIPT="/tmp/pm2_web_server_${PORT}.py"

# 1. Определяем доступную команду Python
find_python() {
    if command -v py &> /dev/null && py --version 2>&1 | grep -q "Python 3"; then
        echo "py"
    elif command -v python3 &> /dev/null; then
        echo "python3"
    elif command -v python &> /dev/null; then
        echo "python"
    else
        echo ""
    fi
}

PYTHON_CMD=$(find_python)
if [ -z "$PYTHON_CMD" ]; then
    echo "❌ Python 3 не найден. Установите Python (https://python.org) или проверьте переменную PATH."
    exit 1
fi
echo "✅ Используется Python: $PYTHON_CMD"

# 2. Проверка pm2
if ! command -v pm2 &> /dev/null; then
    echo "❌ pm2 не установлен. Установите глобально: npm install -g pm2"
    echo "   (или: sudo npm install -g pm2 в Linux)"
    exit 1
fi

# 3. Функция проверки занятости порта (через netstat, работает везде)
is_port_in_use() {
    local port=$1
    if netstat -an 2>/dev/null | grep -q ":$port .*LISTEN"; then
        return 0
    else
        return 1
    fi
}

# 4. Проверяем порт
if is_port_in_use $PORT; then
    echo "❌ Порт $PORT уже занят. Освободите его (например, остановите другой сервер) и запустите скрипт заново."
    exit 1
fi

# 5. Останавливаем предыдущий процесс pm2 (если есть)
if pm2 list | grep -q "$PM2_NAME"; then
    echo "🔄 Останавливаем предыдущий процесс $PM2_NAME"
    pm2 delete "$PM2_NAME" -s
fi

# 6. Создаём временный Python-скрипт (с указанием shebang для универсальности)
cat > "$TEMP_SCRIPT" <<EOF
#!/usr/bin/env $PYTHON_CMD
import os
import http.server
import socketserver

PORT = $PORT
DIRECTORY = r"$(pwd)"  # raw-строка для Windows-путей

os.chdir(DIRECTORY)
handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
    print(f"✅ Сервер запущен: http://localhost:{PORT}")
    print(f"📁 Отдаётся директория: {DIRECTORY}")
    httpd.serve_forever()
EOF

# 7. Делаем исполняемым (на Windows это игнорируется, но для Linux)
chmod +x "$TEMP_SCRIPT"

# 8. Запускаем через pm2 (без аргументов)
pm2 start "$TEMP_SCRIPT" --name "$PM2_NAME"

# 9. Ждём и проверяем
sleep 2

if pm2 list | grep -q "$PM2_NAME"; then
    echo "✅ Процесс запущен через pm2 под именем $PM2_NAME"
    echo "🌐 Открыть в браузере: http://localhost:$PORT"
    echo "🛑 Остановить: pm2 stop $PM2_NAME"
    echo "🗑  Удалить: pm2 delete $PM2_NAME"
    echo "📋 Логи: pm2 logs $PM2_NAME"
    echo "📂 Временный скрипт: $TEMP_SCRIPT"
else
    echo "❌ Ошибка запуска сервера"
    exit 1
fi