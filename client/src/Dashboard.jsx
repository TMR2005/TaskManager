import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Dashboard() {
  const { email } = useParams();
  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([]);
  const [newtask, setNewTask] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/user/${email}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));

    // Fetch tasks for the user
    fetch(`http://localhost:5000/tasks/${email}`)
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [email]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function handleAddTask() {
    if (newtask.trim() === "") return;
  
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, email: user.email, task: newtask }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.task) {
          setTasks((prevTasks) => [...prevTasks, data.task]);
          setNewTask("");
        } else {
          console.error("Error adding task:", data.message);
        }
      })
      .catch((err) => {
        console.error("Error adding task:", err);
      });
  }
  

  function handleDeleteTask(taskId) {
    fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete task');
        // Remove the task from state
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      })
      .catch((err) => {
        console.error('Error deleting task:', err);
      });
  }
  

  function moveUpTask(index) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index - 1], updatedTasks[index]] = [
        updatedTasks[index],
        updatedTasks[index - 1],
      ];
      setTasks(updatedTasks);
    }
  }

  function moveDownTask(index) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index + 1], updatedTasks[index]] = [
        updatedTasks[index],
        updatedTasks[index + 1],
      ];
      setTasks(updatedTasks);
    }
  }

  return (
    <div className="todo-list-container">
      <h1>To-Do List</h1>
      <p><strong>Logged in as:</strong> {user.name} ({user.email})</p>

      <input
        type="text"
        value={newtask}
        onChange={handleInputChange}
        placeholder="Add a new task"
        id="input-task"
      />
      <button className="add-btn" onClick={handleAddTask}>
        Add Task
      </button>
      <ul>
  {tasks.map((taskObj, index) => (
    <li key={taskObj._id || index}>
      {taskObj.task}
      <button className="delete-btn" onClick={() => handleDeleteTask(taskObj._id)}>
        Delete
      </button>
      <button className="moveup-btn" onClick={() => moveUpTask(index)}>
        Move Up
      </button>
      <button className="movedown-btn" onClick={() => moveDownTask(index)}>
        Move Down
      </button>
    </li>
  ))}
</ul>

        <p>
            <a href="/">Logout</a>
        </p>
    </div>
  );
}

export default Dashboard;
