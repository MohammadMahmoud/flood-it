import React from 'react';
import { render } from '@testing-library/react';
import Layout from './layout';

test('renders learn react link', () => {
  const { getByText } = render(<Layout />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
