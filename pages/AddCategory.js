
var RNFS = require('react-native-fs');
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import {
  ScrollView, View, Text, SafeAreaView, TextInput, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import {
  launchImageLibrary,
} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'QURANICCUREAPP.db' });

const FirstPage = ({ navigation }) => {

  const [alreadyCategory, setAlreadyExistedCategory] = useState([])
  const [filePath, setFilePath] = useState({});
  const [pathForDb, setPathForDb] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [showCategoryError, setCategoryError] = useState(false);
  const [showImage, setImageError] = useState(false);


  useEffect(() => {
    setPathForDb('')
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM sqlite_master WHERE type='table' AND name='table_category'",
        [],
        function (tx, res) {

          if (res.rows.length == 0) {
            var path = RNFS.DocumentDirectoryPath + '/quranicAssets/';

            RNFS.mkdir(path)
              .then(async (success) => {
                console.log('DIR Created!');
              })
              .catch((err) => {
                console.log(err.message);
              });
            txn.executeSql('DROP TABLE IF EXISTS table_category', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_category(category_id INTEGER PRIMARY KEY AUTOINCREMENT, category_name VARCHAR(20),  category_image VARCHAR(200))',
              []
            );
          }
        }
      );
    });
  }, []);
  useFocusEffect(
    useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(

          'SELECT category_name FROM table_category',
          [],
          (tx, results) => {
            var len = results.rows.length;

            var rows = []
            for (var i = 0; i < len; i++) {
              var row = results.rows.item(i);
              rows.push(row)

            }
            setAlreadyExistedCategory(rows)

          }
        );
      });


    }, [])
  );
 
  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {


      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }

      let name = response.uri.split("/")
      let path = RNFS.DocumentDirectoryPath + "/quranicAssets/" + name[name.length - 1]
      setPathForDb(path)
      setFilePath(response);
      setImageError(false)
      RNFS.copyFile(response.uri, path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        .then((result) => {
          console.log('File copied', result)

        })
    });

  };

  const addCategory = () => {
    let isAlreadyExist = true
    alreadyCategory && alreadyCategory.length && alreadyCategory.map(item => {

      if (item.category_name.toLowerCase() === categoryName.toLowerCase()) {

        isAlreadyExist = false

        Toast.show({
          text1: 'Error',
          text2: 'Category name already exist! 👋'
        });
        return ''
      }
    })

    if (categoryName && pathForDb && isAlreadyExist) {

      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO table_category( category_name, category_image) VALUES (?,?)',
          [categoryName, pathForDb],
          (tx, results) => {
            console.log('Results', results);
            if (results.rowsAffected > 0) {
              setCategoryName('')
              setFilePath('')
              setCategoryError(false)
              setImageError(false)
              Toast.show({
                text1: 'Success',
                text2: 'Category has been addedd successfully! 👋'
              });
            } else alert('Registration Failed');
          }
        );
      });
    }
    else {

      if (!categoryName) {
        setCategoryError(true)
      }
      if (!pathForDb) {
        setImageError(true)
      }
    }

  }

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={"height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView>
        <SafeAreaView style={{ flex: 1 }}>

          <View style={{ flex: 1, padding: 16 }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>

              <Text
                style={{
                  fontSize: 30,
                  alignSelf: 'flex-start',
                  marginLeft: 35
                }}>
                Category Name
          </Text>
              <TextInput
                style={styles.input}
                value={categoryName}
                underlineColorAndroid="transparent"
                placeholder="             Enter Category Name"
                placeholderTextColor="black"
                autoCapitalize="none"
                onChangeText={(text) => {
                  setCategoryName(text)
                  if (text) {
                    setCategoryError(false)
                  }
                }}
              />
              {showCategoryError && <Text style={{ color: 'red', fontSize: 11 }}>Category name is required!</Text>}


              <Text
                style={{
                  fontSize: 30,
                  alignSelf: 'flex-start',
                  marginLeft: 35

                }}>
                Upload Images
          </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={() => chooseFile('photo')}>
                <Text style={styles.textStyle}>Choose Image</Text>

              </TouchableOpacity>


              {/* <Image

            source={{ uri: filePath.uri }}
            style={styles.imageStyle}
          /> */}
              <Image
                resizeMode='cover'
                style={styles.imageLogo}
                source={filePath.uri ? { uri: filePath.uri } :

                  require('../assets/user.png')
                }
              />
              {showImage && <Text style={{ color: 'red', fontSize: 11, textAlign: 'left' }}>Image is required!</Text>}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => { addCategory() }}
              >
                <Text style={styles.submitButtonText}> Submit </Text>
              </TouchableOpacity>


            </View>

          </View>

        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FirstPage;

const styles = StyleSheet.create({
  container: {
    paddingTop: 23
  },
  input: {
    margin: 15,
    height: 40,
    width: 250,
    borderColor: '#7a42f4',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,

  },
  submitButton: {
    backgroundColor: '#7a52f4',
    padding: 10,
    margin: 15,
    height: 40,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    width: 230,
    textAlign: 'center'
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 2,
    marginVertical: 10,
    width: 250,
    borderColor: '#7a42f4',
    borderWidth: 1,
    borderRadius: 5,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
     borderRadius: 5,
  },
  imageView: {
    marginTop: 5,
    alignSelf: 'center',
    width: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  imageLogo: {
    width: 250,
    height: 200,
    margin: 5,
    borderColor: '#7a42f4',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10
  },
})
