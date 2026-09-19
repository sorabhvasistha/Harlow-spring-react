#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

launch_terminal() {
  local title="$1"
  local working_dir="$2"
  local command="$3"
  local environment_setup=''
  local requirement_check=''

  environment_setup=''
  [ -r "$HOME/.profile" ] && environment_setup+='source "$HOME/.profile" 2>/dev/null || true; '
  [ -r "$HOME/.bashrc" ] && environment_setup+='source "$HOME/.bashrc" 2>/dev/null || true; '
  environment_setup+='if [ -r "$HOME/.sdkman/bin/sdkman-init.sh" ]; then source "$HOME/.sdkman/bin/sdkman-init.sh"; fi; '
  environment_setup+='if [ -r "$HOME/.nvm/nvm.sh" ]; then source "$HOME/.nvm/nvm.sh"; fi; '
  environment_setup+='if [ -x "$HOME/.sdkman/candidates/java/current/bin/java" ]; then export JAVA_HOME="$HOME/.sdkman/candidates/java/current"; export PATH="$JAVA_HOME/bin:$PATH"; fi; '

  if [ "$working_dir" = "backend" ]; then
    requirement_check='if ! command -v java >/dev/null 2>&1 || ! command -v javac >/dev/null 2>&1; then echo "Java JDK 17+ was not found. Install/select it with SDKMAN or set JAVA_HOME."; exit 1; fi; '
  else
    requirement_check='if ! command -v npm >/dev/null 2>&1; then echo "npm was not found. Install Node.js or configure NVM in ~/.bashrc."; exit 1; fi; '
  fi

  local terminal_command="${environment_setup}${requirement_check}cd \"$ROOT_DIR/$working_dir\" && $command; status=\$?; echo; echo \"Process stopped with exit code \$status. Press Enter to close.\"; read -r"

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
