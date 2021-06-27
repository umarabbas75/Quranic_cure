import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Text,
    Platform
} from 'react-native'
import Modal from 'react-native-modal'
import { useDispatch } from 'react-redux'
const index = ({ isModalVisible, modalType, children, contentStyle, modalCustomStyle, showCloseButton }) => {
    
    const dispatch = useDispatch();
    const toggleModal = () => {
        dispatch({
            type: modalType
        })
    };
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 20 : 0
 
    return (
        <Modal isVisible={isModalVisible} style={[styles.view, modalCustomStyle]}>
         <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
       
            <View style={[styles.content, contentStyle]}>
                {showCloseButton && <Text onPress={toggleModal} style={styles.closeButton}>x</Text>}
                {children}
            </View>
       </KeyboardAvoidingView>
        </Modal>

    )
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    closeButton: {

        position: 'absolute',
        right: 20,
        top: 10,
        fontSize: 20
    }
});
export default index
