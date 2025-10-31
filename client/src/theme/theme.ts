import { createTheme } from '@shopify/restyle'
import { borderRadii } from './borderRadius'
import { boxShadows } from './boxShadows'
import { colors } from './colors'
import { spacing } from './spacing'

export type Theme = typeof theme
export type ThemeColors = keyof Theme['colors']

export const theme = createTheme({
  colors: colors.lightTheme,
  spacing,
  borderRadii,

  textVariants: {
    default: {
      color: 'textPrimary',
      fontSize: 14,
      lineHeight: 18.9,
    },
    title: {
      fontSize: 30,
      lineHeight: 41,
    },
    subTitle: {
      fontSize: 24,
      lineHeight: 32.4,
    },
    xl: {
      fontSize: 20,
      lineHeight: 27,
    },
    lg: {
      fontSize: 18,
      lineHeight: 24.3,
    },
    largeText: {
      fontSize: 16,
      lineHeight: 21.6,
    },
    baseText: {
      fontSize: 14,
      lineHeight: 18.9,
    },
  },
  boxShadows,
})

export const darkTheme = {
  ...theme,
  colors: colors.darkTheme,
}