// this file is to add clinical data, should be nagivate to data history page
// add file to mongo db
import React, { useState } from "react";
import {View, StyleSheet, Button, TextInput, Text, TouchableOpacity, Alert} from "react-native";
import axios from "axios";
import PatientTestScreen from "./PatientTestScreen";
import { Picker } from "@react-native-picker/picker"; 
import DateTimePicker from '@react-native-community/datetimepicker';

// future plan: add a button to the record data screen ti update the latest data?


const AddClinicalDataScreen = ({ navigation, route}) => {
    //const patient = route.params.toAddP
    const patient = route.params?.toAddP;
    console.log('Received patient data:', patient);
    const patientID = patient._id
    // console.log('Patient ID:', patientID)
    // category
    const [newCategory, setCategory] = useState('')
    // nurse
    const [newNurse, setNurse] = useState('')
    // type: Test
    const [newType, setType] = useState('')
    // date
    const [newDate, setDate] = useState(new Date)
    // set date picker
    const [date, setDatePicker] = useState(new Date())
    const [show, setShow] = useState(false)
    const [time, setTime] = useState(new Date())
    const [showTime, setShowTime] = useState(false)
    const [validInput, setValid] = useState(false) // check the input
    
    // reading, should be number, but depending on the decision, add button would be greate?
    // add button to show the rest of the reading input area
    //const [newReading, setReading] = useState('')
    // const [newDate, setNewDate] = useState(new Date())
    // a function: add new item to list
    
   // for test reading
    const [newSys, setSys] = useState("")
    const [newDia, setDia] = useState("")
    const [newRes, setRes] = useState("")
    const [newBlOx, setBlO] = useState("") // for blood oxygen
    const [newHP, setHP] = useState("") // for blood pressure

   // for test ID
    const [newID, setNewID] = useState("")
    
    var newCondition = ""
    const checkInput = () => {
        if (newBlOx > 1 || newRes > 20 || newDia > 200 || newSys > 200 || newHP > 500) {
            setValid(false)
        }
        else {
            setValid(true)
            //newTest()
        }
    }
    // function for check condition
    const latestCondition = ()=> {
        let criticalBlO = false
        let criticalBloodPres = false
        let criticalRes = false
        let criticalHeartBeat = false
        if (newRes && (newRes >= 17 || newRes <= 11)) {
             criticalRes = true
        }
        if(newBlOx && (newBlOx >= 1 || newRes < 0.95)) {
             criticalBlO = true
        }
        if (newHP &&(newHP > 100 || newHP <= 59)) {
             criticalHeartBeat = true
        }
        if (newSys && newDia && !(newSys <120 && newDia < 80)) {
             criticalBloodPres = true
        }
        if ((criticalRes || criticalBlO || criticalHeartBeat || criticalBloodPres)) {
            newCondition = "Critical"
        }
        else{
            newCondition = "Normal"
        }
    }
    const setNewDateForPicker = (event, date) =>{
        if (date) {
            setDatePicker(date)
        }
        setShow (false)
    }
    // for time
    const setTimePicker = (event, selectedTime) =>{
        const currentTime = selectedTime || time
        console.log(currentTime.toTimeString())
        setShowTime(false)
        setTime(currentTime)
        
    }
    const newTest = async ()=>{
        // test structure:
        const test = {
        patient_id: patientID,
        date: date,
        nurse_name: newNurse,
        type: newType, // type is test
        category: newCategory,
        reading:{
            systolic: newSys ? parseInt(newSys) : undefined,
            diastolic: newDia ? parseInt(newDia) : undefined,
            respiratory: newRes ? parseInt(newRes) : undefined,
            blood_oxygen: newBlOx ? parseFloat(newBlOx) : undefined, // decimal number
            heartbeat_rate: newHP ? parseInt(newHP) : undefined
        },
        id: newID
        }
        
        //navigation.goBack()
        // call the latest condition
        checkInput()
        latestCondition()
        if (validInput) {
            try {
                console.log("Test Object:", JSON.stringify(test, null, 2))
                const response = await axios.post(`http://172.16.7.126:3000/api/patients/${patientID}/tests`, test)
                if (response.status === 201) {
                    console.log('New test added:', response.data)
                    await axios.patch(`http://172.16.7.126:3000/api/patients/${patientID}`, {condition: newCondition})
                    console.log('patient condition uodated', newCondition)
                    navigation.goBack()
                } else {
                    console.error('Failed to add test:', response.statusText)
                }
            } catch (error) {
                console.error('Error adding test:', error)
            }

        }
        else {
            Alert.alert('Alert', 'Invalid Input!',[
                {
                    text: 'OK',
                    onPress: ()=>console.log('OK pressed')
                }
            ])
        }
        

        
    }

    return (
        <View style = {styles.viewStyle}>
            
            <View >
                <Text style={styles.textStyle}>Select Test</Text>
                <Picker style = {styles.pickerStyle} selectedValue={newCategory}
                    onValueChange={(itemValue) => {setCategory(itemValue)}}>
                    <Picker.Item label="Heartbeat Rate" value="Heartbeat Rate" />
                    <Picker.Item label="Respiratory Rate" value="Respiratory Rate" />
                    <Picker.Item label="Blood Oxygen Level" value="Blood Oxygen Level" />
                    <Picker.Item label="Blood Pressure" value="Blood Pressure" />
                </Picker>

            </View>
            <View style = {styles.inputView}>
                <View>
                    <TouchableOpacity style={styles.btnStyle}onPress={()=>{setShow(true)}}>
                        <Text style = {styles.btnText}>Select Date</Text>
                    </TouchableOpacity>
                    {
                        show && (
                            <DateTimePicker
                              value={date}
                              mode="date" 
                              display="default"
                              onChange={setNewDateForPicker}
                            />
                          )
                    }
                    <Text style={[styles.textStyle,{marginTop:20}]}>{date.toDateString()}</Text>

                    <TouchableOpacity style={styles.btnStyle} onPress={()=>{setShowTime(true)}}>
                        <Text style = {styles.btnText}>Select Time</Text>
                    </TouchableOpacity>
                    {
                        showTime && (
                            <DateTimePicker
                              value={time}
                              mode="time" 
                              display="default"
                              onChange={setTimePicker}
                            />
                          )
                    }
                    <Text style={[styles.textStyle,{marginTop:20}]}>{time.toTimeString()}</Text>

                </View>
            
            <TextInput style={styles.textStyle}
            placeholder="Enter Nurse Name:"value = {newNurse} onChangeText={setNurse}></TextInput>
            {newCategory === "Heartbeat Rate" && (<TextInput style={styles.textStyle}
                placeholder="Enter Heartbeat Rate"
                value={newHP}
               onChangeText={setHP}/>)}
            {newCategory === "Respiratory Rate" && (<TextInput style={styles.textStyle}
                placeholder="Enter Respiratory Rate"
                value={newRes}
               onChangeText={setRes}/>)}
               {newCategory === "Blood Oxygen Level" && (<TextInput style={styles.textStyle}
                placeholder="Enter Blood Oxygen Level"
                value={newBlOx}
               onChangeText={setBlO}/>)}
               {newCategory === "Blood Pressure" && (<TextInput style={styles.textStyle}
                placeholder="Enter Systolic"
                value={newSys}
               onChangeText={setSys}/>)}
               {newCategory === "Blood Pressure" && (<TextInput style={styles.textStyle}
                placeholder="Enter DiaDiastolic"
                value={newDia}
               onChangeText={setDia}/>)}
    
            <TextInput style={styles.textStyle}
            placeholder="Enter Test ID:"value = {newID} onChangeText={setNewID}></TextInput>
            
            {/* <TextInput style={styles.textStyle}
            placeholder="Date Record:"value = {newDate} onChangeText={setNewDate}></TextInput> */}
            <TouchableOpacity style={styles.btnSave} onPress={async () => {
             await newTest()}}>
                <Text style = {styles.btnText}>Save</Text>
             </TouchableOpacity>
            

            </View>
            
            
       </View>
          
   )

}
const styles = StyleSheet.create({
    viewStyle:{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexGrow: 1,
        flex:1 ,
        // backgroundColor: "#E5F3D4"
    },
    textStyle : {
        padding:3,
        fontSize: 25
    },
    pickerStyle:{
        top: -70,
        left: 80,
        width:300,
        height:100,
    },
    pickerView : {
        flexDirection:"column",
        padding:2
    },
    inputView:{
        top:10
    },
    btnStyle: {
        top:20,
        backgroundColor: '#6AA865',
        color: 'white',
        width:200,
        heigh:70,
        borderRadius:8,
        //alignSelf:'center'
    },
    btnText:{
        fontWeight:'500',
        color:'white',
        fontSize:30,
        alignSelf:'center'
    },
    btnSave:{
        top:20,
        backgroundColor: '#6AA865',
        color: 'coral',
        width:200,
        heigh:70,
        borderRadius:8,
        left:90
    }


})

export default AddClinicalDataScreen;


