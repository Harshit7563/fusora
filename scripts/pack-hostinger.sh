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

echo "==> Adding Hostinger PHP OTP + seller API + .htaccess…"
cp "$ROOT/hostinger/.htaccess" "$OUT/.htaccess"
mkdir -p "$OUT/api/otp/sessions"
cp "$ROOT/hostinger/api/otp/"*.php "$OUT/api/otp/" 2>/dev/null || true
cp "$ROOT/hostinger/api/otp/.htaccess" "$OUT/api/otp/.htaccess"
cp "$ROOT/hostinger/api/otp/config.example.php" "$OUT/api/otp/config.example.php"

mkdir -p "$OUT/api/seller/data" "$OUT/api/seller/uploads"
cp "$ROOT/hostinger/api/seller/"*.php "$OUT/api/seller/" 2>/dev/null || true
cp "$ROOT/hostinger/api/seller/.htaccess" "$OUT/api/seller/.htaccess"
touch "$OUT/api/seller/data/.gitkeep" "$OUT/api/seller/uploads/.gitkeep"
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

# Razorpay PHP API + generated config.php from local .env
mkdir -p "$OUT/api/razorpay"
cp "$ROOT/hostinger/api/razorpay/"*.php "$OUT/api/razorpay/" 2>/dev/null || true
cp "$ROOT/hostinger/api/razorpay/.htaccess" "$OUT/api/razorpay/.htaccess"
if [[ -f "$ROOT/.env" ]]; then
  RZP_KEY_ID="$(grep -E '^RAZORPAY_KEY_ID=' "$ROOT/.env" | head -1 | cut -d= -f2-)"
  RZP_KEY_SECRET="$(grep -E '^RAZORPAY_KEY_SECRET=' "$ROOT/.env" | head -1 | cut -d= -f2-)"
  cat > "$OUT/api/razorpay/config.php" <<PHP
<?php
// Generated from local .env by pack-hostinger.sh — do not commit
return [
    'RAZORPAY_KEY_ID' => '${RZP_KEY_ID}',
    'RAZORPAY_KEY_SECRET' => '${RZP_KEY_SECRET}',
];
PHP
  echo "==> Wrote api/razorpay/config.php from .env"
else
  cp "$ROOT/hostinger/api/razorpay/config.example.php" "$OUT/api/razorpay/config.php"
  echo "==> WARNING: no .env — placeholder Razorpay keys"
fi

# Admin auth + Orders API (PHP) with generated admin config from local .env
mkdir -p "$OUT/api/admin" "$OUT/api/orders/data"
cp "$ROOT/hostinger/api/admin/"*.php "$OUT/api/admin/" 2>/dev/null || true
cp "$ROOT/hostinger/api/admin/.htaccess" "$OUT/api/admin/.htaccess"
cp "$ROOT/hostinger/api/orders/"*.php "$OUT/api/orders/" 2>/dev/null || true
cp "$ROOT/hostinger/api/orders/.htaccess" "$OUT/api/orders/.htaccess"
touch "$OUT/api/orders/data/.gitkeep"
if [[ -f "$ROOT/.env" ]]; then
  ADMIN_PASSWORD="$(grep -E '^ADMIN_PASSWORD=' "$ROOT/.env" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
  ADMIN_SALT="$(grep -E '^ADMIN_SALT=' "$ROOT/.env" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
  ADMIN_HASH="$(python3 -c "import hashlib,sys; print(hashlib.sha256((sys.argv[1]+sys.argv[2]).encode()).hexdigest())" "$ADMIN_SALT" "$ADMIN_PASSWORD")"
  cat > "$OUT/api/admin/config.php" <<PHP
<?php
// Generated from local .env by pack-hostinger.sh — do not commit
return [
    'ADMIN_SALT' => '${ADMIN_SALT}',
    'ADMIN_PASSWORD_HASH' => '${ADMIN_HASH}',
];
PHP
  echo "==> Wrote api/admin/config.php from .env"
else
  cp "$ROOT/hostinger/api/admin/config.example.php" "$OUT/api/admin/config.php"
  echo "==> WARNING: no .env — placeholder admin config"
fi

# empty sessions keep dir
touch "$OUT/api/otp/sessions/.gitkeep"
chmod 775 "$OUT/api/seller/data" "$OUT/api/seller/uploads" 2>/dev/null || true

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
