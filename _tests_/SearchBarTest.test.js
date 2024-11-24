// test the search bar
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MySearchBar } from '../Component/SearchBar';

describe('MySearchBar', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText } = render(<SearchBar onSearch={() => {}} />);
        expect(getByPlaceholderText('Search Name Here...')).toBeTruthy();
      })
})

