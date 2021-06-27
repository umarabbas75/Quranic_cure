// Play Music / Sound in React Native App for Android and iOS
// https://aboutreact.com/react-native-play-music-sound/

// import React in our code
import React, { useEffect,useState } from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

// import Sound Component
import Sound from 'react-native-sound';
import surahData from '../data/surah1'
const App = ({ audioList }) => {

 // console.log('===========audioList=======',audioList)

  const [audioIndex, selectedIndex] = useState('')

  const [audioSound, selectedSound] = useState('')

  let sound = []
  for (var i = 0; i < audioList.length; ++i) {
    sound[i] = '';
  }

  useEffect(() => {
    Sound.setCategory('Playback', true); // true = mixWithOthers
    // return () => {

    //   if (sound1) sound1.release();
    //   if (sound2) sound2.release();
    //   if (sound3) sound3.release();
    //   if (sound4) sound4.release();
    //   if (sound5) sound5.release();
    //   if (sound6) sound6.release();
    // };
  }, []);


  const playSound = (item, index,array) => {

   

    sound[index] = new Sound(item.label, '', (error, _sound) => {
      if (error) {
        alert('error' + error.message);
        return;
      }

      sound[index].play(() => {
  
        selectedIndex(index+1)
        selectedSound(sound)
        if(array.length -1 > index){
          playSound(array[index+1],index+1,array)
        }
       
        sound[index].release();
      });
    });
  };

  const stopSound = (_item, index) => {


    let result = true
    sound.forEach(item=>{

      if(item !== ''){
        result = false
      }
    })

 
    if(!result){

      sound[index].stop(() => {
        console.log('umar');
      });
    }
    else{

      audioSound[audioIndex].stop(() => {
        console.log('umar');
      });
    }
   
  };

  const renderSurah = (surah) => {

    const result = surahData.find(x => x.id == surah);
    return result.name
  }


  const ItemView = (item, index,array) => {
    if(index == 0){
      return (
        <View style={styles.feature} key={index}>
          <Text style={styles.textStyle}> {renderSurah(item.surah)}</Text>
          <TouchableOpacity onPress={() => playSound(item, index,array)}>
            <Text style={styles.buttonPlay}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => stopSound(item, index)}>
            <Text style={styles.buttonStop}>Stop</Text>
          </TouchableOpacity>
          
        </View>
       
       
      );
    }
   
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <Text style={styles.titleText}>
          Play Music / Sound in React Native App for Android and iOS
        </Text> */}
        <ScrollView style={{ flex: 1 }}>
          {audioList.map(ItemView)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    flex: 1,
    padding: 5,
  },
  buttonPlay: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(00,80,00,1)',
    borderWidth: 1,
    borderColor: 'rgba(80,80,80,0.5)',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  buttonStop: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(80,00,00,1)',
    borderWidth: 1,
    borderColor: 'rgba(80,80,80,0.5)',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  feature: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 7,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgb(180,180,180)',
  },
});