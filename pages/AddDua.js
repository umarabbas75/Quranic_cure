
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableWithoutFeedback, SafeAreaView, ScrollView, StyleSheet,
  TouchableOpacity, TextInput
} from 'react-native';
import surah from '../data/surah'
import diseases from '../data/diseases'
import QuranicArabic from '../data/QuranicArabic'
import QuranicEnglish from '../data/QuranicEnglish'
import QuranicUrdu from '../data/QuranicUrdu'
import { openDatabase } from 'react-native-sqlite-storage';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import SearchComponent from '../SearchComponent'
var db = openDatabase({ name: 'QURANICCUREAPP.db' });

const AddDua = () => {


  const [allCategories, setAllCategories] = useState([])
  const [category, setCategories] = useState()
  const [categoryId, setCategoryId] = useState('')
  const [disease, setDisease] = useState('')
  const [surahName, setSurahName] = useState(undefined)
  const [description, setDescription] = useState('')
  const [count, setCount] = useState(0)
  const [selectedDisease, setSelectedDisease] = useState('')
  const [surahAyats, setSurahAyats] = useState(1)
  const [selectedSurah, setSelectedSurah] = useState(0)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(0)
  const [categoryError, setCategoryError] = useState(false)
  const [diseaseError, setDiseaseError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)
  const [surahError, setSurahError] = useState(false)
  const [countError, setCountError] = useState(false)
  const [minError1, setMinError1] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  





  const fetchCategoriesOnPageLoad = () => {
    db.transaction((tx) => {
      tx.executeSql(

        'SELECT category_name,category_id FROM table_category',
        [],
        (tx, results) => {
          var len = results.rows.length;

          var rows = []
          for (var i = 0; i < len; i++) {
            var row = results.rows.item(i);
            rows.push(row)

          }
          rows.forEach((item) => {
            item.label = item.category_name
            item.value = item.category_name
          })
          setAllCategories(rows)
          if (len > 0) {
            setUserData(results.rows.item(0));
          } else {
            alert('No user found');
          }
        }
      );
    });
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM sqlite_master WHERE type='table' AND name='table_dua'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_dua', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_dua(dua_id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER,  disease VARCHAR(200), description VARCHAR(200),  surah VARCHAR(200), minValue VARCHAR(200),maxValue VARCHAR(200),count VARCHAR(200),ayatsArabic TEXT, ayatsEnglish TEXT, ayatsUrdu TEXT)',
              []
            );
          }
        }
      )
    });
  }

  useEffect(fetchCategoriesOnPageLoad, [])


  const onSurahChange = (item) => {

      setSurahName(item.label)
      setSelectedSurah(item.id)
      setSurahAyats(item.totalAyat)
  }

  const saveDuaInDb = () => {

    let ourSurahArabic = []
    QuranicArabic.forEach(item => {
      if (item.surah_number === selectedSurah) {
        ourSurahArabic.push(item)
      }
    })

    let ourAyatsArabic = []
    ourSurahArabic.forEach(item => {
      if (item.verse_number >= minValue && item.verse_number <= maxValue) {
        ourAyatsArabic.push(item)
      }
    })

    let ourSurahEnglish = []
    QuranicEnglish.forEach(item => {
      if (item.surah_number === selectedSurah) {
        ourSurahEnglish.push(item)
      }
    })

    let ourAyatsEnglish = []
    ourSurahEnglish.forEach(item => {
      if (item.verse_number >= minValue && item.verse_number <= maxValue) {
        ourAyatsEnglish.push(item)
      }
    })

    let ourSurahUrdu = []
    QuranicUrdu.forEach(item => {
      if (item.surah == selectedSurah) {
        ourSurahUrdu.push(item)
      }
    })

    let ourAyatsUrdu = []
    ourSurahUrdu.forEach(item => {
      if (parseInt(item.aya) >= parseInt(minValue) && parseInt(item.aya) <= parseInt(maxValue)) {
        ourAyatsUrdu.push(item)
      }
    })




    ourAyatsArabic = JSON.stringify(ourAyatsArabic)
    ourAyatsEnglish = JSON.stringify(ourAyatsEnglish)
    ourAyatsUrdu = JSON.stringify(ourAyatsUrdu)

    console.log('==========categoryId======',categoryId)
    console.log('==========disease======',disease)
    console.log('==========description======',description)
    console.log('==========selectedSurah======',selectedSurah)
    console.log('==========minValue======',minValue)
    console.log('==========maxValue======',maxValue)
    console.log('==========count======',count)
    console.log('==========ourAyatsArabic======',ourAyatsArabic)
    console.log('==========ourAyatsEnglish======',ourAyatsEnglish)
    console.log('==========ourAyatsUrdu======',ourAyatsUrdu)


    if (categoryId && disease && description && selectedSurah && minValue && maxValue && count && !minError1) {

      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO table_dua( category_id ,  disease, description ,  surah , minValue ,maxValue ,count ,ayatsArabic , ayatsEnglish , ayatsUrdu ) VALUES  (?,?,?,?,?,?,?,?,?,?)',
          [categoryId, disease, description, selectedSurah, minValue, maxValue, count, ourAyatsArabic, ourAyatsEnglish, ourAyatsUrdu],
          (tx, results) => {

            if (results.rowsAffected > 0) {
              Toast.show({
                text1: 'Success',
                text2: 'Dua has been addedd successfully! 👋'
              });
              setCount(0)
              setDisease(null)
              setCategories(null)
              setDescription('')
              setMaxValue('')
              setMinValue('')
            } else alert('Registration Failed');
          }
        );
      });

    }
    else {
      alert('Please enter the data')
      if (!categoryId) {
        setCategoryError(true)
      }
      if (!disease) {
        setDiseaseError(true)
      }
      if (!description) {
        setDescriptionError(true)
      }
      if (!selectedSurah) {
        setSurahError(true)
      }
      if (!count) {
        setCountError(true)
      }
      

    }


  }



  const resetData = () => {

    setCount(0)
    setDisease(null)
    setCategories(null)
    setDescription('')
    setMinValue('')
    setMaxValue('')


  }
  const categoryFn = (value) => {
    if (value && allCategories) {
      setCategories(value)
      const result = allCategories && allCategories.find(x => x.category_name == value);
      setCategoryError(false)
      setCategoryId(result.category_id)
      setSelectedDisease(result.value)
    }
  }

  const validateAyatNumber = (value) => {

    console.log('==========minValue========',minValue,value,surahAyats)
    if(parseInt(value) > surahAyats && parseInt(value) > parseInt(minValue)){
      setMinError1(true)
      setErrorMessage('value cannot be greater then total ayats')
      setMaxValue(value)
    }
    else if(parseInt(value)  < surahAyats && parseInt(value) > parseInt(minValue)){
      console.log('==========here========',minValue,value)
      setMaxValue(value)
      setMinError1(false)
      setErrorMessage('')
    }
    else if(parseInt(value)  < surahAyats && parseInt(value)  < parseInt(minValue)){
      setMaxValue(value)
      setMinError1(true)
      setErrorMessage('value cannot be less then min value')
    }
    
  
  }

  const validateMinAyat = (value) => {
    
    console.log('==========maxValue========',maxValue,value,surahAyats)
    if(maxValue){
      if(parseInt(value)  > parseInt(maxValue) && parseInt(value)  < surahAyats){
        setMinError1(true)
        setErrorMessage('value cannot be greater then max value')
        setMinValue(value)
      }
      else if(parseInt(value)  > parseInt(maxValue) && parseInt(value)  > surahAyats){
        setMinError1(true)
        setErrorMessage('value cannot be greater then max total ayats')
        setMinValue(value)
      }
      else if(parseInt(value)  < surahAyats && parseInt(value)  < parseInt(maxValue)){
        setMinValue(value)
        setMinError1(false)
        setErrorMessage('')
      } 
    }
    else{
      if(parseInt(value) > surahAyats){
        setMinValue(value)
        setMinError1(true)
        setErrorMessage('value cannot be greater then max total ayats')
      }
      else{
        setMinValue(value)
        setMinError1(false)
        setErrorMessage('')
      }
      
    }
  
  }

  return (

    <ScrollView>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback >
          <View style={{ flex: 1, padding: 16 }}>
            <View
              style={{flex: 1,justifyContent: 'center', }}>



              {/* category input field */}
              <View style={styles.label}>
                <Text style={styles.labelText}>
                  Category
                </Text>

                <View>
                  <View style={styles.RNPickerContainer}>
                    <RNPickerSelect
                      value={category}
                      onValueChange={(value) => categoryFn(value)}
                      items={allCategories}
                    />
                  </View>
                  {categoryError && <Text style={styles.error}>Please select category!</Text>}
                </View>
              </View>


              {/* disease input field */}
              <View style={[styles.label,{marginTop : 25}]}>
                <Text style={styles.labelText}>
                  Disease
                </Text>
                <View>
                  <View style={styles.RNPickerContainer}>
                    <RNPickerSelect
                      style={{ inputAndroid: { color: 'black', width: 200, } }}
                      value={disease}
                      onValueChange={(value) => {
                        setDiseaseError(false)
                        setDisease(value)
                      }}
                      items={diseases[selectedDisease] || { label: '', value: '' }}
                    /></View>
                  {diseaseError && <Text style={styles.error}>Please select disease!</Text>}
                </View>
              </View>


              {/* description input field */}
              <View style={[styles.label,{marginTop : 25}]}>
                <Text style={styles.labelText}>
                  Description
                </Text>
                <View>
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    value={description}
                    onChangeText={(item) => {
                      setDescriptionError(false)
                      setDescription(item)
                    }}
                  />
                  {descriptionError && <Text style={styles.error}>Please enter description!</Text>}
                </View>
              </View>

               {/* surah input field */}
              <View style={[styles.label,{marginTop : 25}]}>
                <Text style={styles.labelText}>
                  Surah
                </Text>
                <View>
                  <SearchComponent
                    data={surah}
                    label={'label'}
                    style={{borderColor : '#7a42f4',width: 200,}}
                    onItemSelect={(text) => {
                      setSurahError(false)
                      onSurahChange(text)
                    }}
                  />
                  {surahError && <Text style={styles.error}>Please select surah!</Text>}
                </View>
              </View>


              {/* ayats input field */}
              <View>
                <View style={[styles.label]}>
                  <Text
                    style={styles.labelText}>
                    Ayats
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 40 }}>
                    <View>
                      <TextInput
                        keyboardType="numeric"
                        style={[styles.number,{marginRight : 10}]}
                        onChangeText={(value) => { validateMinAyat(value) }}
                        placeholder="from"
                        placeholderTextColor="gray"
                      />
                      <Text style={{ color: 'gray', fontSize: 11 }}> MinValue : 1</Text>
                    </View>
                    <View>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.number}
                        onChangeText={(value) => { validateAyatNumber(value) }}
                        placeholder="to"
                        placeholderTextColor="gray"

                      />
                      <Text style={{ color: 'gray', fontSize: 11 }}> MaxValue :  {surahAyats}</Text>

                    </View>


                  </View>
                
               
                </View>
                <View style={{marginLeft : 160,marginTop : 10}}>
                 {minError1 && <Text style={styles.error}>{errorMessage}</Text>}
                 
                </View>
              </View>


                {/* count input field */}
              <View style={[styles.label,{marginTop : 25}]}>
                <Text
                  style={styles.count}>
                  Count

                </Text>

                <View>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    value={count}
                    onChangeText={(item) => {
                      setCountError(false)
                      setCount(item)
                    }}
                  />
                  {countError && <Text style={styles.error}>Please enter count!</Text>}
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => { saveDuaInDb() }}
              >
                <Text style={styles.submitButtonText}> Save </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => { resetData() }}

              >
                <Text style={styles.submitButtonText}> Cancel </Text>
              </TouchableOpacity>

            </View>

          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddDua;

const styles = StyleSheet.create({


  input: {
    height: 45,
    width: 200,
    borderColor: '#7a42f4',
    borderWidth: 1,
    borderRadius: 5,

  },
  submitButton: {
    backgroundColor: '#7a52f4',
    padding: 10,
    margin: 15,
    height: 40,

  },
  submitButtonText: {
    color: 'white',
    width: 300,
    textAlign: 'center'
  },
  label : { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' },
  labelText : {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginRight: 20,
    marginTop: 10
  },
  RNPickerContainer : { 
    borderWidth: 1, 
    height: 45, 
    borderColor: '#7a42f4', 
    width: 200, 
    borderRadius: 5, 
    marginBottom: 10 
  },
    number : {
      height: 45,
      padding: 10,
      width: 95,
      borderColor: '#7a42f4',
      borderWidth: 1,
      borderRadius: 5,
    },
    count : {
      fontSize: 16,
      alignSelf: 'flex-start',
      marginRight: 20,
      marginTop: 5
    },
    error : { color: 'red', fontSize: 11 }

})
