import * as React from 'react';
import {
  View,
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
  I18nManager,
  Platform,
  TextStyle,
} from 'react-native';
import color from 'color';
import InputLabel from './Label/InputLabel';
import TextInputAdornment, {
  TextInputAdornmentProps,
} from './Adornment/TextInputAdornment';
import type { RenderProps, ChildTextInputProps } from './types';

import {
  MAXIMIZED_LABEL_FONT_SIZE,
  MINIMIZED_LABEL_FONT_SIZE,
  LABEL_WIGGLE_X_OFFSET,
  ADORNMENT_SIZE,
  FLAT_INPUT_OFFSET,
} from './constants';

import {
  calculateLabelTopPosition,
  calculateInputHeight,
  calculatePadding,
  adjustPaddingFlat,
  Padding,
  interpolatePlaceholder,
  calculateFlatAffixTopPosition,
  calculateFlatInputHorizontalPadding,
} from './helpers';
import {
  getAdornmentConfig,
  getAdornmentStyleAdjustmentForNativeInput,
} from './Adornment/TextInputAdornment';
import { AdornmentSide, AdornmentType, InputMode } from './Adornment/enums';

const MINIMIZED_LABEL_Y_OFFSET = -18;

const LABEL_PADDING_TOP = 30;
const LABEL_PADDING_TOP_DENSE = 24;
const MIN_HEIGHT = 64;
const MIN_DENSE_HEIGHT_WL = 52;
const MIN_DENSE_HEIGHT = 40;

