import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sa.com.yorkmobilestore',
  appName: 'YORK Store',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'true',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '0',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '1000',
      FadeSplashScreen: 'false',
      Orientation: 'portrait',
      Fullscreen: 'false',
      DisallowOverscroll: 'true',
      ShowSplashScreenSpinner: 'false',
      InAppBrowserStatusBarStyle: 'lightcontent',
      StatusBarOverlaysWebView: 'false',
      WKWebViewOnly: 'true',
      CordovaWebViewEngine: 'CDVWKWebViewEngine',
      StatusBarStyle: 'lightcontent',
      StatusBarDefaultScrollToTop: 'false',
      WKSuspendInBackground: 'false',
      loadUrlTimeoutValue: '60000',
      AutoHideSplashScreen: 'true',
      StatusBarBackgroundColor: '#04558a',
      AndroidPersistentFileLocation: 'Compatibility'
    }
  }
};

export default config;
