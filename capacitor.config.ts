import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.mrsandwich',
  appName: 'Mr Sandwich',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      compileSdkVersion: 35,
      targetSdkVersion: 34,
      minSdkVersion: 24
    }
  }
};

export default config;