const TextInputFlat = ({
  disabled = false,
  editable = true,
  label,
  error = false,
  selectionColor,
  underlineColor,
  activeUnderlineColor,
  isRequired,
  onIconPress,
  accessibilityLabel,
  trailingIcon,
  placeholderActiveColor,
  dense,
  style,
  theme,
  render = (props: RenderProps) => <NativeTextInput {...props} />,
  multiline = false,
  parentState,
  innerRef,
  onFocus,
  forceFocus,
  onBlur,
  onChangeText,
  onLayoutAnimatedText,
  onLeftAffixLayoutChange,
  onRightAffixLayoutChange,
  left,
  right,
  placeholderTextColor,
  ...rest
}: ChildTextInputProps) => {
  const isAndroid = Platform.OS === 'android';
  const { colors, fonts } = theme;
  const font = fonts.regular;
  const hasActiveOutline = parentState.focused || error;

  const {
    fontSize: fontSizeStyle,
    fontWeight,
    height,
    paddingHorizontal,
    textAlign,
    ...viewStyle
  } = (StyleSheet.flatten(style) || {}) as TextStyle;
  const fontSize = fontSizeStyle || MAXIMIZED_LABEL_FONT_SIZE;

  const isPaddingHorizontalPassed =
    paddingHorizontal !== undefined && typeof paddingHorizontal === 'number';

  const adornmentConfig = getAdornmentConfig({
    left,
    right,
  });

  let { paddingLeft, paddingRight } = calculateFlatInputHorizontalPadding({
    adornmentConfig,
  });

  if (isPaddingHorizontalPassed) {
    paddingLeft = paddingHorizontal as number;
    paddingRight = paddingHorizontal as number;
  }

  const { leftLayout, rightLayout } = parentState;

  const rightAffixWidth = right
    ? rightLayout.width || ADORNMENT_SIZE
    : ADORNMENT_SIZE;

  const leftAffixWidth = left
    ? leftLayout.width || ADORNMENT_SIZE
    : ADORNMENT_SIZE;

  const adornmentStyleAdjustmentForNativeInput =
    getAdornmentStyleAdjustmentForNativeInput({
      adornmentConfig,
      rightAffixWidth,
      leftAffixWidth,
      paddingHorizontal,
      inputOffset: FLAT_INPUT_OFFSET,
      mode: InputMode.Flat,
    });

  let inputTextColor,
    activeColor,
    underlineColorCustom,
    placeholderColor,
    placeholderActive,
    errorColor;

  if (disabled) {
    inputTextColor = activeColor = color(colors.text)
      .alpha(0.54)
      .rgb()
      .string();
    placeholderColor = colors.disabled;
    underlineColorCustom = 'transparent';
  } else {
    inputTextColor = colors.text;
    activeColor = error ? colors.error : activeUnderlineColor || colors.primary;
    placeholderColor = colors.placeholder;
    placeholderActive = error ? colors.error : (!placeholderActiveColor ? colors.primary : placeholderActiveColor);
    errorColor = colors.error;
    underlineColorCustom = underlineColor || colors.disabled;
  }

  const containerStyle = {
    backgroundColor: theme.dark
      ? color(colors.background).lighten(0.24).rgb().string()
      : color(colors.background).darken(0.06).rgb().string(),
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness,
  };

  const labelScale = MINIMIZED_LABEL_FONT_SIZE / fontSize;
  const fontScale = MAXIMIZED_LABEL_FONT_SIZE / fontSize;

  const labelWidth = parentState.labelLayout.width;
  const labelHeight = parentState.labelLayout.height;
  const labelHalfWidth = labelWidth / 2;
  const labelHalfHeight = labelHeight / 2;

  const baseLabelTranslateX =
    (I18nManager.isRTL ? 1 : -1) *
      (labelHalfWidth - (labelScale * labelWidth) / 2) +
    (1 - labelScale) * (I18nManager.isRTL ? -1 : 1) * paddingLeft;

  const minInputHeight = dense
    ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) - LABEL_PADDING_TOP_DENSE
    : MIN_HEIGHT - LABEL_PADDING_TOP;

  const inputHeight = calculateInputHeight(labelHeight, height, minInputHeight);

  const topPosition = calculateLabelTopPosition(
    labelHeight,
    inputHeight,
    multiline && height ? 0 : !height ? minInputHeight / 2 : 0
  );

  if (height && typeof height !== 'number') {
    // eslint-disable-next-line
    console.warn('Currently we support only numbers in height prop');
  }

  const paddingSettings = {
    height: height ? +height : null,
    labelHalfHeight,
    offset: FLAT_INPUT_OFFSET,
    multiline: multiline ? multiline : null,
    dense: dense ? dense : null,
    topPosition,
    fontSize,
    label,
    scale: fontScale,
    isAndroid,
    styles: StyleSheet.flatten(
      dense ? styles.inputFlatDense : styles.inputFlat
    ) as Padding,
  };

  const pad = calculatePadding(paddingSettings);

  const paddingFlat = adjustPaddingFlat({
    ...paddingSettings,
    pad,
  });

  const baseLabelTranslateY =
    -labelHalfHeight - (topPosition + MINIMIZED_LABEL_Y_OFFSET);

  const placeholderOpacity = hasActiveOutline
    ? interpolatePlaceholder(parentState.labeled, hasActiveOutline)
    : parentState.labelLayout.measured
    ? 1
    : 0;

  const minHeight =
    height ||
    (dense ? (label ? MIN_DENSE_HEIGHT_WL : MIN_DENSE_HEIGHT) : MIN_HEIGHT);

  const flatHeight =
    inputHeight +
    (!height ? (dense ? LABEL_PADDING_TOP_DENSE : LABEL_PADDING_TOP) : 0);

  const iconTopPosition = (flatHeight - ADORNMENT_SIZE) / 2;

  const leftAffixTopPosition = leftLayout.height
    ? calculateFlatAffixTopPosition({
        height: flatHeight,
        ...paddingFlat,
        affixHeight: leftLayout.height,
      })
    : null;

  const rightAffixTopPosition = rightLayout.height
    ? calculateFlatAffixTopPosition({
        height: flatHeight,
        ...paddingFlat,
        affixHeight: rightLayout.height,
      })
    : null;

  const labelProps = {
    label,
    onLayoutAnimatedText,
    placeholderOpacity,
    error,
    placeholderStyle: styles.placeholder,
    baseLabelTranslateY,
    baseLabelTranslateX,
    placeholderActive,
    isRequired,
    font,
    fontSize,
    fontWeight,
    labelScale,
    wiggleOffsetX: LABEL_WIGGLE_X_OFFSET,
    topPosition,
    paddingOffset: { paddingLeft, paddingRight },
    hasActiveOutline,
    activeColor,
    placeholderColor,
    errorColor,
    roundness: theme.roundness,
  };
  const affixTopPosition = {
    [AdornmentSide.Left]: leftAffixTopPosition,
    [AdornmentSide.Right]: rightAffixTopPosition,
  };
  const onAffixChange = {
    [AdornmentSide.Left]: onLeftAffixLayoutChange,
    [AdornmentSide.Right]: onRightAffixLayoutChange,
  };

  let adornmentProps: TextInputAdornmentProps = {
    paddingHorizontal,
    adornmentConfig,
    forceFocus,
    topPosition: {
      [AdornmentType.Affix]: affixTopPosition,
      [AdornmentType.Icon]: iconTopPosition,
    },
    onAffixChange,
    isTextInputFocused: parentState.focused,
  };
  if (adornmentConfig.length) {
    adornmentProps = {
      ...adornmentProps,
      left,
      right,
      textStyle: { ...font, fontSize, fontWeight },
      visible: parentState.labeled,
    };
  }

  return (
    <View style={[containerStyle, viewStyle]}>
      <Underline
        parentState={parentState}
        underlineColorCustom={underlineColorCustom}
        error={error}
        colors={colors}
        activeColor={activeColor}
      />
      <View
        style={[
          styles.labelContainer,
          {
            minHeight,
          },
        ]}
      >
        {!isAndroid && multiline && label && (
          // Workaround for: https://github.com/callstack/react-native-paper/issues/2799
          // Patch for a multiline TextInput with fixed height, which allow to avoid covering input label with its value.
          <View
            testID="patch-container"
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              dense ? styles.densePatchContainer : styles.patchContainer,
              {
                backgroundColor:
                  viewStyle.backgroundColor || containerStyle.backgroundColor,
                left: paddingLeft,
                right: paddingRight,
              },
            ]}
          />
        )}
        <InputLabel parentState={parentState} labelProps={labelProps} />
        {render?.({
          ...rest,
          ref: innerRef,
          onChangeText,
          placeholder: label ? parentState.placeholder : rest.placeholder,
          placeholderTextColor: placeholderTextColor ?? placeholderColor,
          editable: !disabled && editable,
          selectionColor:
            typeof selectionColor === 'undefined'
              ? activeColor
              : selectionColor,
          onFocus,
          onBlur,
          underlineColorAndroid: 'transparent',
          multiline,
          style: [
            styles.input,
            { paddingLeft, paddingRight },
            !multiline || (multiline && height) ? { height: flatHeight } : {},
            paddingFlat,
            {
              ...font,
              fontSize,
              fontWeight,
              color: inputTextColor,
              textAlignVertical: multiline ? 'top' : 'center',
              textAlign: textAlign
                ? textAlign
                : I18nManager.isRTL
                ? 'right'
                : 'left',
            },
            Platform.OS === 'web' && { outline: 'none' },
            adornmentStyleAdjustmentForNativeInput,
          ],
        })}
      </View>
      <TextInputAdornment {...adornmentProps} />
    </View>
  );
};

export default TextInputFlat;

type UnderlineProps = {
  parentState: {
    focused: boolean;
  };
  error?: boolean;
  colors: {
    error: string;
  };
  activeColor: string;
  underlineColorCustom?: string;
};

const Underline = ({
  parentState,
  error,
  colors,
  activeColor,
  underlineColorCustom,
}: UnderlineProps) => {
  let backgroundColor = parentState.focused
    ? activeColor
    : underlineColorCustom;
  if (error) backgroundColor = colors.error;
  return (
    <Animated.View
      style={[
        styles.underline,
        {
          backgroundColor,
          // Underlines is thinner when input is not focused
          transform: [{ scaleY: parentState.focused ? 1 : 0.5 }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    zIndex: 1,
  },
  labelContainer: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  input: {
    flexGrow: 1,
    margin: 0,
  },
  inputFlat: {
    paddingTop: 24,
    paddingBottom: 4,
  },
  inputFlatDense: {
    paddingTop: 22,
    paddingBottom: 2,
  },
  patchContainer: {
    height: 24,
    zIndex: 2,
  },
  densePatchContainer: {
    height: 22,
    zIndex: 2,
  },
});
