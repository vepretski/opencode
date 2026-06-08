@ECHO off
SETLOCAL
SET SCRIPT_DIR=%~dp0
"%USERPROFILE%\.bun\bin\bun.exe" run --preload "%SCRIPT_DIR%packages\opencode\node_modules\@opentui\solid\scripts\preload.ts" --conditions=browser "%SCRIPT_DIR%packages\opencode\src\index.ts" %*
