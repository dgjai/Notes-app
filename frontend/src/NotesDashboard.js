import React, { useEffect, useState } from 'react';

function NotesDashboard() {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:5000/notes');
      const data = await res.json();
      console.log("Fetched notes:", data);
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:5000/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });
      const data = await res.json();
      console.log("Created note:", data);
      setNewTitle('');
      setNewContent('');
      fetchNotes();
    } catch (err) {
      console.error("Error creating note", err);
    }
  };

  const handleUpdate = async (id, title, content) => {
    try {
      await fetch(`http://localhost:5000/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      fetchNotes();
    } catch (err) {
      console.error("Error updating note", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/notes/${id}`, {
        method: 'DELETE'
      });
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Notes Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="New Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        /><br /><br />
        <textarea 
          placeholder="New Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        ></textarea><br /><br />
        <button onClick={handleCreate}>Create Note</button>
      </div>

      {notes.length === 0 && <p></p>}

      {notes.map(note => (
        <div key={note.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <input 
            type="text"
            value={note.title}
            onChange={(e) => {
              const updatedNotes = notes.map(n => 
                n.id === note.id ? { ...n, title: e.target.value } : n
              );
              setNotes(updatedNotes);
            }}
          /><br /><br />
          <textarea 
            value={note.content}
            onChange={(e) => {
              const updatedNotes = notes.map(n => 
                n.id === note.id ? { ...n, content: e.target.value } : n
              );
              setNotes(updatedNotes);
            }}
          ></textarea><br /><br />
          <small>Last updated: {new Date(note.updated_at).toLocaleString()}</small><br /><br />
          <button onClick={() => handleUpdate(note.id, note.title, note.content)}>Update</button>
          <button onClick={() => handleDelete(note.id)} style={{ marginLeft: '10px' }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default NotesDashboard;
