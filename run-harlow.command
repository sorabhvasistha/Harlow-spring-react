#!/bin/bash
set -u

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_ESCAPED="${ROOT_DIR//\\/\\\\}"
ROOT_ESCAPED="${ROOT_ESCAPED//\"/\\\"}"

osascript <<EOF
 tell application "Terminal"
   activate
   do script "cd \"$ROOT_ESCAPED/backend\" && ./mvnw spring-boot:run"
   do script "cd \"$ROOT_ESCAPED/frontend\" && npm run dev"
 end tell
EOF
