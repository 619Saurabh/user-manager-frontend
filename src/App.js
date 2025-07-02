import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'

const API = 'http://localhost:5000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
  };

  const addUser = async (e) => {
    e.preventDefault();
    const res = await axios.post(API, form);
    setUsers([...users, res.data]);
    setForm({ name: '', email: '' });
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API}/${id}`);
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div style={{ padding: 20 }} className='App'>
      <h1>User Manager</h1>
      <form onSubmit={addUser}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <br/>
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <br/>
        <button type="submit">Add User</button>
      </form>

      <ul>
        {users.map(user => (
          <li key={user.id} style={{listStyle: 'none'}}>
            {user.name} ({user.email})
            <button onClick={() => deleteUser(user.id)} style={{ marginLeft: 10 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
