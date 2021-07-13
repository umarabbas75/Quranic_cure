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
    const { dua_id } = route.params
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

                `SELECT * FROM table_dua Where dua_id=${dua_id}`,
                [],
                (tx, results) => {
                    var len = results.rows.length;

                    const obj = results.rows.item(0)
                    console.log('=========obj========', obj)
                    setCount(obj.count)
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
                    setShowNextDua(true)
                    setShowMessage(false)
                    setAudio(array)
                }
            );
        });
    }

    useEffect(fetchDiseasesOnPageLoad, [dua_id])


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
                    console.log('=========obj========', obj)
                    setCount(obj.count)
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


                <View style={{ display: 'flex', paddingHorizontal: 0 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>


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