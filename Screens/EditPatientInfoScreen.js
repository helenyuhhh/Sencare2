/**this page will show the patient stored in local db
 * when touch the patient list, it will show the patient detail,
 * view tests->show the test list->click the test->show the test detail
 * ->click the add test button -> add new test
 */
import React, { useEffect, useState } from "react";
import {View, StyleSheet, Button, TextInput, Text, TouchableOpacity} from "react-native";
// future plan: add a button to the record data screen ti update the latest data?
import axios from "axios";
import * as SQLite from 'expo-sqlite';


const EditPatientInfoScreen = ({ navigation, route}) => {
    const patient = route.params.toEditPatient
    const patientID = patient._id // patient id

    const [newRoom, setNewRoom] = useState('')
    const [newAge, setNewAge] = useState('')
    const [newWeight, setNewWeight] = useState('')
    const [newHeight, setNewHeight] = useState('')
    
    const editPatient = async ()=>{
        const newpatient = {
            room: newRoom ? newRoom : patient.room,
            age: newAge ? parseInt(newAge) : patient.age,
            weight: newWeight ? newWeight : patient.weight,
            height: newHeight ? newHeight : patient.height
        }
        try {
            // Replace with your actual API URL and endpoint
            console.log("Patient Object:", JSON.stringify(newpatient, null, 2))

            const response = await axios.patch(`http://172.16.7.126:3000/api/patients/${patientID}`, newpatient)
            if (response.status === 200 || response.status === 204) {
                console.log('New patient edited:', response.data)
                navigation.goBack()
            } else {
                console.error('Failed to update patient:', response.statusText)
            }
        } catch (error) {
            console.error('Error editing patient:', error)
        }
        navigation.goBack()
    }

    return (
        <View style = {styles.viewStyle}>
            
            <View style={styles.inputView}>
                <Text style = {styles.labelText}>Age:  </Text>
                <TextInput style={styles.textStyle}
            placeholder="Enter New Age:"value = {newAge} onChangeText={setNewAge}></TextInput>
            </View>
            {/*-------------------------------------------*/}
            
            <View style={styles.inputView}>
                <Text style = {styles.labelText}>Room#:  </Text>
                <TextInput style={styles.textStyle}
                 placeholder="Enter Room #:"value = {newRoom} onChangeText={setNewRoom}>
                </TextInput>
            </View>
            {/*------------------------------------------*/}
            
            <View style={styles.inputView}>
                <Text style = {styles.labelText}>Enter Weight:  </Text>
                <TextInput style={styles.textStyle}
                 placeholder="Enter Weight:"value = {newWeight} onChangeText={setNewWeight}>
                </TextInput>
            </View>
            {/*---------------------------------------------*/}
            <View style={styles.inputView}>
                <Text style = {styles.labelText}>Enter Height:  </Text>
                <TextInput style={styles.textStyle}
                 placeholder="Enter Height:"value = {newHeight} onChangeText={setNewHeight}>
                </TextInput>
            </View>
            
            <TouchableOpacity style = {styles.btnSaveStyle} onPress = { async () => {
             await editPatient()}}>
                <Text style = {styles.btnText}>Update Patient</Text>
             </TouchableOpacity>
             {/*<Button title="Save to local" onPress = { addNewItemToList }></Button>*/}
            
       </View>
          
   )

}

const styles = StyleSheet.create({
    viewStyle:{
        // alignItems: "stretch",
        // backgroundColor:'#A1BD84'
    },
    textStyle : {
        padding:3,
        fontSize: 25,
        // backgroundColor:'#F4F7F1',
        borderRadius:13,
        width: 400
    },
    inputView: {
        top: 35,
        flexDirection:"row", 
    },
    labelText:{
        padding:3,
        fontSize: 25,
        fontWeight:"bold"
    },
    btnSaveStyle:{
        left:50,
        top: 50,
        borderRadius:15,
        backgroundColor:'#A1BD84',
        width:300,
        height:60
    },
    btnText:{
        top:15,
        fontSize: 25,
        color: 'white',
        alignSelf:'center',
        fontWeight:'500'
    }
})

export default EditPatientInfoScreen;


