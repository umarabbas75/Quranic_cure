import React, { useEffect, useState } from 'react'
import {
  View, Text, SafeAreaView, StyleSheet, TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Sound from 'react-native-sound';
import { useFocusEffect } from '@react-navigation/native';
import AudioPage from './AudioPage'
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';


var db = openDatabase({ name: 'QURANICCUREAPP123.db' });
let sound = ''

const DetailsScreen = ({ navigation, route }) => {


  const [selectedDiseases, setSelectedDiseases] = useState('')
  const [myDiseases, setMyDiseases] = useState([])
  const [pageData, setPageData] = useState('')
  const [count, setCount] = useState(0)
  const [audioCount, setAudiCount] = useState(0)
  const [showMessage, setShowMessage] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const { cat_id, cat_name } = route.params
  const [audio, setAudio] = useState([])
  const [showNextDua, setShowNextDua] = useState(false)
  const [ids, setIds] = useState([])
  const [allFavorites, setAllFavorites] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)


  console.log('==========allFavorites======',allFavorites)
  // [{ index: 1, label: 'http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/001001.mp3' }, { id: 2, label: 'http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/001002.mp3' }, { id: 3, label: 'http://www.everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/001003.mp3' }]
  const playAgain = () => {
    if (audioCount !== 0) {
      onPlay()
    }

  }

  useEffect(playAgain, [audioCount])

  const fetchDiseasesOnPageLoad = () => {


    //  fetch data to populate disease dropdown
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


          // rows.forEach(item => {
          //   item.label = item.disease
          //   item.value = item.dua_id
          // })

          // setMyDiseases(rows)

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


      //  fetch all favorites data to make heart red
    db.transaction((tx) => {
      tx.executeSql(

        'SELECT * FROM table_favorite',
        [],
        (tx, results) => {
          var len = results.rows.length;

          var rows = []
          for (var i = 0; i < len; i++) {
            var row = results.rows.item(i);
            rows.push(row)

          }
          
          setAllFavorites(rows)
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
    setIsFavorite(false)
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
         
          setCount(obj.count)
          setPageData(obj)

          let duaId = obj && obj.dua_id

         
      
          allFavorites && allFavorites.map(item=>{

            if(item.dua_id === duaId){
              console.log('========= they are equal ======',duaId,item.dua_id)
              setIsFavorite(true)
            }
          })

          let arrayLength = obj.maxValue - obj.minValue
          let array = []
          let index = 1
          for (let i = parseInt(obj.minValue); i < parseInt(obj.maxValue) + 1; i++) {

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

  const diseaseList = () => {

    if (selectedDiseases && selectedDiseases.length > 0) {
      return selectedDiseases && selectedDiseases.map((item) => {

        return (
          <View key={item.dua_id} style={{ margin: 5 }}>

            <TouchableOpacity
              style={styles.disease}

            >
              <Text onPress={() => {

                fetchDataFromDb(item.dua_id)
              }}>{item.disease}</Text>
            </TouchableOpacity>
          </View>
        );
      });
    }
    else {
      return <View><Text>no data found!</Text></View>
    }

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
        return ''
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

  const rendeDesc = () => {
    if (pageData) {
      return <Text>{pageData.description}</Text>
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

  const addThisDuaInFavorites = () => {
    let shouldAdd = true
    allFavorites && allFavorites.map(item=>{
      if(item.dua_id === pageData.dua_id){
        shouldAdd = false
      }
    })

    if(shouldAdd){
      if (pageData && pageData.dua_id) {
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO table_favorite(dua_id,category_name,disease_name) VALUES (?,?,?)',
            [pageData.dua_id,cat_name,pageData.disease],
            (tx, results) => {
              console.log('Results', results);
              if (results.rowsAffected > 0) {
  
                Toast.show({
                  text1: 'Success',
                  text2: 'Favorite has been addedd successfully! 👋'
                });
              } else alert('Favorites could not be added in db. try again!');
            }
          );
        });
      }
    }
    else{
      Toast.show({
        type : 'error',
        text1: 'Error',
        text2: 'This id has already been added to favorites! 👋'
      });
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
          <View style={{ borderWidth: 1, height: 50, borderColor: '#7a42f4', width: 250, borderRadius: 5, marginBottom: 10, }}>
            <RNPickerSelect
              style={{ inputAndroid: { color: 'black', width: 250, } }}
              placeholder={{
                label: "Select The Disease"
              }}
              onValueChange={(value) => fetchDataFromDb(value)}
              items={myDiseases}
            />

          </View>

          <TouchableOpacity 
          style={[styles.favBtn, {backgroundColor : isFavorite ? 'red' : 'white'}]}  
          onPress={() => { addThisDuaInFavorites() }}>
            {/* {renderFavoriteImage()} */}
            <Text style={{color : isFavorite ? 'blue' : 'black'}} >Add to favorites</Text>
          </TouchableOpacity>
        </View>

        <View style={{ display: 'flex', paddingHorizontal: 0 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
            {/* {diseaseList()} */}
            {/* {selectedDiseases && selectedDiseases.map(item => {
            return <TouchableOpacity
              style={styles.disease}
              onPress={()=>{fetchDataFromDb(item.dua_id)}}
            >
              <Text>{item.disease}</Text>
            </TouchableOpacity>
          })} */}

          </View>
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


          </ScrollView>

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

          <View style={{ paddingHorizontal: 10, marginTop: 1 }} >
            <Text style={{ fontSize: 22, }}>Description</Text>
            <View style={{ fontSize: 18, marginTop: 5, alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'center', }}>{rendeDesc()}</View>
          </View>

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

          <AudioPage audioList={audio} />
          {/* <View >
            <TouchableOpacity
              style={
                {
                  backgroundColor: '#7a52f4',
                  padding: 10,
                  margin: 15,
                  marginTop: 1,
                  height: 40,
                  width: 100, borderRadius: 10
                }
              }
              onPress={() => { onPlay() }}
            >
              <Text style={styles.submitButtonText}> Play </Text>
            </TouchableOpacity>
            </View> */}
        </View>


      </ScrollView>
    </SafeAreaView>

  )
}

export default DetailsScreen

const styles = StyleSheet.create({
  favBtn : {
      padding : 10,
      borderRadius : 10,
      height : 40,
      borderWidth : 1,
      borderColor : 'red',

  },
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