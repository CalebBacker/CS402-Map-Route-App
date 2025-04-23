// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

//  ← import these:
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFrameworkReady } from '../hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      {/* SafeAreaView will pad the top on iOS (and Android if needed) */}
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

