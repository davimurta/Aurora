import React from "react"
import { Stack } from "expo-router"
import { ThemeProvider } from "@shopify/restyle"
import { theme } from "@theme"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  return (
    <ThemeProvider theme={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </ThemeProvider>
  )
}
