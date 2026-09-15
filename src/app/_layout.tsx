import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="explore"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="product/[id]"
          options={{ title: 'Product Details' }}
        />
      </Stack>
    </ThemeProvider>
  );
}