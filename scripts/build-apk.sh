#!/bin/bash

# Trap para capturar erro e manter terminal aberto
trap 'echo "Erro na linha $LINENO. Script interrompido."; read -p "Pressione ENTER para sair..."' ERR

### CONFIGURAÇÕES INICIAIS ###
APP_NAME="chrono-sports"
KEYSTORE="my-release-key.jks"
ALIAS="my-key-alias"
KEYSTORE_PASSWORD="example"
SDK_PATH="C:/android-sdk"
BUILD_TOOLS_VERSION="34.0.0"
ZIPALIGN="$SDK_PATH/build-tools/$BUILD_TOOLS_VERSION/zipalign"
APKSIGNER="$SDK_PATH/build-tools/$BUILD_TOOLS_VERSION/apksigner.bat"

# Caminhos
# Apagar arquivos existentes, se houver
UNSIGNED_APK="android/app/build/outputs/apk/release/app-release-unsigned.apk"
ALIGNED_APK="app-release-unsigned-aligned.apk"
SIGNED_APK="app-release-signed.apk"

[ -f "$UNSIGNED_APK" ] && rm "$UNSIGNED_APK"
[ -f "$ALIGNED_APK" ] && rm "$ALIGNED_APK"
[ -f "$SIGNED_APK" ] && rm "$SIGNED_APK"

echo "1. Build do Next.js"
npm run build

echo "2. Preparando pasta public (se necessário)"
mkdir -p public
cp -r .next static public || echo "Ignorando se já estiver exportado"

echo "3. Copiando build para o Android"
npx cap copy android

echo "4. Build do APK de release"
cd android
./gradlew assembleRelease
cd ..

echo "5. Assinando com jarsigner"
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore $KEYSTORE \
  -storepass $KEYSTORE_PASSWORD \
  $UNSIGNED_APK $ALIAS

echo "6. Alinhando APK com zipalign"
"$ZIPALIGN" -v 4 $UNSIGNED_APK $ALIGNED_APK

echo "7. Assinando final com apksigner"
"$APKSIGNER" sign --ks $KEYSTORE \
  --ks-pass pass:$KEYSTORE_PASSWORD \
  --out $SIGNED_APK \
  $ALIGNED_APK

echo "APK gerado com sucesso: $SIGNED_APK"

# Pausa no final
read -p "Pressione ENTER para sair..."
