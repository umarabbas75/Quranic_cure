import React, { useEffect, useState } from 'react'
import {
  View, Text, SafeAreaView, StyleSheet, TouchableOpacity,
  ScrollView,

} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Sound from 'react-native-sound';
import { useFocusEffect } from '@react-navigation/native';
import AudioPage from './AudioPage'
import RNPickerSelect from 'react-native-picker-select';

var db = openDatabase({ name: 'QURANICCUREAPP1.db' });
let sound = ''

const DetailsScreen = ({ navigation, route }) => {


  const [selectedDiseases, setSelectedDiseases] = useState('')
  const [myDiseases, setMyDiseases] = useState([])
  const [pageData, setPageData] = useState('')
  const [count, setCount] = useState(0)
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [audioCount, setAudiCount] = useState(0)
  const [showMessage, setShowMessage] = useState(false)
  const [showMessage1, setShowMessage1] = useState(false)
  const [showMessage2, setShowMessage2] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const { cat_id } = route.params
  const [audio, setAudio] = useState([])
  const [showNextDua, setShowNextDua] = useState(false)
  const [ids, setIds] = useState([])

  

  // [{ index: 1, label: 'http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/001001.mp3' }, { id: 2, label: 'http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/001002.mp3' }, { id: 3, label: 'http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/001003.mp3' }]
  const playAgain = () => {
    if (audioCount !== 0) {
      onPlay()
    }

  }

  useEffect(playAgain, [audioCount])

  const fetchDiseasesOnPageLoad = () => {

    db.transaction((tx) => {
      tx.executeSql(

        `SELECT disease,dua_id FROM table_dua Where category_id=${cat_id}`,
        [],
        (tx, results) => {
          var len = results.rows.length;

          var rows = []
          var newRow = []
          for (var i = 0; i < len; i++) {
            var row = results.rows.item(i);
            rows.push(row)
            newRow.push(row)
          }
          setSelectedDiseases(rows)

          let onlyDisease = rows.map(item => item.disease);

          let repeatedElement = []
          let nonRepeated = []
          let nonReapeatedIndex = []
          onlyDisease.forEach((item, index) => {
            if (onlyDisease.indexOf(item) != index) {
              repeatedElement.push(item)

            }
            else {
              nonRepeated.push(item)
              nonReapeatedIndex.push(index)
            }
          })



          let newArray = []

          rows.forEach((item, index) => {
            nonReapeatedIndex.forEach(Item => {
              if (index === Item) {
                newArray.push(item)
              }
            })
          })



          newArray.forEach(item => {
            item.label = item.disease
            item.value = item.dua_id
          })

          newRow.forEach((item) => {
            item.label = item.disease
            item.value = item.dua_id

          })



          let superFinal = []

          newArray.forEach(item => {
            rows.forEach(Item => {
              if (item.disease === Item.disease) {


                superFinal.push(item.disease)
              }
            })
          })



          let grandSuperFinal = []

          newArray.forEach(item => {
            let count = 0;
            superFinal.forEach(Item => {

              if (item.disease === Item) {

                count = count + 1

              }
            })
            item.count = count
            grandSuperFinal.push(item)

          })



          grandSuperFinal.forEach(item => {
            item.label = item.label + "(" + item.count + ")"
          })
          let final = []
          grandSuperFinal.forEach(item => {
            let ids = []
            rows.forEach(Item => {
              if (item.disease === Item.disease) {
                ids.push(Item.value)
              }
            })
            item.ids = ids
            final.push(item)
          })


          setMyDiseases(grandSuperFinal)


        }
      );
    });
  }

  useEffect(fetchDiseasesOnPageLoad, [cat_id])


  const addLeadingZero = (num, size) => {
    let s = num + ""
    while (s.length < size) {
      s = '0' + s
    }
    return s
  }

  const fetchDataFromDb = (id) => {

    myDiseases && myDiseases.length > 0 && myDiseases.forEach(item => {
      if (item.value == id) {
        setIds(item.ids)
      }
    })

    db.transaction((tx) => {
      tx.executeSql(

        `SELECT * FROM table_dua Where dua_id=${id}`,
        [],
        (tx, results) => {
          var len = results.rows.length;

          const obj = results.rows.item(0)

          setCount(results.rows.item(0).count)
          setCount1(results.rows.item(0).count1)
          setCount2(results.rows.item(0).count2)
          setPageData(obj)

          let arrayLength = obj.maxValue - obj.minValue
          let array = []
          let index = 1
          for (let i = parseInt(obj.minValue); i < parseInt(obj.maxValue) + 1; i++) {

            let surah = addLeadingZero(parseInt(obj.surah), 3)
            let ayat = addLeadingZero(i, 3)


            array.push({ label: `http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/${(surah)}${ayat}.mp3`, index: index, surah: parseInt(obj.surah), min: obj.minValue, max: obj.maxValue })
            index++
          }
          for (let i = parseInt(obj.minValue1); i < parseInt(obj.maxValue1) + 1; i++) {

            let surah = addLeadingZero(parseInt(obj.surah), 3)
            let ayat = addLeadingZero(i, 3)


            array.push({ label: `http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/${(surah)}${ayat}.mp3`, index: index, surah: parseInt(obj.surah), min: obj.minValue, max: obj.maxValue })
            index++
          }
          for (let i = parseInt(obj.minValue2); i < parseInt(obj.maxValue2) + 1; i++) {

            let surah = addLeadingZero(parseInt(obj.surah), 3)
            let ayat = addLeadingZero(i, 3)


            array.push({ label: `http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/${(surah)}${ayat}.mp3`, index: index, surah: parseInt(obj.surah), min: obj.minValue, max: obj.maxValue })
            index++
          }



          setShowNextDua(true)
          setShowMessage(false)
          setAudio(array)



        }
      );
    });
  }


  const renderArabicAyats = () => {

    if (pageData) {
      const arabicAyats = JSON.parse(pageData && pageData.ayatsArabic)
      if (arabicAyats && arabicAyats.length > 0) {
        return arabicAyats && arabicAyats.map(item => {
          return <Text>
            <Text > {item.content}</Text>
            <Text style={{ color: 'green' }} > {item.verse_number}</Text>
          </Text>
        })
      }
      else {
        return <Text > Please select disease from abovesd</Text>
      }
    }
  }

  const renderArabicAyats1 = () => {

    if (pageData && pageData.ayatsArabic1) {
      const arabicAyats = JSON.parse(pageData && pageData.ayatsArabic1)
      if (arabicAyats && arabicAyats.length > 0) {
        return arabicAyats && arabicAyats.map(item => {
          return <Text>
            <Text > {item.content}</Text>
            <Text style={{ color: 'green' }} > {item.verse_number}</Text>
          </Text>
        })
      }
      else {
        return <Text > </Text>
      }
    }
  }
  const renderArabicAyats2 = () => {

    if (pageData && pageData.ayatsArabic2) {
      const arabicAyats = JSON.parse(pageData && pageData.ayatsArabic2)
      if (arabicAyats && arabicAyats.length > 0) {
        return arabicAyats && arabicAyats.map(item => {
          return <Text>
            <Text > {item.content}</Text>
            <Text style={{ color: 'green' }} > {item.verse_number}</Text>
          </Text>
        })
      }
      else {
        return <Text ></Text>
      }
    }
  }

  const renderEnglishAyats = () => {

    if (pageData) {
      const englishAyats = JSON.parse(pageData && pageData.ayatsEnglish)
      if (englishAyats && englishAyats.length > 0) {
        return englishAyats && englishAyats.map(item => {
          return <Text>
            <Text > {item.content}</Text>
            <Text style={{ color: 'green' }} > {item.verse_number}</Text>
          </Text>
        })

      }
      else {
        return <Text></Text>
      }
    }
    else {
      return <Text></Text>
    }


  }
  const renderEnglishAyats1 = () => {

    if (pageData && pageData.ayatsEnglish1) {
      const englishAyats = JSON.parse(pageData && pageData.ayatsEnglish1)
      if (englishAyats && englishAyats.length > 0) {
        return englishAyats && englishAyats.map(item => {
          return <Text>
            <Text > {item.content}</Text>
            <Text style={{ color: 'green' }} > {item.verse_number}</Text>
          </Text>
        })

      }
      else {
        return <Text></Text>
      }
    }
    else {
      return <Text></Text>
    }


  }
  const renderEnglishAyats2 = () => {

    if (pageData && pageData.ayatsEnglish2) {
      const englishAyats = JSON.parse(pageData && pageData.ayatsEnglish2)
      if (englishAyats && englishAyats.length > 0) {
        return englishAyats && englishAyats.map(item => {
          return <Text>
            <Text > {item.content}</Text>
            <Text style={{ color: 'green' }} > {item.verse_number}</Text>
          </Text>
        })

      }
      else {
        return <Text></Text>
      }
    }
    else {
      return <Text></Text>
    }


  }

  const rendeUrduAyats = () => {

    if (pageData) {
      const urduAyats = JSON.parse(pageData && pageData.ayatsUrdu)
      if (urduAyats && urduAyats.length > 0) {
        return urduAyats && urduAyats.map(item => {
          return <Text>
            <Text > {item.text}</Text>
            <Text style={{ color: 'green' }} > {item.aya}</Text>
          </Text>


        })

      }
      else {
        return ''
      }
    }
    else {
      return <Text></Text>
    }


  }
  const rendeUrduAyats1 = () => {

    if (pageData && pageData.ayatsUrdu1) {
      const urduAyats = JSON.parse(pageData && pageData.ayatsUrdu1)
      if (urduAyats && urduAyats.length > 0) {
        return urduAyats && urduAyats.map(item => {
          return <Text>
            <Text > {item.text}</Text>
            <Text style={{ color: 'green' }} > {item.aya}</Text>
          </Text>


        })

      }
      else {
        return <Text></Text>
      }
    }
    else {
      return <Text></Text>
    }


  }
  const rendeUrduAyats2 = () => {

    if (pageData && pageData.ayatsUrdu2) {
      const urduAyats = JSON.parse(pageData && pageData.ayatsUrdu2)
      if (urduAyats && urduAyats.length > 0) {
        return urduAyats && urduAyats.map(item => {
          return <Text>
            <Text > {item.text}</Text>
            <Text style={{ color: 'green' }} > {item.aya}</Text>
          </Text>


        })

      }
      else {
        return <Text></Text>
      }
    }
    else {
      return <Text></Text>
    }


  }

  const rendeDesc = () => {
    if (pageData) {
      return <Text>{pageData.description}</Text>
    }
    else {
      return <Text></Text>
    }
  }
  const rendeDesc1 = () => {
    if (pageData && pageData.description1) {
      return <Text>{pageData.description1}</Text>
    }
    else {
      return <Text></Text>
    }
  }
  const rendeDesc2 = () => {
    if (pageData && pageData.description2) {
      return <Text>{pageData.description2}</Text>
    }
    else {
      return <Text></Text>
    }
  }


  const decrementCounter = () => {
    if (count < 1) {
      setShowMessage(true)
    }
    else {
      setCount(count - 1)
      setShowMessage(false)
    }

  }
  const decrementCounter1 = () => {
    if (count1 < 1) {
      setShowMessage1(true)
    }
    else {
      setCount1(count1 - 1)
      setShowMessage1(false)
    }

  }
  const decrementCounter2 = () => {
    if (count2 < 1) {
      setShowMessage2(true)
    }
    else {
      setCount2(count2 - 1)
      setShowMessage2(false)
    }

  }



  const startPlaying = () => {

    sound.play((completed) => {
      if (completed) {

        setAudiCount(audioCount + 1)
      }
      else {
        console.log('=========playback failed due to audio decoding errors')
      }
    });
    setIsPlaying(true);
    console.warn("Now playing");
  }

  const stopPlaying = () => {
    sound.pause();
    setIsPlaying(false);
    console.warn("Now paused");
  }



  const onPlay = (item) => {

    Sound.setCategory('Playback');
    if (!isPlaying) {
      sound = new Sound(`${audio[audioCount].label}`, Sound.MAIN_BUNDLE, startPlaying);
      sound.setVolume(1);
    } else {
      stopPlaying();
    }
  }



  return (

    <SafeAreaView style={{ flex: 1, marginTop: 10, paddingHorizontal: 10 }}>
      <ScrollView >
        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => { navigation.goBack() }}>
            <Text style={{
              borderColor: '#7a42f4',
              borderWidth: 1,
              borderRadius: 5,
            }}> Go Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{ borderWidth: 1, height: 50, borderColor: '#7a42f4', width: 250, borderRadius: 5, marginBottom: 10 }}>
          <RNPickerSelect
            style={{ inputAndroid: { color: 'black', width: 250, } }}

            placeholder={{
              label: "Select The Disease"
            }}

            onValueChange={(value) => fetchDataFromDb(value)}
            items={myDiseases}
          />
        </View>


        <View style={{ display: 'flex', paddingHorizontal: 0 }}>

          {/* show first dua in arabic urdu and english */}
          <ScrollView nestedScrollEnabled={true} style={{ height: 350, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 15, borderColor: '#7a42f4', }}>
            <View style={{ paddingHorizontal: 10, }} >

              {pageData ? <View style={{ alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', backgroundColor: '#ddd' }}>{renderArabicAyats()}
              </View> :
                <View style={{ height: 300, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

                  <Text style={{ alignItems: 'center' }}>Please Select Disease From Above</Text>
                </View>
              }
            </View>


            <View style={{ paddingHorizontal: 10, marginTop: 20, backgroundColor: '#ddd' }} >
              <View style={{ alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', }}>{rendeUrduAyats()}</View>
            </View>


            <View style={{ paddingHorizontal: 10, marginTop: 20 }} >
              <View style={{ alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#ddd' }}>{renderEnglishAyats()}</View>
            </View>


            {/* show second dua in arabic urdu and english */}
            {(pageData && pageData.ayatsArabic1.length > 0) ? <View><Text>DUA 2</Text></View> : <View><Text></Text></View>}
            <View style={{ alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', backgroundColor: '#ddd', marginTop: 20 }}>{renderArabicAyats1()}
            </View>


            <View style={{ alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', backgroundColor: '#ddd', marginTop: 20 }}>{rendeUrduAyats1()}
            </View>


            <View style={{ alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', backgroundColor: '#ddd', marginTop: 20 }}>{renderEnglishAyats1()}
            </View>


            {/* show third dua in arabic urdu and english */}
            {(pageData && pageData.ayatsArabic2.length > 0) ? <View><Text>DUA 3</Text></View> : <View><Text></Text></View>}
            <View style={{ alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', backgroundColor: '#ddd', marginTop: 20 }}>{renderArabicAyats2()}
            </View>


            <View style={{ alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', backgroundColor: '#ddd', marginTop: 20 }}>{rendeUrduAyats2()}
            </View>


            <View style={{ alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', backgroundColor: '#ddd', marginTop: 20 }}>{renderEnglishAyats2()}
            </View>


          </ScrollView>

          {/* next dua functionality */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {(ids && showNextDua) && ids.map((item, index) => {

              if (pageData.dua_id === item) {
                return <Text style={{ color: 'blue', borderRadius: 4, backgroundColor: '#bbb', marginRight: 15, fontSize: 20 }}
                  onPress={() => { fetchDataFromDb(item) }}
                >Dua: {index + 1}</Text>
              }
              else {
                return <Text style={{ color: 'blue', borderRadius: 4, marginRight: 15, fontSize: 20 }}
                  onPress={() => { fetchDataFromDb(item) }}
                >Dua: {index + 1}</Text>
              }

            })}
          </View>


          {/* render desc functionality */}
          <View style={{ paddingHorizontal: 10, marginTop: 1 }} >
            <Text style={{ fontSize: 22, }}>Description</Text>
            <View style={{ fontSize: 18, marginTop: 5, alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'center', }}>{rendeDesc()}</View>
          </View>

          {/* render desc1 functionality */}
          <View style={{ paddingHorizontal: 10, marginTop: 1 }} >

            {(pageData && pageData.description1) ? <View><Text style={{ fontSize: 22, }}>Description1</Text></View> : <View><Text></Text></View>}

            <View style={{ fontSize: 18, marginTop: 5, alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'center', }}>{rendeDesc1()}</View>
          </View>

          {/* render desc2 functionality */}
          <View style={{ paddingHorizontal: 10, marginTop: 1 }} >

            {(pageData && pageData.description2) ? <View><Text style={{ fontSize: 22, }}>Description2</Text></View> : <View><Text></Text></View>}

            <View style={{ fontSize: 18, marginTop: 5, alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'center', }}>{rendeDesc2()}</View>
          </View>


          {/* count functionality */}
          <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }} >

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => { decrementCounter() }}
            >
              <Text style={styles.submitButtonText}> Count </Text>
            </TouchableOpacity>
            <Text>{count}</Text>

          </View>

          <View>
            <Text style={{ color: 'red', fontSize: 12 }}>{showMessage && 'Your count has completed!'}</Text>
          </View>


           {/* count1 functionality */}
         {pageData && parseFloat(pageData.count1)  ? 
         <>
         <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }} >

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => { decrementCounter1() }}
            >
              <Text style={styles.submitButtonText}> Count1 </Text>
            </TouchableOpacity>
            <Text>{count1}</Text>

          </View> 

          <View>
            <Text style={{ color: 'red', fontSize: 12 }}>{showMessage1 && 'Your count has completed!'}</Text>
          </View>
          </>
          : <View><Text></Text></View>}


           {/* count2 functionality */}
         {pageData &&  parseFloat(pageData.count2)  ? 
         <>
         <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }} >

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => { decrementCounter2() }}
            >
              <Text style={styles.submitButtonText}> Count2 </Text>
            </TouchableOpacity>
            <Text>{count2}</Text>

          </View> 

          <View>
            <Text style={{ color: 'red', fontSize: 12 }}>{showMessage2 && 'Your count has completed!'}</Text>
          </View>
          </>
          : <View><Text></Text></View>}

          <AudioPage audioList={audio} />
        </View>
      </ScrollView>
    </SafeAreaView>

  )
}

export default DetailsScreen

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
    margin: 15,
    height: 40,
    width: 100, borderRadius: 10
  },
  submitButtonText: {
    color: 'white',

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
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  disease: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ddd',


  }
})