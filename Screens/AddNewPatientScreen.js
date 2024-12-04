/**this page will show the patient stored in local db
 * when touch the patient list, it will show the patient detail,
 * view tests->show the test list->click the test->show the test detail
 * ->click the add test button -> add new test
 */
import React, { useEffect, useState } from "react";
import {View, StyleSheet, Button, TextInput } from "react-native";
// future plan: add a button to the record data screen ti update the latest data?
import axios from "axios";
import * as SQLite from 'expo-sqlite';


const AddNewPatientScreen = ({ navigation, route}) => {

    const [newFirst, setNewFirst] = useState('')
    const [newLast, setNewLast] = useState('')
    const [newRoom, setNewRoom] = useState('')
    const [newAge, setNewAge] = useState('')
    const [newGender, setNewGender] = useState('')
    const [newCondition, setNewCondition] = useState('')
    const [newWeight, setNewWeight] = useState('')
    const [newHeight, setNewHeight] = useState('')
    const [newDate, setNewDate] = useState(new Date())
    // dqlite database
    const [db, setDB] = useState(null)
    // function to initialize the dababase
    const initDataBase = async()=>{
        try{
            const database = await SQLite.openDatabaseAsync('localPatient.db')
            setDB(database) // set db with database if exist
        // continue to create the table
        await database.execAsync(`CREATE TABLE IF NOT EXISTS patients(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age TEXT,
            gender TEXT,
            room TEXT,
            condition TEXT,
            weight TEXT,
            height TEXT,
            date TEXT)`) // inside string should be s sql quary
        }catch (error){
            console.log("Error in initializing database")
        }
        
    }
    // call the initDatabase here
    useEffect(()=>{
        initDataBase()
    },[])
    // insert data to db
    const addNewItemToList = async()=>{
        if (db == null){
            console.log("Database is null")
        }
        else {
            try{
                const nameString = newFirst + " " + newLast 
                if (nameString !== "") {
                    //console.log(`name is ${nameString}`) age is good
                    console.log(`${newGender} ${newRoom} ${newCondition},
                        ${newWeight} ${newHeight} ${newDate}`)
                        const formattedDate = newDate.toISOString()
                   await db.runAsync(
                    `INSERT INTO patients(name, age, gender, room, 
                       condition, weight, height, date) 
                       VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
                     [nameString, newAge, newGender, newRoom, newCondition,
                        newWeight, newHeight, formattedDate])
                   console.log("Patient added")
                   navigation.goBack()
               }
               else {
                console.log("name is empty")
               }
               }catch(error){
                   console.log("Error in adding patient")
               }
        }
        
    }
    // fetch patients in db and make it as a list
    // add new patient to mongodb
    const newPatient = async ()=>{
       
        const newpatient = {
        name: {
            first: newFirst,
            last: newLast
        },
        //tests:[], 
        age: parseInt(newAge),
        gender: newGender, 
        room: newRoom,
        condition: newCondition,
        weight: newWeight,
        height: newHeight,
        date: newDate
        }
        
        try {
            // Replace with your actual API URL and endpoint
            console.log("Patient Object:", JSON.stringify(newpatient, null, 2))

            const response = await axios.post("http://172.16.7.126:3000/api/patients", newpatient)
            if (response.status === 201) {
                console.log('New patient added:', response.data)
                navigation.goBack()
            } else {
                console.error('Failed to add patient:', response.statusText)
            }
        } catch (error) {
            console.error('Error adding patient:', error)
        }
        navigation.goBack()

        
    }

    return (
        <View style = {styles.viewStyle}>
            <TextInput style={styles.textStyle}
            placeholder="Enter First Name:"value = {newFirst} onChangeText={setNewFirst}></TextInput>
            <TextInput style={styles.textStyle}
            placeholder="Enter Last Name:"value = {newLast} onChangeText={setNewLast}></TextInput>
            <TextInput style={styles.textStyle}
            placeholder="Enter Age:"value = {newAge} onChangeText={setNewAge}></TextInput>
            <TextInput style={styles.textStyle}
            placeholder="Enter Gender:"value = {newGender} onChangeText={setNewGender}></TextInput>
            <TextInput style={styles.textStyle}
            placeholder="Enter Room #:"value = {newRoom} onChangeText={setNewRoom}></TextInput>
            <TextInput style={styles.textStyle}
            placeholder="Enter Condition:"value = {newCondition} onChangeText={setNewCondition}></TextInput>
            <TextInput style={styles.textStyle}
            placeholder="Enter Weight:"value = {newWeight} onChangeText={setNewWeight}></TextInput>
            <TextInput style={styles.textStyle}
            placeholder="Enter Height:"value = {newHeight} onChangeText={setNewHeight}></TextInput>
            <TextInput style={styles.textStyle}
            placeholder="Date Record:"value = {newDate} onChangeText={setNewDate}></TextInput>
            <Button title="Save to MongoDB" onPress = { async () => {
             await newPatient()}}></Button>
            <Button title="Save to local" onPress = { addNewItemToList }></Button>
       </View>
          
   )

}

const styles = StyleSheet.create({
    viewStyle:{
        alignItems: "stretch"
    },
    textStyle : {
        padding:3,
        fontSize: 20
    }
})

export default AddNewPatientScreen;


