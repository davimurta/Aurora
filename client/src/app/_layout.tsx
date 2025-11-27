import React, { useEffect } from "react"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    // Esconde a splash screen do Expo após o layout estar pronto
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync()
      } catch (error) {
        console.warn('Erro ao esconder splash screen:', error)
      }
    }

    // Pequeno delay para garantir que o layout foi montado
    setTimeout(hideSplash, 100)
  }, [])

  return (
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
  )
}
