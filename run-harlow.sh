#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

launch_terminal() {
  local title="$1"
  local working_dir="$2"
  local command="$3"
  local terminal_command="cd \"$ROOT_DIR/$working_dir\" && $command; status=\$?; echo; echo \"Process stopped with exit code \$status. Press Enter to close.\"; read -r"

  if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal --title="$title" -- bash -lc "$terminal_command"
  elif command -v konsole >/dev/null 2>&1; then
    konsole --new-tab -p tabtitle="$title" -e bash -lc "$terminal_command"
  elif command -v xfce4-terminal >/dev/null 2>&1; then
    xfce4-terminal --title="$title" --command="bash -lc '$terminal_command'"
  elif command -v x-terminal-emulator >/dev/null 2>&1; then
    x-terminal-emulator -T "$title" -e bash -lc "$terminal_command"
  else
    echo "No supported terminal emulator found."
    echo "Run these commands manually in separate terminals:"
    echo "  cd \"$ROOT_DIR/backend\" && ./mvnw spring-boot:run"
    echo "  cd \"$ROOT_DIR/frontend\" && npm run dev"
    exit 1
  fi
}

launch_terminal "Harlow Backend" "backend" "./mvnw spring-boot:run"
launch_terminal "Harlow Frontend" "frontend" "npm run dev"

echo "Harlow backend and frontend launchers opened."
