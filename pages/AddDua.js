
import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/core';
var db = openDatabase({ name: 'QURANICCUREAPP123.db' });

const AddDua = () => {


  const [allCategories, setAllCategories] = useState([])
  const [category, setCategories] = useState()
  const [categoryId, setCategoryId] = useState('')
  const [disease, setDisease] = useState('')
  const [surahName, setSurahName] = useState(undefined)
  const [surahName1, setSurahName1] = useState(undefined)
  const [surahName2, setSurahName2] = useState(undefined)
  const [description, setDescription] = useState('')
  const [description1, setDescription1] = useState('')
  const [description2, setDescription2] = useState('')
  const [count, setCount] = useState(0)
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [selectedDisease, setSelectedDisease] = useState('')
  const [surahAyats, setSurahAyats] = useState(1)
  const [surahAyats1, setSurahAyats1] = useState(1)
  const [surahAyats2, setSurahAyats2] = useState(1)
  const [selectedSurah, setSelectedSurah] = useState(0)
  const [selectedSurah1, setSelectedSurah1] = useState(0)
  const [selectedSurah2, setSelectedSurah2] = useState(0)
  const [minValue, setMinValue] = useState(0)
  const [minValue1, setMinValue1] = useState(0)
  const [minValue2, setMinValue2] = useState(0)
  const [maxValue, setMaxValue] = useState(0)
  const [maxValue1, setMaxValue1] = useState(0)
  const [maxValue2, setMaxValue2] = useState(0)
  const [categoryError, setCategoryError] = useState(false)
  const [diseaseError, setDiseaseError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)
  const [descriptionError1, setDescriptionError1] = useState(false)
  const [descriptionError2, setDescriptionError2] = useState(false)
  const [surahError, setSurahError] = useState(false)
  const [surahError1, setSurahError1] = useState(false)
  const [surahError2, setSurahError2] = useState(false)
  const [countError, setCountError] = useState(false)
  const [countError1, setCountError1] = useState(false)
  const [countError2, setCountError2] = useState(false)
  const [minError, setMinError] = useState(false)
  const [minError1, setMinError1] = useState(false)
  const [minError2, setMinError2] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorMessage1, setErrorMessage1] = useState('')
  const [errorMessage2, setErrorMessage2] = useState('')
  const [moreData, setMoreData] = useState(false)
  const [countButton, setCountButton] = useState(0)



  console.log('==============maxvalues,', maxValue, maxValue1, maxValue2)
  useFocusEffect(
    useCallback(() => {
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
              //27 total fields including duaid-which is auto incremented
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS table_dua(dua_id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER,  disease VARCHAR(200), description VARCHAR(200),description1 VARCHAR(200),description2 VARCHAR(200),  surah VARCHAR(200),surah1 VARCHAR(200),surah2 VARCHAR(200), minValue VARCHAR(200),maxValue VARCHAR(200),minValue1 VARCHAR(200),maxValue1 VARCHAR(200),minValue2 VARCHAR(200),maxValue2 VARCHAR(200),count VARCHAR(200),count1 VARCHAR(200),count2 VARCHAR(200),ayatsArabic TEXT, ayatsEnglish TEXT, ayatsUrdu TEXT,ayatsArabic1 TEXT, ayatsEnglish1 TEXT, ayatsUrdu1 TEXT,ayatsArabic2 TEXT, ayatsEnglish2 TEXT, ayatsUrdu2 TEXT)',
                []
              );
            }
          }
        )
      });

    }, [])
  );


  const onSurahChange = (item, name) => {
    if (name === 'surah1') {
      setSurahName1(item.label)
      setSelectedSurah1(item.id)
      setSurahAyats1(item.totalAyat)
    }
    if (name === 'surah2') {
      setSurahName2(item.label)
      setSelectedSurah2(item.id)
      setSurahAyats2(item.totalAyat)
    }
    else if (name === 'surah0') {
      setSurahName(item.label)
      setSelectedSurah(item.id)
      setSurahAyats(item.totalAyat)
    }

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

    // ist ayats
    let ourSurahArabic1 = []
    QuranicArabic.forEach(item => {
      if (item.surah_number === selectedSurah1) {
        ourSurahArabic1.push(item)
      }
    })

    let ourAyatsArabic1 = []
    ourSurahArabic1.forEach(item => {
      if (item.verse_number >= minValue1 && item.verse_number <= maxValue1) {
        ourAyatsArabic1.push(item)
      }
    })

    let ourSurahEnglish1 = []
    QuranicEnglish.forEach(item => {
      if (item.surah_number === selectedSurah1) {
        ourSurahEnglish1.push(item)
      }
    })

    let ourAyatsEnglish1 = []
    ourSurahEnglish1.forEach(item => {
      if (item.verse_number >= minValue1 && item.verse_number <= maxValue1) {
        ourAyatsEnglish1.push(item)
      }
    })

    let ourSurahUrdu1 = []
    QuranicUrdu.forEach(item => {
      if (item.surah == selectedSurah1) {
        ourSurahUrdu1.push(item)
      }
    })

    let ourAyatsUrdu1 = []
    ourSurahUrdu1.forEach(item => {
      if (parseInt(item.aya) >= parseInt(minValue1) && parseInt(item.aya) <= parseInt(maxValue1)) {
        ourAyatsUrdu1.push(item)
      }
    })


    //2nd ayats
    let ourSurahArabic2 = []
    QuranicArabic.forEach(item => {
      if (item.surah_number === selectedSurah2) {
        ourSurahArabic2.push(item)
      }
    })

    let ourAyatsArabic2 = []
    ourSurahArabic2.forEach(item => {
      if (item.verse_number >= minValue2 && item.verse_number <= maxValue2) {
        ourAyatsArabic2.push(item)
      }
    })

    let ourSurahEnglish2 = []
    QuranicEnglish.forEach(item => {
      if (item.surah_number === selectedSurah2) {
        ourSurahEnglish2.push(item)
      }
    })

    let ourAyatsEnglish2 = []
    ourSurahEnglish2.forEach(item => {
      if (item.verse_number >= minValue2 && item.verse_number <= maxValue2) {
        ourAyatsEnglish2.push(item)
      }
    })

    let ourSurahUrdu2 = []
    QuranicUrdu.forEach(item => {
      if (item.surah == selectedSurah2) {
        ourSurahUrdu2.push(item)
      }
    })

    let ourAyatsUrdu2 = []
    ourSurahUrdu2.forEach(item => {
      if (parseInt(item.aya) >= parseInt(minValue2) && parseInt(item.aya) <= parseInt(maxValue2)) {
        ourAyatsUrdu2.push(item)
      }
    })


    ourAyatsArabic = JSON.stringify(ourAyatsArabic)
    ourAyatsEnglish = JSON.stringify(ourAyatsEnglish)
    ourAyatsUrdu = JSON.stringify(ourAyatsUrdu)

    ourAyatsArabic1 = JSON.stringify(ourAyatsArabic1)
    ourAyatsEnglish1 = JSON.stringify(ourAyatsEnglish1)
    ourAyatsUrdu1 = JSON.stringify(ourAyatsUrdu1)


    ourAyatsArabic2 = JSON.stringify(ourAyatsArabic2)
    ourAyatsEnglish2 = JSON.stringify(ourAyatsEnglish2)
    ourAyatsUrdu2 = JSON.stringify(ourAyatsUrdu2)

    console.log('==========categoryId======', categoryId)
    console.log('==========disease======', disease)
    console.log('==========description======', description)
    console.log('==========selectedSurah======', selectedSurah)
    console.log('==========minValue======', minValue)
    console.log('==========maxValue======', maxValue)
    console.log('==========count======', count)
    console.log('==========ourAyatsArabic======', ourAyatsArabic)
    console.log('==========ourAyatsEnglish======', ourAyatsEnglish)
    console.log('==========ourAyatsUrdu======', ourAyatsUrdu)

    console.log('==========ourAyatsArabic1======', ourAyatsArabic1)
    console.log('==========ourAyatsEnglish1======', ourAyatsEnglish1)
    console.log('==========ourAyatsUrdu1======', ourAyatsUrdu1)
    console.log('==========selectedSurah1======', selectedSurah1)
    console.log('==========minValue1======', minValue1)
    console.log('==========maxValue1======', maxValue1)
    console.log('==========description1======', description1)
    console.log('==========count1======', count1)

    console.log('==========ourAyatsArabic2======', ourAyatsArabic2)
    console.log('==========ourAyatsEnglish2======', ourAyatsEnglish2)
    console.log('==========ourAyatsUrdu2======', ourAyatsUrdu2)
    console.log('==========selectedSurah2======', selectedSurah2)
    console.log('==========minValue2======', minValue2)
    console.log('==========maxValue2======', maxValue2)
    console.log('==========description2======', description2)
    console.log('==========count2======', count2)


    if (categoryId && disease && description && selectedSurah && minValue && maxValue && count && !minError) {

      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO table_dua( category_id ,  disease, description,description1,description2,  surah ,surah1,surah2, minValue ,minValue1,minValue2, maxValue,maxValue1,maxValue2 , count, count1,count2, ayatsArabic ,ayatsArabic1,ayatsArabic2, ayatsEnglish ,ayatsEnglish1,ayatsEnglish2, ayatsUrdu ,ayatsUrdu1,ayatsUrdu2) VALUES  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [categoryId, disease, description, description1, description2, selectedSurah, selectedSurah1, selectedSurah2, minValue, minValue1, minValue2, maxValue, maxValue1, maxValue2, count, count1, count2, ourAyatsArabic, ourAyatsArabic1, ourAyatsArabic2, ourAyatsEnglish, ourAyatsEnglish1, ourAyatsEnglish2, ourAyatsUrdu, ourAyatsUrdu1, ourAyatsUrdu2],
          (tx, results) => {

            if (results.rowsAffected > 0) {
              Toast.show({
                text1: 'Success',
                text2: 'Dua has been addedd successfully! 👋'
              });

              setDisease(null)
              setCategories(null)
              setCount(0)
              setDescription('')
              setMaxValue('')
              setMinValue('')
              setCount1(0)
              setDescription1('')
              setMaxValue1('')
              setMinValue1('')
              setCount2(0)
              setDescription2('')
              setMaxValue2('')
              setMinValue2('')
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

    setDisease(null)
    setCategories(null)
    setCount(0)
    setDescription('')
    setMaxValue('')
    setMinValue('')
    setCount1(0)
    setDescription1('')
    setMaxValue1('')
    setMinValue1('')
    setCount2(0)
    setDescription2('')
    setMaxValue2('')
    setMinValue2('')


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
    setMaxValue(parseInt(value))
    // console.log('==========minValue========', minValue, value, surahAyats)
    // if (parseInt(value) > surahAyats && parseInt(value) > parseInt(minValue)) {
    //   setMinError(true)
    //   setErrorMessage('value cannot be greater then total ayats')
    //   setMaxValue(parseInt(value))
    // }
    // else if (parseInt(value) < surahAyats && parseInt(value) > parseInt(minValue)) {
    //   console.log('==========here========', minValue, value)
    //   setMaxValue(parseInt(value))
    //   setMinError(false)
    //   setErrorMessage('')
    // }
    // else if (parseInt(value) < surahAyats && parseInt(value) < parseInt(minValue)) {
    //   setMaxValue(parseInt(value))
    //   setMinError(true)
    //   setErrorMessage('value cannot be less then min value')
    // }


  }

  const validateMinAyat = (value) => {
    setMinValue(parseInt(value))
    // console.log('==========maxValue========', maxValue, value, surahAyats)
    // if (maxValue) {
    //   if (parseInt(value) > parseInt(maxValue) && parseInt(value) < surahAyats) {
    //     setMinError(true)
    //     setErrorMessage('value cannot be greater then max value')
    //     setMinValue(parseInt(value))
    //   }
    //   else if (parseInt(value) > parseInt(maxValue) && parseInt(value) > surahAyats) {
    //     setMinError(true)
    //     setErrorMessage('value cannot be greater then max total ayats')
    //     setMinValue(parseInt(value))
    //   }
    //   else if (parseInt(value) < surahAyats && parseInt(value) < parseInt(maxValue)) {
    //     setMinValue(parseInt(value))
    //     setMinError(false)
    //     setErrorMessage('')
    //   }
    // }
    // else {
    //   if (parseInt(value) > surahAyats) {
    //     setMinValue(parseInt(value))
    //     setMinError(true)
    //     setErrorMessage('value cannot be greater then max total ayats')
    //   }
    //   else {
    //     setMinValue(parseInt(value))
    //     setMinError(false)
    //     setErrorMessage('')
    //   }

    // }

  }
  const validateAyatNumber1 = (value) => {
    setMaxValue1(value)

    // if (parseInt(value) > surahAyats1 && parseInt(value) > parseInt(minValue1)) {
    //   setMinError1(true)
    //   setErrorMessage1('value cannot be greater then total ayats')
    //   setMaxValue1(value)
    // }
    // else if (parseInt(value) < surahAyats1 && parseInt(value) > parseInt(minValue1)) {
    //   setMaxValue1(value)
    //   setMinError1(false)
    //   setErrorMessage1('')
    // }
    // else if (parseInt(value) < surahAyats1 && parseInt(value) < parseInt(minValue1)) {
    //   setMaxValue1(value)
    //   setMinError1(true)
    //   setErrorMessage1('value cannot be less then min value')
    // }


  }

  const validateMinAyat1 = (value) => {
    setMinValue1(value)

    // if (maxValue1) {
    //   if (parseInt(value) > parseInt(maxValue1) && parseInt(value) < surahAyats1) {
    //     setMinError1(true)
    //     setErrorMessage1('value cannot be greater then max value')
    //     setMinValue1(value)
    //   }
    //   else if (parseInt(value) > parseInt(maxValue1) && parseInt(value) > surahAyats1) {
    //     setMinError1(true)
    //     setErrorMessage1('value cannot be greater then max total ayats')
    //     setMinValue1(value)
    //   }
    //   else if (parseInt(value) < surahAyats1 && parseInt(value) < parseInt(maxValue1)) {
    //     setMinValue1(value)
    //     setMinError1(false)
    //     setErrorMessage1('')
    //   }
    // }
    // else {
    //   if (parseInt(value) > surahAyats1) {
    //     setMinValue1(value)
    //     setMinError1(true)
    //     setErrorMessage1('value cannot be greater then max total ayats')
    //   }
    //   else {
    //     setMinValue1(value)
    //     setMinError1(false)
    //     setErrorMessage1('')
    //   }

    // }

  }

  const validateAyatNumber2 = (value) => {
    setMaxValue2(value)

    // if (parseInt(value) > surahAyats2 && parseInt(value) > parseInt(minValue2)) {
    //   setMinError2(true)
    //   setErrorMessage2('value cannot be greater then total ayats')
    //   setMaxValue2(value)
    // }
    // else if (parseInt(value) < surahAyats2 && parseInt(value) > parseInt(minValue2)) {
    //   setMaxValue2(value)
    //   setMinError2(false)
    //   setErrorMessage2('')
    // }
    // else if (parseInt(value) < surahAyats2 && parseInt(value) < parseInt(minValue2)) {
    //   setMaxValue2(value)
    //   setMinError2(true)
    //   setErrorMessage2('value cannot be less then min value')
    // }


  }

  const validateMinAyat2 = (value) => {
    setMinValue2(value)

    // if (maxValue2) {
    //   if (parseInt(value) > parseInt(maxValue2) && parseInt(value) < surahAyats2) {
    //     setMinError2(true)
    //     setErrorMessage2('value cannot be greater then max value')
    //     setMinValue2(value)
    //   }
    //   else if (parseInt(value) > parseInt(maxValue2) && parseInt(value) > surahAyats2) {
    //     setMinError2(true)
    //     setErrorMessage2('value cannot be greater then max total ayats')
    //     setMinValue2(value)
    //   }
    //   else if (parseInt(value) < surahAyats2 && parseInt(value) < parseInt(maxValue2)) {
    //     setMinValue2(value)
    //     setMinError2(false)
    //     setErrorMessage2('')
    //   }
    // }
    // else {
    //   if (parseInt(value) > surahAyats2) {
    //     setMinValue2(value)
    //     setMinError2(true)
    //     setErrorMessage2('value cannot be greater then max total ayats')
    //   }
    //   else {
    //     setMinValue2(value)
    //     setMinError2(false)
    //     setErrorMessage2('')
    //   }

    // }

  }

  return (

    <ScrollView>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback >
          <View style={{ flex: 1, padding: 16 }}>
            <View
              style={{ flex: 1, justifyContent: 'center', }}>



              {/* category input field */}
              <View style={styles.label}>
                <Text style={styles.labelText}>
                  Category
                </Text>

                <View>
                  <View style={styles.RNPickerContainer}>
                    <RNPickerSelect
                      style={{ inputAndroid: { color: 'black', width: 200, } }}
                      value={category}
                      onValueChange={(value) => categoryFn(value)}
                      items={allCategories}
                    />
                  </View>
                  {categoryError && <Text style={styles.error}>Please select category!</Text>}
                </View>
              </View>


              {/* disease input field */}
              <View style={[styles.label, { marginTop: 25 }]}>
                <Text style={styles.labelText}>
                  Disease
                </Text>
                <View>
                  {/* <View style={styles.RNPickerContainer}>
                    <RNPickerSelect
                      style={{ inputAndroid: { color: 'black', width: 200, } }}
                      value={disease}
                      onValueChange={(value) => {
                        setDiseaseError(false)
                        setDisease(value)
                      }}
                      items={diseases[selectedDisease] || { label: '', value: '' }}
                    /></View> */}

                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    value={disease}
                    onChangeText={(item) => {
                      setDiseaseError(false)
                      setDisease(item)
                    }}
                  />
                  {diseaseError && <Text style={styles.error}>Please select disease!</Text>}
                </View>
              </View>


              {/* description input field */}
              <View style={[styles.label, { marginTop: 25 }]}>
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
              <View style={[styles.label, { marginTop: 25 }]}>
                <Text style={styles.labelText}>
                  Surah
                </Text>
                <View>
                  <SearchComponent
                    data={surah}
                    label={'label'}
                    style={{
                      borderColor: '#7a42f4', width: 200, borderColor: '#7a42f4',

                      borderRadius: 5,
                    }}
                    onItemSelect={(text) => {
                      setSurahError(false)
                      onSurahChange(text, 'surah0')
                    }}
                  />
                  {surahError && <Text style={styles.error}>Please select surah!</Text>}
                </View>
              </View>


              {/* ayats input field */}
              <View>
                <View style={[styles.label]}>
                  <Text
                    style={styles.labelText, { marginTop: 10, fontSize: 17 }}>
                    Ayats
                  </Text>
                  <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                    <View>
                      <TextInput
                        value={minValue}
                        keyboardType="numeric"
                        style={[styles.number, { marginRight: 10 }]}
                        onChangeText={(value) => { validateMinAyat(value) }}
                        placeholder="from"
                        placeholderTextColor="gray"
                      />
                      <Text style={{ color: 'gray', fontSize: 11 }}> MinValue : 1</Text>
                    </View>
                    <View>
                      <TextInput
                        value={maxValue}
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
                <View style={{ marginLeft: 160, marginTop: 10 }}>
                  {/* {minError && <Text style={styles.error}>{errorMessage}</Text>} */}

                </View>
              </View>


              {/* count input field */}
              <View style={[styles.label, { marginTop: 15 }]}>
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


              {
                moreData && countButton >= 1 &&
                <>

                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.dua2} >
                      Add Second Dua
                    </Text>
                  </View>


                  {/* surah 1 input field */}
                  <View style={styles.label2}>
                    <Text
                      style={styles.label2Text, { paddingTop: 5, fontSize: 17 }}>
                      Surah 2
                    </Text>
                    <View>
                      <SearchComponent
                        data={surah}
                        label={'label'}
                        style={{ borderColor: '#7a42f4', width: 200, borderRadius: 5 }}
                        onItemSelect={(text) => {
                          setSurahError1(false)
                          onSurahChange(text, 'surah1')
                        }}
                      />
                      {surahError1 && <Text style={styles.error}>Please select surah!</Text>}
                    </View>
                  </View>

                  {/* ayat 1 input field */}
                  <View>
                    <View style={styles.label}>
                      <Text
                        style={styles.label2Text, { paddingTop: 12, fontSize: 17 }}>
                        Ayats 2
                      </Text>
                      <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View>
                          <TextInput
                            keyboardType="numeric"
                            style={[styles.number, { marginRight: 10 }]}
                            onChangeText={(value) => { validateMinAyat1(value) }}
                            placeholder="from"
                            placeholderTextColor="gray"
                          />
                          <Text style={{ color: 'gray', fontSize: 11 }}> MinValue : 1</Text>
                        </View>
                        <View>
                          <TextInput
                            keyboardType="numeric"
                            style={styles.number}
                            onChangeText={(value) => { validateAyatNumber1(value) }}
                            placeholder="to"
                            placeholderTextColor="gray"

                          />
                          <Text style={{ color: 'gray', fontSize: 11 }}> MaxValue :  {surahAyats1}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ marginLeft: 130 }}>
                      {minError1 && <Text style={styles.error}>{errorMessage1}</Text>}
                    </View>
                  </View>



                  {/* desc 1 input field */}
                  {/* <View style={styles.label2}>
                    <Text
                      style={styles.label2Text}>
                      Description 2
                    </Text>
                    <View>
                      <TextInput
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        value={description1}
                        onChangeText={(item) => {
                          setDescriptionError1(false)
                          setDescription1(item)
                        }}
                      />
                      {descriptionError1 && <Text style={styles.error}>Please enter description!</Text>}
                    </View>
                  </View> */}


                  {/* count 1 input field */}
                  {/* <View style={styles.label2}>
                    <Text
                      style={styles.label2Text}>
                      Count 2
                    </Text>
                    <View>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="   Enter Count Numbers "
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        value={count1}
                        onChangeText={(item) => {
                          setCountError1(false)
                          setCount1(item)
                        }}
                      />
                      {countError1 && <Text style={styles.error}>Please enter count!</Text>}
                    </View>
                  </View> */}
                </>
              }

              {
                moreData && countButton >= 2 &&
                <>

                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.dua2} >
                      Add Third Dua
                    </Text>
                  </View>


                  {/* surah 2 input field */}
                  <View style={styles.label2}>
                    <Text
                      style={styles.label2Text, { paddingTop: 5, fontSize: 17 }}>
                      Surah 3
                    </Text>
                    <View>
                      <SearchComponent
                        data={surah}
                        label={'label'}
                        style={{ borderColor: '#7a42f4', width: 200, borderRadius: 5 }}
                        onItemSelect={(text) => {
                          setSurahError2(false)
                          onSurahChange(text, 'surah2')
                        }}
                      />
                      {surahError2 && <Text style={styles.error}>Please select surah!</Text>}
                    </View>
                  </View>

                  {/* ayat 2 input field */}
                  <View>
                    <View style={styles.label}>
                      <Text
                        style={styles.label2Text, { paddingTop: 12, fontSize: 17 }}>
                        Ayats 3
                      </Text>
                      <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View>
                          <TextInput
                            keyboardType="numeric"
                            style={[styles.number, { marginRight: 10 }]}
                            onChangeText={(value) => { validateMinAyat2(value) }}
                            placeholder="from"
                            placeholderTextColor="gray"
                          />
                          <Text style={{ color: 'gray', fontSize: 11 }}> MinValue : 1</Text>
                        </View>
                        <View>
                          <TextInput
                            keyboardType="numeric"
                            style={styles.number}
                            onChangeText={(value) => { validateAyatNumber2(value) }}
                            placeholder="to"
                            placeholderTextColor="gray"

                          />
                          <Text style={{ color: 'gray', fontSize: 11 }}> MaxValue :  {surahAyats2}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ marginLeft: 130 }}>
                      {minError2 && <Text style={styles.error}>{errorMessage2}</Text>}
                    </View>
                  </View>



                  {/* desc 2 input field */}
                  {/* <View style={styles.label2}>
                    <Text
                      style={styles.label2Text}>
                      Description 3
                    </Text>
                    <View>
                      <TextInput
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        value={description2}
                        onChangeText={(item) => {
                          setDescriptionError2(false)
                          setDescription2(item)
                        }}
                      />
                      {descriptionError2 && <Text style={styles.error}>Please enter description!</Text>}
                    </View>
                  </View> */}


                  {/* count 2 input field */}
                  {/* <View style={styles.label2}>
                    <Text
                      style={styles.label2Text}>
                      Count 3
                    </Text>
                    <View>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="   Enter Count Numbers "
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        value={count2}
                        onChangeText={(item) => {
                          setCountError2(false)
                          setCount2(item)
                        }}
                      />
                      {countError2 && <Text style={styles.error}>Please enter count!</Text>}
                    </View>
                  </View> */}
                </>
              }


              <TouchableOpacity >
                <Text style={styles.moreDua}
                  onPress={() => {
                    setCountButton(countButton + 1)
                    setMoreData(true)
                  }}
                >
                  Add More Dua
                </Text>
              </TouchableOpacity>

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
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  labelText: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginRight: 20,
    paddingTop: 10
  },
  RNPickerContainer: {
    borderWidth: 1,
    height: 45,
    width: 200,
    borderColor: '#7a42f4',
    borderRadius: 5,
    paddingBottom: 10
  },
  number: {
    height: 45,
    padding: 10,
    width: 95,
    borderColor: '#7a42f4',
    borderWidth: 1,
    borderRadius: 5,
  },
  count: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginRight: 20,
    marginTop: 5
  },
  error: { color: 'red', fontSize: 11 },

  dua2: { fontSize: 28, alignItems: 'center', justifyContent: 'center', color: '#7a42f4', paddingTop: 10, textDecorationLine: 'underline' },
  label2: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 15 },

  label2Text: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginRight: 30,
    marginTop: 5
  },
  moreDua: {
    alignSelf: 'flex-end', marginTop: 10, justifyContent: 'center',
    color: '#7a42f4', alignItems: 'center', height: 28, textDecorationLine: 'underline',
    padding: 4,
    width: 100,
    borderColor: '#7a42f4',
    borderWidth: 2,
    borderRadius: 5,
  }

})
