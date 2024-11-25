import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PatientListScreen from '../Screens/PatientListScreen';

// tests for patient list, about fetching data and add to list
describe ('PatientListScreen', () =>{
    // initialize the navigation
    const testNavigate = {
        navigate: jest.fn()
    }
    // initialize the patient list
    const testPatientList = [
        {
            name: {first: "Test", last:"One"},
            room: "Test1",
            condition: "Normal"
        },
        {
            name: {first: "Test", last:"Two"},
            room: "Test2",
            condition: "Normal"
        },

    ]
    // clear the history mock and simulate the fetch function
    beforeEach(()=>{
        jest.clearAllMocks()
        fetch = jest.fn(()=>
        Promise.resolve({
            json:()=> Promise.resolve(testPatientList),

        }))
    })
    // display the patient datail
    it("display the patiet",()=>{ async ()=>{
        const {getByText} = render(<PatientListScreen/>)
        await waitFor(()=>{
            expect(getByText("Test One")).toBeTruthy
            expect(getByText("Test1")).toBeTruthy
            expect(getByText("Normal")).toBeTruthy
            expect(getByText("Test Two")).toBeTruthy
            expect(getByText("Test2")).toBeTruthy
            expect(getByText("Normal")).toBeTruthy
        
        })
    }
    })


    
        
    

})
