# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
    void set*(***);
    *** get*();
}
-keepclassmembers class * {
    @react.bridge.ReactMethod *;
}
-keepclassmembers class * {
    native <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.UIProp <fields>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native Vision Camera
-keep class com.mrousavy.camera.** { *; }

# React Native Video
-keep class com.brentvatne.react.** { *; }
-keep class com.yqritc.scalablevideoview.** { *; }

# React Native WebView
-keep class com.reactnativecommunity.webview.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Linear Gradient
-keep class com.BV.LinearGradient.** { *; }

# React Native Toast Message
-keep class com.toast.** { *; }

# React Native Snap Carousel
-keep class com.snapcarousel.** { *; }

# React Native Masked View
-keep class org.reactnative.maskedview.** { *; }

# React Native Sound
-keep class com.reactnativesound.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep Parcelables
-keepclassmembers class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator CREATOR;
}

# Keep Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep Kotlin metadata
-keep class kotlin.Metadata { *; }
-keepclassmembers class **$WhenMappings {
    <fields>;
}
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}

# Keep annotations
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Preserve JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Add any project specific keep options here:
