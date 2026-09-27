#!/usr/bin/env bash
# Build Fusora for Hostinger and pack a zip ready for public_html upload.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Building…"
npm run build

OUT="$ROOT/deploy/hostinger"
ZIP="$ROOT/deploy/fusora-hostinger.zip"
rm -rf "$OUT"
mkdir -p "$OUT"

echo "==> Copying dist…"
cp -R "$ROOT/dist/." "$OUT/"

echo "==> Adding Hostinger PHP OTP + .htaccess…"
cp "$ROOT/hostinger/.htaccess" "$OUT/.htaccess"
mkdir -p "$OUT/api/otp/sessions"
cp "$ROOT/hostinger/api/otp/"*.php "$OUT/api/otp/" 2>/dev/null || true
cp "$ROOT/hostinger/api/otp/.htaccess" "$OUT/api/otp/.htaccess"
cp "$ROOT/hostinger/api/otp/config.example.php" "$OUT/api/otp/config.example.php"
# Write config.php from local .env (not committed; used only in zip for your upload)
if [[ -f "$ROOT/.env" ]]; then
  # shellcheck disable=SC1091
  set -a
  # parse KEY=VAL lines
  SMS_API_URL="$(grep -E '^SMS_API_URL=' "$ROOT/.env" | head -1 | cut -d= -f2-)"
  SMS_API_KEY="$(grep -E '^SMS_API_KEY=' "$ROOT/.env" | head -1 | cut -d= -f2-)"
  set +a
  SMS_API_URL="${SMS_API_URL:-https://authsecure.anilaxpayments.com/api/Sms_api/send}"
  cat > "$OUT/api/otp/config.php" <<PHP
<?php
return [
    'SMS_API_URL' => '${SMS_API_URL}',
    'SMS_API_KEY' => '${SMS_API_KEY}',
];
PHP
  echo "==> Wrote api/otp/config.php from .env"
else
  cp "$ROOT/hostinger/api/otp/config.example.php" "$OUT/api/otp/config.php"
  echo "==> WARNING: no .env — placeholder SMS key in config.php"
fi

# empty sessions keep dir
touch "$OUT/api/otp/sessions/.gitkeep"

echo "==> Zipping…"
rm -f "$ZIP"
(
  cd "$OUT"
  zip -r "$ZIP" . -x "*.DS_Store"
)

echo ""
echo "Ready: $ZIP"
echo "Upload ALL contents of deploy/hostinger/ into Hostinger public_html/"
echo "Then open https://fusora.shop/"
