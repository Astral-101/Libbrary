import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { render } from 'react-dom';
import { color } from 'react-native-reanimated';
import *as Permissions from 'expo-permissions' 
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
import db from "../config";

export default class TransactionScreen extends React.Component {
  constructor(){
    super();
    this.state ={
      hasCameraPermissions: null,
      scanned: false,
      scannedData: "",
      scannedBookID: "",
      scannedStudentID: "",
      buttonState: 'normal',
      transactionMessage: ""

    }
  }

  getCameraPermissions =async(ID)=>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === 'granted',
      buttonState: ID,
      scanned: false


    })
    
  }

  handleBarCodeScan =async({type, data} )=>{
    const {buttonState} = this.state
    if (buttonState === "BookID"){
      this.setState({
        scanned: true,
        scannedBookID: data,
        buttonState: "normal"
  
      })  
    }

    else if (buttonState === "StudentID"){
      this.setState({
        scanned: true,
        scannedStudentID: data,
        buttonState: "normal"
  
      })  

    }
    
  }

  


  initiateBookIssue =async()=>{
    //Adding a new field in the transaction DB 
    db.collection("transaction").add({
      'studentID': this.scannedStudentID,
      'bookID': this.scannedBookID,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "issue"
    })

    //Change book availabilty status
    db.collection("books").doc(this.state.scannedBookID).update({
      'bookAvailability': false

    })

    console.log("Book Availability Status is False");

    db.collection("students").doc(this.state.scannedStudentID).update({
      'noIssued': firebase.firestore.FieldValue.increment(1)
      
    })

    Alert.alert("Book is Issued");
    this.setState({
      scannedBookID: "",
      scannedStudentID: ""
    })

  }

  initiateBookReturn =async()=>{
    db.collection("transaction").add({
      'studentID': this.scannedStudentID,
      'bookID': this.scannedBookID,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "return"
    })

    db.collection("books").doc(this.state.scannedBookID).update({
      'bookAvailability': true


    })

    db.collection("students").doc(this.state.scannedStudentID).update({
      'noIssued': firebase.firestore.FieldValue.increment(-1)
      
    })

    Alert.alert("Book is Returned");
    this.setState({
      scannedBookID: "",
      scannedStudentID: ""
    })

    
  }

  handleTransaction = async()=> {
    // Alert.alert("Calling Transaction")
    var transactionMessage = null
    db.collection("books").doc(this.state.scannedBookID).get().then(
      (doc)=>{
        console.log(doc.data())
        var bookData = doc.data();

        if(bookData.bookAvailability){
          this.initiateBookIssue();
          transactionMessage = "Book is Issued";
          // Alert.alert(transactionMessage);

        }

        else {
          this.initiateBookReturn();
          transactionMessage = "Book is Returned";
          // Alert.alert(transactionMessage);
        }

        this.setState({
          transactionMessage: transactionMessage
        })

      }
    )

  }

  render(){
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;
    if (buttonState !== 'normal' && hasCameraPermissions){
      return(
        <BarCodeScanner
        onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScan} 
        style = {StyleSheet.absoluteFillObject}
         /> 
        
      );



    }

    else if (buttonState === 'normal') {
      return (
        <View style = {styles.container}>
          <View style = {styles.logoContainer}>
            <Ionicons
            name = "book-outline"
            size = {50}
            color = "blue"

             />


          </View>
          <View style = {styles.container}>
            <TextInput placeholder = "Student ID" value = {this.state.scannedStudentID} style = {styles.inputField} />

            <TouchableOpacity style = {styles.buttonBackground} onPress = {
              ()=>{
                this.getCameraPermissions("StudentID")

              }
            }>
              <Text style = {{color: "white", textAlign: "center"}}>
                Scan
              </Text>
            </TouchableOpacity>
    

          </View>

          <View style = {styles.container}>
          <TextInput placeholder = "Book ID" value = {this.state.scannedBookID} style = {styles.inputField} />

          <TouchableOpacity style = {styles.buttonBackground} onPress = {
              ()=>{
                this.getCameraPermissions("BookID")

              }
            }>
            <Text style = {{color: "white", textAlign: "center"}}>
              Scan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style = {styles.submitButtonBackground}
          onPress ={async()=>{
            var transactionMessage = await this.handleTransaction();
           
          }}>
            <Text style = {{color: "white", textAlign: "center"}}>
              Submit
            </Text>
            
          </TouchableOpacity>


          </View>
            {/* <Text style = {styles.textSize}>
               {hasCameraPermissions === true ? this.state.scannedData : "Request Camera Permissions"}
            </Text>

            <TouchableOpacity 
            style = {styles.buttonBackground} 
            onPress = {this.getCameraPermissions}
            >
            <Text style = {{color: "white", textAlign: "center"}}>
              Scan QR Code
              </Text>  

            </TouchableOpacity> */}
        </View>
    );


                  
    }
  } 

  }

  const styles = StyleSheet.create({
    container : {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center' 

    },

    buttonBackground : {
      backgroundColor: "black",
      width: 250,
      textAlign: 'center',
      alignItems:'center',
      justifyContent: 'center',
      marginTop: 20,
      padding: 15,
      height: 55,
      borderRadius: 6,
      marginBottom: 20
    },

    textSize : {
      fontSize: 20,
      textDecorationLine: 'underline'

    },

    inputField : {
      borderWidth: 2,
      borderColor: "black",
      width: 200,
      height: 55,
      padding: 15,
      marginBottom: 20,
      textAlign: 'center',
      alignItems:'center',
      justifyContent: 'center',
    },

    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 100 
      
    },

    submitButtonBackground : {
      backgroundColor: "blue",
      width: 200,
      textAlign: 'center',
      alignItems:'center',
      justifyContent: 'center',
      marginTop: 20,
      padding: 15,
      height: 55,
      borderRadius: 6,
      marginBottom: 20
    }

  })