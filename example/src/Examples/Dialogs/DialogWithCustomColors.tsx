import * as React from 'react';
import { Button, Portal, Dialog, Colors } from 'react-native-paper';
import { TextComponent } from './utils';
const DialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Portal>
    <Dialog
      onDismiss={close}
      style={{ backgroundColor: Colors.purple900 }}
      visible={visible}
    >
      <Dialog.Title style={{ color: Colors.white }}>Alert</Dialog.Title>
      <Dialog.Content>
        <TextComponent style={{ color: Colors.white }}>
          This is a dialog with custom colors
        </TextComponent>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color={Colors.white} onPress={close}>
          OK
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default DialogWithCustomColors;
