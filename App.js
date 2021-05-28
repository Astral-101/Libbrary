import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SearchScreen from './screens/SearchScreen';
import TransactionScreen from './screens/TransactionScreen';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation'; 
import { render } from 'react-dom';
import { Ionicons } from '@expo/vector-icons';



export default class App extends React.Component {
  render(){
    return (
      <AppContainer/>                    
      
  
    );
  }

  }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

var TabNavigator = createBottomTabNavigator({
  SearchScreen: { screen: SearchScreen }, 
  TransactionScreen: { screen: TransactionScreen }
},

{
  defaultNavigationOptions: ({navigation}) =>({
    tabBarIcon: ()=>{
      var routeName = navigation.state.routeName;
      console.log(routeName);
      if (routeName === "TransactionScreen"){
        return(
          <View style = {{minWidth: 40}}>
            <Ionicons
          name = "book-outline"
          size = {30}
          color = "blue"

           /> 
          </View>
          
          );
       


      }

      else if (routeName === "SearchScreen"){
        return(
          <Ionicons
          name = "search-circle-outline"
          size = {30}
          color = "blue"
          

           />

        );
       

      }
    }
  })

}




);

const AppContainer = createAppContainer(TabNavigator);
