@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo =================================================================
echo   Запуск локального портала: Академик Р. Х. Рахимов
echo =================================================================
echo.

if not exist node_modules (
    echo [1/2] Установка зависимостей (npm install)...
    call npm install
    if errorlevel 1 (
        echo Ошибка при установке зависимостей!
        pause
        exit /b 1
    )
)

echo [2/2] Запуск локального сервера Vite и открытие браузера...
echo.
echo Портал будет доступен по адресу: http://localhost:5173
echo Чтобы остановить сервер, нажмите Ctrl + C в этом окне.
echo.

call npm run dev -- --open

pause
