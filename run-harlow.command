#!/bin/bash
set -u

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_ESCAPED="${ROOT_DIR//\\/\\\\}"
ROOT_ESCAPED="${ROOT_ESCAPED//\"/\\\"}"

BACKEND_COMMAND="if [ -r \"\$HOME/.profile\" ]; then source \"\$HOME/.profile\"; fi; if [ -r \"\$HOME/.zprofile\" ]; then source \"\$HOME/.zprofile\"; fi; if [ -r \"\$HOME/.zshrc\" ]; then source \"\$HOME/.zshrc\"; fi; if [ -r \"\$HOME/.sdkman/bin/sdkman-init.sh\" ]; then source \"\$HOME/.sdkman/bin/sdkman-init.sh\"; fi; if [ -r \"\$HOME/.nvm/nvm.sh\" ]; then source \"\$HOME/.nvm/nvm.sh\"; fi; if [ -d \"\$HOME/.sdkman/candidates/java/current\" ]; then export JAVA_HOME=\"\$HOME/.sdkman/candidates/java/current\"; export PATH=\"\$JAVA_HOME/bin:\$PATH\"; fi; if [ -d /opt/homebrew/bin ]; then export PATH=\"/opt/homebrew/bin:\$PATH\"; fi; if [ -d /usr/local/bin ]; then export PATH=\"/usr/local/bin:\$PATH\"; fi; if ! command -v java >/dev/null 2>&1 || ! command -v javac >/dev/null 2>&1; then echo 'Java JDK 17+ was not found. Set JAVA_HOME or install a JDK.'; exit 1; fi; cd \"$ROOT_ESCAPED/backend\" && ./mvnw spring-boot:run"
FRONTEND_COMMAND="if [ -r \"\$HOME/.profile\" ]; then source \"\$HOME/.profile\"; fi; if [ -r \"\$HOME/.zprofile\" ]; then source \"\$HOME/.zprofile\"; fi; if [ -r \"\$HOME/.zshrc\" ]; then source \"\$HOME/.zshrc\"; fi; if [ -r \"\$HOME/.nvm/nvm.sh\" ]; then source \"\$HOME/.nvm/nvm.sh\"; fi; if [ -d /opt/homebrew/bin ]; then export PATH=\"/opt/homebrew/bin:\$PATH\"; fi; if [ -d /usr/local/bin ]; then export PATH=\"/usr/local/bin:\$PATH\"; fi; if ! command -v npm >/dev/null 2>&1; then echo 'npm was not found. Install Node.js or configure NVM.'; exit 1; fi; cd \"$ROOT_ESCAPED/frontend\" && npm run dev"

BACKEND_COMMAND_ESCAPED="${BACKEND_COMMAND//\\\"/\\\\\\\"}"
FRONTEND_COMMAND_ESCAPED="${FRONTEND_COMMAND//\\\"/\\\\\\\"}"

osascript <<EOF
 tell application "Terminal"
   activate
   do script "$BACKEND_COMMAND_ESCAPED"
   do script "$FRONTEND_COMMAND_ESCAPED"
 end tell
EOF
