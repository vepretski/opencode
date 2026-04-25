#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Error: required command '$1' is not installed." >&2
    exit 1
  }
}

require_cmd curl
require_cmd unzip
require_cmd awk
require_cmd sed
require_cmd find

readonly INSTALL_DIR="${HOME}/public_html/museum"
readonly TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

log "Fetching latest Omeka Classic release metadata"
release_api='https://api.github.com/repos/omeka/Omeka/releases/latest'
zip_url="$(curl -fsSL "$release_api" | sed -n 's/.*"browser_download_url": "\([^"]*\\.zip\)".*/\1/p' | head -n 1)"

if [[ -z "$zip_url" ]]; then
  echo "Error: could not determine latest Omeka Classic zip URL from GitHub API." >&2
  exit 1
fi

log "Latest release ZIP: $zip_url"
zip_path="$TMP_DIR/omeka-latest.zip"
curl -fL "$zip_url" -o "$zip_path"

log "Preparing install directory: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
extract_dir="$TMP_DIR/extract"
mkdir -p "$extract_dir"
unzip -q "$zip_path" -d "$extract_dir"

source_root="$(find "$extract_dir" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
if [[ -z "$source_root" ]]; then
  echo "Error: extracted archive structure is unexpected." >&2
  exit 1
fi

log "Deploying Omeka files into $INSTALL_DIR"
find "$INSTALL_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -a "$source_root"/. "$INSTALL_DIR"/

printf '\nEnter MySQL credentials for Omeka (database host will be localhost).\n'
read -r -p 'MySQL Database Name: ' db_name
read -r -p 'MySQL Username: ' db_user
read -r -s -p 'MySQL Password: ' db_pass
printf '\n'

if [[ -z "$db_name" || -z "$db_user" || -z "$db_pass" ]]; then
  echo "Error: database name, user, and password are all required." >&2
  exit 1
fi

config_file="$INSTALL_DIR/db.ini"
if [[ -f "$config_file" ]]; then
  :
elif [[ -f "$INSTALL_DIR/db.ini.changeme" ]]; then
  cp "$INSTALL_DIR/db.ini.changeme" "$config_file"
else
  cat > "$config_file" <<'DBINI'
[database]
host     = "localhost"
username = ""
password = ""
dbname   = ""
prefix   = "omeka_"
charset  = "utf8"
DBINI
fi

escape_ini() {
  printf '%s' "$1" | sed 's/[\\&/]/\\&/g'
}

log "Writing database credentials to $config_file"
sed -i "s/^host\s*=.*/host     = \"localhost\"/" "$config_file"
sed -i "s/^username\s*=.*/username = \"$(escape_ini "$db_user")\"/" "$config_file"
sed -i "s/^password\s*=.*/password = \"$(escape_ini "$db_pass")\"/" "$config_file"
sed -i "s/^dbname\s*=.*/dbname   = \"$(escape_ini "$db_name")\"/" "$config_file"

log "Setting secure permissions"
find "$INSTALL_DIR" -type d -exec chmod 755 {} +
find "$INSTALL_DIR" -type f -exec chmod 644 {} +

for writable in files archive application/logs; do
  if [[ -d "$INSTALL_DIR/$writable" ]]; then
    chmod -R 775 "$INSTALL_DIR/$writable"
  fi
done

log "Installation completed successfully"
printf 'Omeka Classic is installed at: %s\n' "$INSTALL_DIR"
printf 'Next step: open https://starton.org.il/museum in your browser to finish the web installer.\n'
