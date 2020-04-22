import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders copyright', () => {
  const { getByText } = render(<App />);
  const copyrightElement = getByText(/viktor_semenov@outlook.com/i);
  expect(copyrightElement).toBeInTheDocument();
});
