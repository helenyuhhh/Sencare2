import React, { useState, useEffect, use } from "react";
import { Text, FlatList ,View, StyleSheet, Image, TouchableOpacity, Button } from "react-native";
import SearchBar from "../Component/SearchBar";
const PatientListScreen = (props) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [patients,setPatientsList] = useState([])
    const [criticalPatients, setCriticalList] = useState([])
    const [showCritical, setShowCritical] = useState(false)
    const [normalPatients, setNormalList] = useState([])
    const [showNormal, setShowNormal] = useState(false)
    const [filterType, setFilterType] = useState('')
    const fetchPatients = async() => {
        setShowCritical(false)
        setShowNormal(false)
        setFilterType("All")
        fetch('http://172.16.7.126:3000/api/patients').
            then(response => response.json()).then(data => {
                setPatientsList(data)
                // below is the new added
                /*if (data.condition == "Critical") {
                    setCriticalList(data)
                }*/
            } )
    } 
   
    useEffect(() => { 
        fetchPatients()
    },[]) // with =out [] it will render everytime the component changes
    
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
    const filterPatientByType = ()=>{
        if (filterType === "Critical") {
            return patients.filter(patient => 
                patient.condition === "Critical")
        }
        else if (filterType === "Normal") {
            return patients.filter(patient => 
                patient.condition === "Normal")
        }
        else {
            return patients
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
            <View style = {styles.filterView}>
              <TouchableOpacity style = {styles.criticalBtnStyle} onPress={()=>{setFilterType("Critical")}}>
                <Text style={styles.btnTextStyle}>Critical Patient</Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.normalBtnStyle} onPress={()=>{setFilterType("Normal")}}>
                <Text style={styles.btnTextStyle}>Normal Patient</Text>
              </TouchableOpacity>
            </View>
            <View style = {styles.listView}>
            <FlatList
                data={filterPatientByType()}
                
                 keyExtractor={(item,i) => i}
                renderItem={ (listItem) => 
                    patientRow(listItem.item)
                }
            ></FlatList>

            </View>
            
            <View style = {styles.addPatientView}>
            <TouchableOpacity style = {styles.btnSaveStyle} 
                onPress={()=>{props.navigation.navigate("AddNewPatient")}}>
                <Text style={styles.btnText}>Add Patient</Text>
            </TouchableOpacity>
            </View>
            
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
    },
    filterView: {
        flexDirection:"row"
    },
    criticalBtnStyle: {
        left:10,
        width:180,
        backgroundColor:'#F36969',
        borderRadius:10
    },
    normalBtnStyle:{
        left:25,
        width:180,
        backgroundColor:'#93BA71',
        borderRadius:10 
    },
    btnTextStyle:{
        color: 'white',
        fontWeight:"bold",
        fontSize:20,
        alignSelf:'center'
    },
    btnSaveStyle:{
        borderRadius:15,
        backgroundColor:'#33819C',
        width:300,
        height:60
    },
    btnText:{
        top:15,
        fontSize: 25,
        color: 'white',
        alignSelf:'center',
        fontWeight:'500'
    },
    addPatientView: {
        top: 30,
        left: 50
        
    },
    listView: {
        height:405
    }
})

export default PatientListScreen;


