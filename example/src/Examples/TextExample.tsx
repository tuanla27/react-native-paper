import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const TextExample = () => {
  const { isV3 } = useTheme();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {!isV3 && (
          <>
            <Caption style={styles.text}>Caption</Caption>
            <Paragraph style={styles.text}>Paragraph</Paragraph>
            <Subheading style={styles.text}>Subheading</Subheading>
            <Title style={styles.text}>Title</Title>
            <Headline style={styles.text}>Headline</Headline>
          </>
        )}

        {isV3 && (
          <>
            <Text style={styles.text} variant="display-large">
              Display Large
            </Text>
            <Text style={styles.text} variant="display-medium">
              Display Medium
            </Text>
            <Text style={styles.text} variant="display-small">
              Display small
            </Text>

            <Text style={styles.text} variant="headline-large">
              Headline Large
            </Text>
            <Text style={styles.text} variant="headline-medium">
              Headline Medium
            </Text>
            <Text style={styles.text} variant="headline-small">
              Headline Small
            </Text>

            <Text style={styles.text} variant="title-large">
              Title Large
            </Text>
            <Text style={styles.text} variant="title-medium">
              Title Medium
            </Text>
            <Text style={styles.text} variant="title-small">
              Title Small
            </Text>

            <Text style={styles.text} variant="body-large">
              Body Large
            </Text>
            <Text style={styles.text} variant="body-medium">
              Body Medium
            </Text>
            <Text style={styles.text} variant="body-small">
              Body Small
            </Text>

            <Text style={styles.text} variant="label-large">
              Label Large
            </Text>
            <Text style={styles.text} variant="label-medium">
              Label Medium
            </Text>
            <Text style={styles.text} variant="label-small">
              Label Small
            </Text>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

TextExample.title = 'Typography';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    marginVertical: 4,
  },
});

export default TextExample;
