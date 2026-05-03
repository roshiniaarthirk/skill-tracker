import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    skills: "",
    experience: "",
    status: "learning"
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // GET
  const fetchUsers = async () => {
    const res = await axios.get("http://127.0.0.1:5000/users");
    setUsers(res.data);
  };

  // ADD
  const addUser = async () => {
    const data = {
      ...form,
      skills: form.skills.split(",").map(s => s.trim())
    };

    await axios.post("http://127.0.0.1:5000/add", data);
    setForm({ name:"", age:"", skills:"", experience:"", status:"learning" });
    fetchUsers();
  };

  // DELETE
  const deleteUser = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/delete/${id}`);
    fetchUsers();
  };

  // UPDATE
  const updateStatus = async (id) => {
    await axios.put(`http://127.0.0.1:5000/update/${id}`, {
      status: "completed"
    });
    fetchUsers();
  };

  // FILTER
  const filterUsers = async () => {
    const res = await axios.get("http://127.0.0.1:5000/filter");
    setUsers(res.data);
  };

  return (
    <div style={{
      textAlign: "center",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh"
    }}>
      <h1>🚀 Skill Tracker</h1>

      <input placeholder="Name"
        value={form.name}
        onChange={(e)=>setForm({...form,name:e.target.value})} />

      <input placeholder="Age"
        value={form.age}
        onChange={(e)=>setForm({...form,age:e.target.value})} />

      <input placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={(e)=>setForm({...form,skills:e.target.value})} />

      <input placeholder="Experience"
        value={form.experience}
        onChange={(e)=>setForm({...form,experience:e.target.value})} />

      <br/><br/>

      <button onClick={addUser}>Add</button>
      <button onClick={filterUsers} style={{marginLeft:"10px"}}>Filter</button>
      <button onClick={fetchUsers} style={{marginLeft:"10px"}}>Show All</button>

      <hr/>

      {users.map(u => (
        <div key={u._id} style={{
          margin:"15px auto",
          padding:"15px",
          width:"300px",
          borderRadius:"10px",
          boxShadow:"0 0 10px gray",
          backgroundColor:"white"
        }}>
          <h3>{u.name}</h3>
          <p>Skills: {u.skills.join(", ")}</p>
          <p>Experience: {u.experience}</p>
          <p>Status: {u.status}</p>
          <p>👉 Career: {u.career}</p>

          <button onClick={()=>updateStatus(u._id)}>Update</button>
          <button onClick={()=>deleteUser(u._id)} style={{marginLeft:"10px"}}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;