
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.profitpilot.app',
  appName: 'ProfitPilot',
  webDir: 'dist',
  server: {
    url: 'https://c701f90c-51b7-46cf-9c18-842f0e855bf9.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
      overlaysWebView: true,
      translucent: true,
    }
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
    handleApplicationNotifications: true,
    limitsNavigationsToAppBoundDomains: true,
    allowsLinkPreview: false,
    useNativeStatusBar: true,
    backgroundColor: "#000000",
    statusBarHeight: 52, // Increased value to account for iPhone with Dynamic Island/notch
  },
  android: {
    backgroundColor: "#000000"
  }
};

export default config;
