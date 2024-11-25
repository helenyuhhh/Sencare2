import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PatientDetailsScreen from '../Screens/PatientDetailsScreen';
import { getRole } from '@testing-library/react-native/build/helpers/accessibility';

// integration test for PatientDetailScreen
// render renders the components of screen, it comes with differet functions
describe('PatientDetailScreen', () => {
    // initialize test function for navigate
    const testNavigate = {
        navigate: jest.fn()
    }
    // initialize a testRoute?
    const testRoute = {
        params: {
            toPatientDetail:{
                // name, age, gender, room, condition, weight, height, date, pic
                name:{first: "Alice", last: "Pulan"},
                age: 30,
                gender: "Female",
                room: "230A",
                weight: "130lb",
                height: "5.4ft",
                date: "2020-10-10",
                picture: "http://test/pic"
            }
        }
    }
    it("shows the patient details", ()=>{
        const { getByText, getByRole } = render(
            <PatientDetailsScreen route={testRoute} navigation={testNavigate} />
          )
          expect(getByText('Patient Name: Alice Pulan')).toBeTruthy()
          expect(getByText('Age: 30')).toBeTruthy()
          expect(getByText('Gender: Female')).toBeTruthy()
          expect(getByText('Room Number: 230A')).toBeTruthy()
          expect(getByText('Weight: 130lb')).toBeTruthy()
          expect(getByText('Height: 5.4ft')).toBeTruthy()
        const testButton = getByRole('button', {name: "View Tests list"})
        expect (testButton).toBeTruthy
    })
    // test the button function
    // getRole is used for accessibility role like buttons etc
    it("Nevigate to next pape: test list", ()=>{
        // parameter of PatientDetailScreen
        const { getByRole } = render(<PatientDetailsScreen route = {testRoute}
            navigation = {testNavigate}/>)
            // initialize a test button
        const testButtom = getByRole('button', {name: "View Tests list"})
        // simulate the button fress 
        fireEvent.press(testButtom)
        // go to next page, just replace the router and navigate with
        // the value defined here
        expect (testNavigate.navigate).toHaveBeenCalledWith('PatientTests', 
            {toPatientTest: testRoute.params.toPatientDetail}
        )
    })

})