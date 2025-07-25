import * as React from 'react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Modalize, ModalizeProps } from 'react-native-modalize';
import { Ionicons } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('window');

interface ProfessionalModalProps extends Partial<ModalizeProps> {
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  height?: number;
  showHandle?: boolean;
  handleStyle?: any;
  headerStyle?: any;
  contentStyle?: any;
}

export interface ProfessionalModalRef {
  open: () => void;
  close: () => void;
}

const ProfessionalModal = forwardRef<ProfessionalModalRef, ProfessionalModalProps>(
  ({ 
    children, 
    title, 
    showCloseButton = true, 
    onClose,
    height = screenHeight * 0.7,
    showHandle = true,
    handleStyle,
    headerStyle,
    contentStyle,
    ...modalizeProps 
  }, ref) => {
    const modalizeRef = useRef<Modalize>(null);

    useImperativeHandle(ref, () => ({
      open: () => modalizeRef.current?.open(),
      close: () => modalizeRef.current?.close(),
    }));

    const handleClose = () => {
      modalizeRef.current?.close();
      onClose?.();
    };

    return (
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={false}
        modalHeight={height}
        panGestureEnabled={true}
        closeOnOverlayTap={true}
        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        modalStyle={{
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        handleStyle={{
          backgroundColor: '#D1D5DB',
          width: 40,
          height: 4,
          borderRadius: 2,
          ...handleStyle,
        }}
        handlePosition="inside"
        {...modalizeProps}
      >
        <View className="flex-1">
          {/* Custom Handle (only shown if showHandle is true) */}
          {showHandle && (
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
          )}

          {/* Header */}
          {(title || showCloseButton) && (
            <View 
              className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200"
              style={headerStyle}
            >
              {title && (
                <Text className="text-lg font-bold text-gray-800 flex-1">
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <TouchableOpacity 
                  onPress={handleClose}
                  className="p-2 -m-2"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content */}
          <View className="flex-1" style={contentStyle}>
            {children}
          </View>
        </View>
      </Modalize>
    );
  }
);

ProfessionalModal.displayName = 'ProfessionalModal';

export default ProfessionalModal; 