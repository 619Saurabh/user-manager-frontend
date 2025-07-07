import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

// App.test.js

jest.mock('axios');

const mockUsers = [
  { id: 1, name: 'Arjun', email: 'arjun@email.com' },
  { id: 2, name: 'Ria', email: 'ria@email.com' }
];

beforeEach(() => {
  axios.get.mockResolvedValue({ data: mockUsers });
  axios.post.mockResolvedValue({ data: { id: 3, name: 'Aryan', email: 'aryan@email.com' } });
  axios.put.mockImplementation((url, data) => Promise.resolve({ data: { ...data, id: 1 } }));
  axios.delete.mockResolvedValue({});
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders User Manager title', async () => {
  render(<App />);
  expect(screen.getByText(/User Manager/i)).toBeInTheDocument();
  await waitFor(() => expect(axios.get).toHaveBeenCalled());
});

test('fetches and displays users', async () => {
  render(<App />);
  expect(await screen.findByText(/Arjun/i)).toBeInTheDocument();
  expect(screen.getByText(/Ria/i)).toBeInTheDocument();
});

test('adds a new user', async () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Aryan' } });
  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'aryan@email.com' } });
  fireEvent.click(screen.getByText(/Add/i));
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  expect(await screen.findByText(/Aryan/i)).toBeInTheDocument();
});

test('edits a user', async () => {
  render(<App />);
  fireEvent.click((await screen.findAllByText(/Edit/i))[0]);
  fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Naina' } });
  fireEvent.click(screen.getByText(/Update/i));
  await waitFor(() => expect(axios.put).toHaveBeenCalled());
  expect(await screen.findByText(/Naina/i)).toBeInTheDocument();
});

test('cancels editing', async () => {
  render(<App />);
  fireEvent.click((await screen.findAllByText(/Edit/i))[0]);
  fireEvent.click(screen.getByText(/Cancel/i));
  expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
});

test('deletes a user', async () => {
  render(<App />);
  fireEvent.click((await screen.findAllByText(/Delete/i))[0]);
  
  // After delete, updating the mock to return only Ria
  axios.get.mockResolvedValueOnce({ data: [{ id: 2, name: 'Ria', email: 'ria@email.com' }] });

  // Confirms axios.delete() was called
  await waitFor(() => expect(axios.delete).toHaveBeenCalled());
  // Wait for Arjun to be removed from the DOM
  await waitFor(() => expect(screen.queryByText(/Arjun/i)).not.toBeInTheDocument());
});