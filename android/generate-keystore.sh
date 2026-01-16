#!/bin/bash

# Script to generate a release keystore for Android app signing
# This script helps you create a keystore file for signing your release APK

echo "=========================================="
echo "Android Release Keystore Generator"
echo "=========================================="
echo ""
echo "This script will help you generate a keystore file for signing your release APK."
echo "IMPORTANT: Keep this keystore file safe! You'll need it for all future app updates."
echo ""

# Prompt for keystore details
read -p "Enter keystore file name (default: my-release-key.keystore): " KEYSTORE_NAME
KEYSTORE_NAME=${KEYSTORE_NAME:-my-release-key.keystore}

read -p "Enter key alias (default: my-key-alias): " KEY_ALIAS
KEY_ALIAS=${KEY_ALIAS:-my-key-alias}

read -sp "Enter keystore password (min 6 characters): " KEYSTORE_PASSWORD
echo ""

read -sp "Enter key password (press Enter to use same as keystore): " KEY_PASSWORD
echo ""
KEY_PASSWORD=${KEY_PASSWORD:-$KEYSTORE_PASSWORD}

# Generate keystore
echo ""
echo "Generating keystore..."
keytool -genkeypair -v -storetype PKCS12 \
  -keystore "$KEYSTORE_NAME" \
  -alias "$KEY_ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "$KEYSTORE_PASSWORD" \
  -keypass "$KEY_PASSWORD" \
  -dname "CN=Insurance Concept, OU=Mobile, O=Insurance, L=City, ST=State, C=US"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Keystore generated successfully: $KEYSTORE_NAME"
    echo ""
    echo "Next steps:"
    echo "1. Move the keystore file to: android/app/$KEYSTORE_NAME"
    echo "2. Copy android/keystore.properties.example to android/keystore.properties"
    echo "3. Update android/keystore.properties with your keystore details:"
    echo "   MYAPP_RELEASE_STORE_FILE=$KEYSTORE_NAME"
    echo "   MYAPP_RELEASE_KEY_ALIAS=$KEY_ALIAS"
    echo "   MYAPP_RELEASE_STORE_PASSWORD=$KEYSTORE_PASSWORD"
    echo "   MYAPP_RELEASE_KEY_PASSWORD=$KEY_PASSWORD"
    echo ""
    echo "⚠️  IMPORTANT: Keep your keystore file and passwords safe!"
    echo "   If you lose them, you won't be able to update your app on Google Play."
else
    echo ""
    echo "✗ Failed to generate keystore. Please check the error messages above."
    exit 1
fi
