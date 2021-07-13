var RNFS = require('react-native-fs');
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import addCategory from './pages/AddCategory';
import addDua from './pages/AddDua';
import Cure from './pages/Cure';
import DetailsScreen from './pages/DetailsScreen';
import Toast from 'react-native-toast-message';

import Favorite from './pages/Favorite'
import FavoriteDetail from './pages/FavoritesDetails'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => toggleDrawer()}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{ width: 25, height: 25, marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

function firstScreenStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="addCategory">
      <Stack.Screen
        name="addCategory"
        component={addCategory}
        options={{
          title: 'Add Category', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#7a52f4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

function secondScreenStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="addDua">
      <Stack.Screen
        name="addDua"
        component={addDua}
        options={{
          title: 'Add Dua', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#7a52f4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

function ThirdScreenStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="addCategory">
      <Stack.Screen
        name="Cure"
        component={Cure}
        options={{
          title: 'Cure', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#7a52f4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Details', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#7a52f4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />

    </Stack.Navigator>
  );
}
function FavoriteScreenStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="favorites">
      <Stack.Screen
        name="favorites"
        component={Favorite}
        options={{
          title: 'Favorite', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#7a52f4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="favoritesDetail"
        component={FavoriteDetail}
        options={{
          title: 'Favorite Details', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#7a52f4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
     

    </Stack.Navigator>
  );
}



function App() {




  return (
    <>
      <NavigationContainer>
        
        <Drawer.Navigator
          drawerContentOptions={{
            activeTintColor: '#7a52f4',
            fontWeight: 'bold',
           
            
            itemStyle: { marginVertical: 5 ,fontWeight: 'bold', },
          }}>
          <Drawer.Screen
            name="addCategory"
            options={{fontWeight: 'bold', drawerLabel: 'Add Category' ,}}
            component={firstScreenStack}
          />
          <Drawer.Screen
            name="addDua"
            options={{ drawerLabel: 'Add Dua' }}
            component={secondScreenStack}
          />
          <Drawer.Screen
            name="Cure"
            options={{ drawerLabel: 'Cure' }}
            component={ThirdScreenStack}
          />
          <Drawer.Screen
            name="Favorites"
            options={{ drawerLabel: 'Favorites' }}
            component={FavoriteScreenStack}
          />

        </Drawer.Navigator>
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

export default App;







