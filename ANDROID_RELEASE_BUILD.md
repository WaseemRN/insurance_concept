# Android Release Build Guide

This guide will help you build a signed release APK for your React Native app that works on all Android devices.

## Prerequisites

- Android Studio installed
- Java Development Kit (JDK) installed
- React Native development environment set up
- Android SDK configured

## Step 1: Generate a Release Keystore

First, you need to generate a keystore file for signing your release APK. **This keystore is critical - keep it safe and never lose it!**

### Generate Keystore

Run the following command in your terminal (replace the values with your own):

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted to enter:
- **Keystore password**: Choose a strong password (remember this!)
- **Key password**: Use the same password or a different one
- **Your name, organization, city, state, country**: Enter your details

**Important**: 
- Store the keystore file in a safe location (e.g., `android/app/my-release-key.keystore`)
- **NEVER commit the keystore file to version control**
- Keep a backup of the keystore file in a secure location
- If you lose the keystore, you won't be able to update your app on Google Play Store

## Step 2: Configure Keystore Properties

1. Copy the example keystore properties file:
   ```bash
   cp android/keystore.properties.example android/keystore.properties
   ```

2. Edit `android/keystore.properties` and fill in your keystore details:
   ```properties
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=your-store-password
   MYAPP_RELEASE_KEY_PASSWORD=your-key-password
   ```

3. **Important**: The `keystore.properties` file is already in `.gitignore` - do NOT commit it to version control!

## Step 3: Update Version Information

Before building, update your app version in `android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.insurance_concept"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 2  // Increment this for each release
    versionName "1.0.1"  // Update this with your version
}
```

## Step 4: Build the Release APK

### Option 1: Using NPM Scripts (Recommended)

```bash
# Clean and build release APK
npm run android:apk
```

### Option 2: Using Gradle Directly

```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### Option 3: Build Universal APK (Works on all devices)

The build configuration is set to generate both architecture-specific APKs and a universal APK. The universal APK will be located at:
```
android/app/build/outputs/apk/release/app-release-universal.apk
```

## Step 5: Locate Your APK

After the build completes, you'll find your APK files in:

- **Universal APK** (recommended for distribution):
  ```
  android/app/build/outputs/apk/release/app-release-universal.apk
  ```

- **Architecture-specific APKs**:
  ```
  android/app/build/outputs/apk/release/app-armeabi-v7a-release.apk
  android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
  android/app/build/outputs/apk/release/app-x86-release.apk
  android/app/build/outputs/apk/release/app-x86_64-release.apk
  ```

## Step 6: Test Your APK

Before distributing, test the APK on a real device:

```bash
# Install on connected device
adb install android/app/build/outputs/apk/release/app-release-universal.apk
```

Or manually install by:
1. Transfer the APK to your Android device
2. Enable "Install from Unknown Sources" in device settings
3. Open the APK file and install

## Building an Android App Bundle (AAB) for Google Play

If you're publishing to Google Play Store, you should build an Android App Bundle instead:

```bash
npm run android:build:bundle
```

The AAB file will be located at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Troubleshooting

### Build Fails with "Keystore file not found"

- Ensure `keystore.properties` exists in the `android/` directory
- Verify the `MYAPP_RELEASE_STORE_FILE` path is correct
- Make sure the keystore file exists at the specified location

### Build Fails with "Signing config not found"

- Check that `keystore.properties` is properly configured
- Verify all required properties are set (STORE_FILE, STORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD)

### APK is too large

- The universal APK includes all architectures, making it larger
- Consider using architecture-specific APKs or Android App Bundle (AAB)
- Enable ProGuard (already enabled) to reduce size

### App crashes on certain devices

- Ensure you're using the universal APK or the correct architecture-specific APK
- Check that `minSdkVersion` is compatible with the device
- Review ProGuard rules if certain features don't work

## Configuration Details

### ProGuard

ProGuard is enabled for release builds to:
- Reduce APK size
- Obfuscate code
- Optimize performance

ProGuard rules are configured in `android/app/proguard-rules.pro` to keep necessary React Native classes.

### APK Splits

The build is configured to generate:
- Architecture-specific APKs (smaller size per device)
- Universal APK (works on all devices, larger size)

### Supported Architectures

- `armeabi-v7a` - 32-bit ARM devices
- `arm64-v8a` - 64-bit ARM devices (most modern devices)
- `x86` - 32-bit x86 devices (emulators, some tablets)
- `x86_64` - 64-bit x86 devices (emulators, some tablets)

## Security Best Practices

1. **Never commit keystore files** - They're already in `.gitignore`
2. **Never commit keystore.properties** - Contains sensitive passwords
3. **Backup your keystore** - Store it in a secure location (password manager, encrypted storage)
4. **Use strong passwords** - For both keystore and key passwords
5. **Limit access** - Only share keystore with trusted team members

## Additional Resources

- [React Native Android Release Build Documentation](https://reactnative.dev/docs/signed-apk-android)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [ProGuard Documentation](https://www.guardsquare.com/manual/configuration/usage)
