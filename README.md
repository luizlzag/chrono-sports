# Next.js + Capacitor Mobile Build (APK)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), configured for building an Android APK using [Capacitor](https://capacitorjs.com/).

---

## Web Development (Local)

To run the web app in development mode:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Mobile Development (Android APK with Capacitor)

### Prerequisites

Ensure the following tools are installed on your system:

- [Node.js](https://nodejs.org/)
- [Java JDK 11+](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Android SDK](https://developer.android.com/studio) with:
  - `sdkmanager`
  - `zipalign`
  - `apksigner`
  - `keytool` (from JDK)
- [Capacitor CLI](https://capacitorjs.com/docs/getting-started):  
  ```bash
  npm install @capacitor/core @capacitor/cli
  ```

> Tip: Make sure you have the Android Build Tools installed using `sdkmanager`:
> ```bash
> sdkmanager "build-tools;34.0.0"
> ```

---

### Initial Setup (Only once)

1. Initialize Capacitor in your project:
    ```bash
    npx cap init
    ```

2. Add Android platform:
    ```bash
    npx cap add android
    ```

---

### Build & Generate APK (Every time)

1. **Build your Next.js project:**
    ```bash
    npm run build
    ```

2. **Prepare `public/` folder (if necessary):**
    ```bash
    mkdir -p public
    cp -r .next static public
    ```

3. **Copy assets to Android project:**
    ```bash
    npx cap copy
    ```

4. **Build APK:**
    ```bash
    cd android
    ./gradlew assembleRelease
    cd ..
    ```

5. **Locate the APK:**
    ```text
    android/app/build/outputs/apk/release/app-release-unsigned.apk
    ```

---

### Sign the APK

#### Step 1: Generate a Keystore (only once)

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

#### Step 2: Sign with `jarsigner`

```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256   -keystore my-release-key.jks   android/app/build/outputs/apk/release/app-release-unsigned.apk my-key-alias
```

#### Step 3: Align with `zipalign`

```bash
zipalign -v 4   android/app/build/outputs/apk/release/app-release-unsigned.apk   app-release-unsigned-aligned.apk
```

#### Step 4: Final Sign with `apksigner`

```bash
apksigner sign --ks my-release-key.jks   --out app-release-signed.apk   app-release-unsigned-aligned.apk
```

You now have a **release-signed APK** ready to upload to the **Google Play Store**:
```text
app-release-signed.apk
```
