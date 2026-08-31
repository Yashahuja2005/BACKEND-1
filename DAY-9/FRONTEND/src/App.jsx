import { useEffect, useState } from "react"
import axios from "axios"

function App() {

  const [notes, setNotes] = useState([
    {
      title: "test title 1",
      description: "test description 1"
    },
    {
      title: "test title 2",
      description: "test description 2"
    },
    {
      title: "test title 3",
      description: "test description 3"
    },
    {
      title: "test title 4",
      description: "test description 4"
    },
  ])

  const [selectedNote, setSelectedNote] = useState(null)

  function fetchNotes(){
    axios.get('http://localhost:3000/api/notes')
    .then((res)=>{
      setNotes(res.data.notes)
    })
  }

  useEffect(()=>{
    fetchNotes()
  },[])

  function handleSubmit(e){
    e.preventDefault()

    const {title, description} = e.target.elements

    console.log(title.value, description.value);

    axios.post("http://localhost:3000/api/notes", {
      title: title.value,
      description: description.value
    })
    .then(res=>{
      console.log(res.data);
      
      fetchNotes()
    })
    
  }

  function handleDeleteNote(noteId){
    axios.delete("http://localhost:3000/api/notes/"+noteId)
    .then(res=>{
      console.log(res.data);
      
      fetchNotes()
      if (selectedNote && (selectedNote._id || `${selectedNote.title}-${selectedNote.description}`) === (noteId || noteId)) {
        setSelectedNote(null)
      }
    })
    
  }


  function UpdateNote(noteId){
    const newDescription = prompt("Enter new description");
    axios.patch("http://localhost:3000/api/notes/"+noteId,{
      description: newDescription
    })
    .then(res=>{
      console.log(res.data);
      
      fetchNotes()
    })
  }

  function handleOpenNote(note){
    setSelectedNote(note)
  }

  function handleBackToList(){
    setSelectedNote(null)
  }

  return (
    <div className="app-shell">
      <div className="app-header">
        <div>
          <p className="eyebrow">Notebook</p>
          <h1>My Notes</h1>
        </div>
      </div>

      {!selectedNote && (
        <form className="note-create-form" onSubmit={handleSubmit}>
          <input className="field" name="title" type="text" placeholder="Enter title" />
          <textarea className="field textarea-field" name="description" rows="3" placeholder="Enter description"></textarea>
          <button className="primary-btn" type="submit">Create Note</button>
        </form>
      )}

      {selectedNote ? (
        <div className="note-detail-view">
          <button className="back-btn" onClick={handleBackToList}>← Back</button>

          <div className="note-detail-card">
            <p className="eyebrow">Selected Note</p>
            <h2>{selectedNote.title}</h2>
            <p className="note-detail-description">{selectedNote.description}</p>

            <div className="note-actions detail-actions">
              <button className="secondary-btn danger" onClick={() => handleDeleteNote(selectedNote._id)}>Delete</button>
              <button className="secondary-btn" onClick={() => UpdateNote(selectedNote._id)}>Modify</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="notes-grid">
          {
          notes.map((note, index) => {
            const noteId = note._id || `${note.title}-${index}`

          return <div className="note-card" key={noteId} onClick={() => handleOpenNote(note)}>
            <div className="note-header">
              <h2>{note.title}</h2>
            </div>
            <p className="note-description collapsed">{note.description}</p>
            <button className="read-more-btn" onClick={(e) => {
              e.stopPropagation()
              handleOpenNote(note)
            }}>
              Open note
            </button>
            <div className="note-actions">
              <button className="secondary-btn danger" onClick={(e)=>{e.stopPropagation(); handleDeleteNote(note._id)}}>Delete</button>
              <button className="secondary-btn" onClick={(e)=>{e.stopPropagation(); UpdateNote(note._id)}}>Modify</button>
            </div>
          </div>
          })
          }
        </div>
      )}
    </div>
  )
}

export default App
