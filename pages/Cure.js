

import { useFocusEffect } from '@react-navigation/core';
import React, { useState, useEffect } from 'react';
import {
  Button, View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Image, Alert
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'QURANICCUREAPP123.db' });

const FirstPage = ({ navigation }) => {
  let [userData, setUserData] = useState({});
  const [allCategories, setAllCategories] = useState([])
  useFocusEffect(
    React.useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(

          'SELECT * FROM table_category',
          [],
          (tx, results) => {
            var len = results.rows.length;

            var rows = []
            for (var i = 0; i < len; i++) {
              var row = results.rows.item(i);
              rows.push(row)

            }
            
            setAllCategories(rows)

            if (len > 0) {
              setUserData(results.rows.item(0));
            } else {
              alert('No user found');
            }
          }
        );
      });


    }, [])
  );


  const list = () => {

    return allCategories && allCategories.map((element) => {

      return (
        <View key={element.category_id} style={{ margin: 10}}>
          <Image source={{ uri: 'file://' + element.category_image }}
            style={{ width: 80, height: 80, marginHorizontal: 20 , borderColor: '#7a42f4',
            borderWidth: 1,
            borderRadius: 5,}} />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              navigation.navigate('Details', {
                cat_id: element.category_id,
                cat_name : element.category_name
              })
            }}
          >
            <Text style={styles.submitButtonText}> {element.category_name} </Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1 }}>

        <View style={{ flex: 1, padding: 33, display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>


          {list()}


        </View>

      </SafeAreaView>
    </ScrollView>
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
    padding: 10
  },
  submitButton: {
    backgroundColor: '#7a52f4',
    padding: 10,
    marginTop: 11,
    margin: 22,
    height: 40,
    width: 80,
    textAlign: 'center',
    borderRadius: 10,



  },
  submitButtonText: {
    color: 'white',
    width: 60,
    textAlign: 'center',
    fontWeight: 'bold',

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
    padding: 5,
    marginVertical: 10,
    width: 250,
  },

})


