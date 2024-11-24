// test the search bar
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import SearchBar from '../Component/SearchBar'

// test search bar rendering
describe('MySearchBar', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText } = render(<SearchBar onSearch={() => {}} />)
        expect(getByPlaceholderText('Search Name Here...')).toBeTruthy()
      })
})

// test search name
describe('Search name', () => {
  it('search correctly', () => {
      const testScreen = jest.fn()// create a test screen
      // run the testScreen function, it searches the onTermChange function
      // seems like the function uses the function to test
      const { getByPlaceholderText } = render(<SearchBar onTermChange={testScreen} />)
      // initialise a variable to get text from searchbar
      const getInput = getByPlaceholderText('Search Name Here...')
      // change text
      fireEvent.changeText(getInput, "Sam")
      expect(testScreen).toHaveBeenCalledWith("Sam")
    })
})





