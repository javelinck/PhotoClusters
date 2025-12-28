import { Stack } from "expo-router";
import { ClustersProvider } from '@/src/context/ClustersContext';
import { SettingsProvider } from '@/src/context/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ClustersProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ title: "Clusters", headerShown: false }} />
        </Stack>
      </ClustersProvider>
    </SettingsProvider>
  );
}
