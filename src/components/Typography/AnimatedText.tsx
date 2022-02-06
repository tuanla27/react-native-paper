import * as React from 'react';
import {
  Animated,
  TextStyle,
  I18nManager,
  StyleProp,
  StyleSheet,
} from 'react-native';
import { withTheme } from '../../core/theming';
import { Font, MD3Token, MD3TypescaleKey, Theme } from '../../types';

type Props = React.ComponentPropsWithRef<typeof Animated.Text> &
  MD3Props & {
    style?: StyleProp<TextStyle>;
    /**
     * @optional
     */
    theme: Theme;
  };

type MD3Props = {
  variant?: keyof typeof MD3TypescaleKey;
};

/**
 * Text component which follows styles from the theme.
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */
function AnimatedText({
  style,
  theme,
  variant = 'label-large',
  ...rest
}: Props) {
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  const { isV3, md } = theme;

  if (isV3) {
    const stylesByVariant = Object.keys(MD3TypescaleKey).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          fontSize: md(`md.sys.typescale.${key}.size` as MD3Token),
          fontWeight: md(`md.sys.typescale.${key}.weight` as MD3Token),
          lineHeight: md(`md.sys.typescale.${key}.line-height` as MD3Token),
          letterSpacing: md(`md.sys.typescale.${key}.tracking` as MD3Token),
          color: md('md.sys.color.on-surface'),
        },
      }),
      {} as {
        [key in MD3TypescaleKey]: {
          fontSize: number;
          fontWeight: Font['fontWeight'];
          lineHeight: number;
          letterSpacing: number;
        };
      }
    );

    const styleForVariant = stylesByVariant[variant];

    return (
      <Animated.Text
        {...rest}
        style={[styleForVariant, styles.text, { writingDirection }, style]}
      />
    );
  } else {
    return (
      <Animated.Text
        {...rest}
        style={[
          styles.text,
          {
            ...theme.fonts.regular,
            color: theme.colors?.text,
            writingDirection,
          },
          style,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default withTheme(AnimatedText);
