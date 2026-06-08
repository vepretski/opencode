@ECHO off
SETLOCAL
SET SCRIPT_DIR=%~dp0
"%SCRIPT_DIR%node_modules\.bin\bun.exe" run --conditions=browser "%SCRIPT_DIR%packages\opencode\src\index.ts" %*
