/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#f59e0b';
const tintColorDark = '#fbbf24';

export const Colors = {
  light: {
    text: '#1A1A12',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#f59e0b',
    tabIconDefault: '#d1d5db',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F9FAF2',
    background: '#1B1B12',
    tint: tintColorDark,
    icon: '#fbbf24',
    tabIconDefault: '#4b5563',
    tabIconSelected: tintColorDark,
  },
};

export const Accent = {
  base: '#f59e0b',
  dark: '#d97706',
  light: '#fbbf24',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
