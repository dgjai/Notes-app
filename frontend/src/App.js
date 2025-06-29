import React, { useState, useEffect } from 'react';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const res = await fetch('http://localhost:5000/notes');
    const data = await res.json();
    setNotes(data);
  };

  const createNote = async () => {
    if (!title || !content) return alert("Title and content required");
    await fetch('http://localhost:5000/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    setTitle('');
    setContent('');
    loadNotes();
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await fetch(`http://localhost:5000/notes/${id}`, {
      method: 'DELETE'
    });
    loadNotes();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>My Notes App</h1>
      <div style={{
        background: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#555' }}>Create a new note</h2>
        <input
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          style={{
            width: '100%',
            padding: '10px',
            height: '100px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '10px'
          }}
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button
          onClick={createNote}
          style={{
            background: '#4CAF50',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Note
        </button>
      </div>

      <h2 style={{ marginTop: '30px', color: '#555' }}>Your Notes</h2>
      {notes.map(note => (
        <div key={note.id} style={{
          background: '#fff',
          padding: '15px',
          margin: '10px 0',
          borderRadius: '6px',
          boxShadow: '0 1px 5px rgba(0,0,0,0.1)'
        }}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <small style={{ color: '#888' }}>Last updated: {new Date(note.updated_at).toLocaleString()}</small>
          <div>
            <button
              onClick={() => deleteNote(note.id)}
              style={{
                marginTop: '10px',
                background: '#e74c3c',
                color: '#fff',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
