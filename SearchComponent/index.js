
import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList, StyleSheet, TextInput, KeyboardAvoidingView, Button } from 'react-native'
import Modal from 'react-native-modal';
const AddDua = ({ data, onItemSelect,label,style }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [filteredData, setFilteredData] = useState([])
    const [masterData, setMasterData] = useState([])
    const [search, setSearch] = useState('')
    const [isDisplay, setIsDisplay] = useState(false)


    const keyboardVerticalOffset = Platform.OS === 'ios' ? 20 : 0
    useEffect(() => {
        setMasterData(data)
        setFilteredData(data)
    }, [])


    const ItemView = ({ item }) => {
        return <Text style={styles.itemStyle} onPress={() => {
            setIsDisplay(false)
            setSearch(item[label])
            setModalVisible(false)
            onItemSelect(item)
        }}>
           {item[label].toUpperCase()}
        </Text>
    }

    const ItemSeparatorView = () => {
        return (
            <View
                style={{ height: 1, width: '100%', backgroundColor: '#ddd' }}
            />
        )
    }

    const searchFilter = (text) => {
        if (text) {
            const newData = masterData.filter((item) => {
                const itemData = item[label] ? item[label].toUpperCase() : ''.toUpperCase()
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;

            })
            setFilteredData(newData)
            setSearch(text)
            onItemSelect(text)
        }
        else {
            setFilteredData(masterData)
            setSearch(text)
        }
    }
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    return (
        <View >

            <View
            >
                <TextInput
                    style={[styles.textInputStyle, style]}
                    value={search}
                    onPressIn={() => { setModalVisible(true) }}

                    
                    placeholder="search"
                />
            </View>
            <Modal isVisible={modalVisible} style={[styles.view]}>
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
                    <View style={[styles.content]}>
                    <Button title="Hide modal" style={styles.close} onPress={toggleModal} />
                        <View style={{ position: 'relative' }}>
                            <TextInput
                                style={styles.textInputStyle}
                                value={search}
                                onFocus={() => { setIsDisplay(true) }}
                                onChange={() => { setIsDisplay(true) }}
                                placeholder="search"
                                onChangeText={(text) => { searchFilter(text) }}
                            />

                            <View style={{ display: isDisplay ? 'flex' : 'none', position: 'absolute', top: 100, zIndex: 99999, left: 0, right: 0, backgroundColor: 'white', width: '100%' }}>
                                <FlatList
                                    data={filteredData}
                                    keyExtractor={(item, index) => index.toString()}
                                    ItemSeparatorComponent={ItemSeparatorView}
                                    renderItem={ItemView}

                                />
                            </View>
                        </View>
                       
                    </View>


                </KeyboardAvoidingView>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    view: {
        marginTop: 40,
        justifyContent: 'flex-start',
        margin: 0,
        backgroundColor: 'white',
    },
    close : {
        color : 'red'
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    itemStyle: {
        padding: 15
    },
    textInputStyle: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingLeft: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        width: 300
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        width: 300
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
})
export default AddDua

