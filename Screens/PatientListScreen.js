import React, { useState, useEffect } from "react";
import { Text, FlatList ,View, StyleSheet, Image, TouchableOpacity, Button } from "react-native";
import SearchBar from "../Component/SearchBar";
const PatientListScreen = (props) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [patients,setPatientsList] = useState([])
    const fetchPatients = async() => {
        fetch('https://mapd713patientapi-g3dpdtdthvcbhwbh.canadacentral-01.azurewebsites.net/api/patients').
            then(response => response.json()).then(data => {
                setPatientsList(data)
            } )
    } 
   
    useEffect(() => { 
        fetchPatients()
    },[])
    
    const filterPatients = (nameToSearch)=> {
        if (nameToSearch == ""){
            fetchPatients()
        }
        else {
            var resultList = patients.filter((patient)=>{
                // if patient's first name == typed name, return that patient and make a new list
                return patient.name.first == nameToSearch
            })
            if (resultList.length > 0) {
                setPatientsList(resultList)
            }
        }
    }
    patientRow = (patient) => 
        <TouchableOpacity onPress={()=>{
            props.navigation.navigate('PatientDetail', {toPatientDetail:patient})
        }}>
            <View style={[styles.viewStyle,
                patient.condition == "Critical" && styles.criticalStyle
            ]}>
                <Text style={styles.textStyle}>{patient.name.first +" "} {patient.name.last}</Text>
                <Text style={styles.textStyle}>{patient.room}</Text>
                <Text style={styles.textStyle}>
                    {patient.condition}
                </Text>
                <Image style={styles.imageStyle} source={{
                    uri: patient.picture
                }}></Image>
        </View>

        </TouchableOpacity>
        
    return (
        <View>
            
            {/* add the search term and retrive it , pass the logic from parent to child*/}
            {/* update the term(changed in searchbar) and update here
            rising the state from child component to parent component,
            now we are able to see the typed string in search bar.*/}
            <SearchBar term = {searchTerm} onTermChange={(newTerm)=>{
                setSearchTerm(newTerm)
                filterPatients(newTerm)
            }} /> 
            <Button title = "Refresh List" onPress={()=>{fetchPatients()}}/>
            <FlatList
                data={patients}
                 keyExtractor={(item,i) => i}
                renderItem={ (listItem) => 
                    patientRow(listItem.item)
                }
            ></FlatList>
        </View>   
   )
}

const styles = StyleSheet.create({
    titleStyle : {
        fontSize: 30,
        fontWeight:"bold",
        marginTop: 50,
        marginLeft:130
        
    },
    textStyle : {
        marginTop: 15,
        fontSize: 20,
        fontWeight: "bold"
    },
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent:'space-between',
        borderWidth: 1,
        margin: 15,
        borderRadius: 15,
        padding: 10
    },
    imageStyle: {
        width: 50,
        height: 50
    },
    criticalStyle : {
        
        borderColor: "red",
        borderWidth: 3,
    }
})

export default PatientListScreen;


