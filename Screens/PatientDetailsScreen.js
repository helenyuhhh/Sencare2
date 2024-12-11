// from now I want thisbutton only shows the basic details as an internatiate page
// it will show patient's everything instead of clinical data cause it is stored in tests
import { Text ,View, StyleSheet, Button,Image, TouchableOpacity, Alert} from "react-native";
import React, { useState, useEffect, use } from "react";

// future plan: add a button to the record data screen ti update the latest data?
import axios from "axios";

const PatientDetailsScreen = ({route, navigation}) => {
    
    const patient = route.params.toPatientDetail
    const patientID = patient._id // patient id
    const gotoTest = () => {
        navigation.navigate('PatientTests')
    }
    const confirmDelete = () =>{
        Alert.alert('Alert', 'Are you sure to delete?',[
            {
                text:'Cancle',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },
            {
                text:'Yes',
                onPress: deletePatient
    
            }
        ])
    }
    const deletePatient = async ()=>{
        try{
            //await axios.delete(`https://mapd713patientapi-g3dpdtdthvcbhwbh.canadacentral-01.azurewebsites.net/api/patients/${patientID}`)

            await axios.delete(`http://172.16.7.126:3000/api/patients/${patientID}`)
            Alert.alert('Alert', 'Patient deleted!',[
                {
                    text: 'OK',
                    onPress: ()=>console.log('OK pressed')
                }
            ])
            navigation.goBack()

            
        }catch(error){
            console.error('Error deleting patient:', error)
        }

    }
    const reFetchPatient = async ()=>{
        fetch(`http://172.16.7.126:3000/api/patients/${patientID}`)
    }
    useEffect(() => { 
        reFetchPatient()
    })
    return (
        <View style = {styles.viewStyle}>
            <Image style={styles.imageStyle} source={{
                    uri: patient.picture
                }}></Image>
            <Text style={styles.textStyle}> {"Patient Name: "+ patient.name.first +" "} {patient.name.last} </Text>
            <Text style={styles.textStyle}> { "Room Number: " + patient.room} </Text>
            <Text style={styles.textStyle}> { "Age: " + patient.age} </Text>
            <Text style={styles.textStyle}> { "Gender: " + patient.gender} </Text>
            
            {/* patient tests is defined as an json array, i want to view it through some button */}
            
            <Text style={styles.textStyle}> { "Weight: " + patient.weight} </Text>
            <Text style={styles.textStyle}> { "Height: " + patient.height} </Text>
            
            {/*  */}
            <View style = {styles.btnUpdateDelete}>
            <TouchableOpacity style = {styles.deleteBtn} onPress={confirmDelete}>
               <Text style = {styles.bthTextStyle}>Delete</Text>
               </TouchableOpacity>

               <TouchableOpacity style = {styles.editBtn} onPress={()=>{
            navigation.navigate('PatientUpdate', {toEditPatient:patient})
        }}>
                <Text style = {styles.bthTextStyle}>Edit</Text>
               </TouchableOpacity>
            </View>
            
            
            <TouchableOpacity style={styles.addtestBtn} onPress={()=>{
                // this acts like sender, sent the patient to next screen, var is called toPatientTest
            navigation.navigate('PatientTests', {toPatientTest:patient})
        }}>
            <Text style = {styles.bthTextStyle}>Test History</Text>
        </TouchableOpacity>
       </View>
          
   )

}

const styles = StyleSheet.create({
    viewStyle:{
        alignItems: "stretch",
        //justifyContent: "center"
    },
    textStyle : {
        padding:5,
        fontSize: 25
    },
    imageStyle: {
        width: 130,
        height: 130,
        alignSelf:"center",
        borderRadius:30,
        borderColor:'white',
        borderWidth: 5
    },
    btnUpdateDelete: {
        top:10,
        flexDirection:"row",
    },
    editBtn:{
        left:25,
        width:180,
        backgroundColor:'#93BA71',
        borderRadius:20
    },
    deleteBtn:{
        left:10,
        width:180,
        backgroundColor:'#F36969',
        borderRadius:20
    },
    bthTextStyle:{
        color: 'white',
        fontWeight:"bold",
        fontSize:35,
        alignSelf:'center'
    },
    addtestBtn:{
        top: 30,
        backgroundColor:'#54A7F5',
        borderRadius:20
    }

})

export default PatientDetailsScreen;


