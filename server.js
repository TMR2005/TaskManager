const express = require('express');
const moongoose = require('mongoose');
const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Connect to MongoDB
moongoose.connect('mongodb://localhost:27017/TaskManager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
// Define User schema
const UserSchema = new moongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = moongoose.model('User', UserSchema);

// Define Task schema
const TaskSchema = new moongoose.Schema({
  email: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Task = moongoose.model('Task', TaskSchema);

// Signup route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
    console.log('User created:', newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }); 
      if (user && user.password === password) {
        res.status(200).json({ message: 'Login successful' });
        console.log('User logged in:', user);
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
        console.log('Invalid login attempt for email:', email);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  });
  
// Get user by email
app.get("/user/:email", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email });
      console.log('Fetching user:', user);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ name: user.name, email: user.email });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });
  
// Get tasks by user email
app.get('/tasks/:email', async (req, res) => {
    try {
      const tasks = await Task.find({ email: req.params.email });
      res.json({ tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  });
  
// Add a new task   
app.post('/tasks', async (req, res) => {
  const { userId, email, task } = req.body;

  try {
    const newTask = new Task({ userId, email, task });
    await newTask.save();
    res.status(201).json({ message: 'Task added successfully', task: newTask });
    console.log('Task added:', newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Error adding task' });
  }
});

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
    console.log('Task deleted:', task);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
}); 
// Start the server 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});