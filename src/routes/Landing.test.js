import { render, screen } from '@testing-library/react';
import Landing from './Landing';

test('renders page header', () => {
  render(<Landing />);
  const linkElement = screen.getByText(/select a category/i);
  expect(linkElement).toBeInTheDocument();
});
