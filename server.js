const express=require('express');//this is use for use express
const mongoose=require('mongoose');//this is use for use mongoose
const app=express();// initialize express app
const port=3000;//define port number
app.use(express.json());//middleware to parse JSON


mongoose.connect('mongodb+srv://shovonhalder04_db_user:0fcOlFID9BvHIkRm@mongo.9jnmqgl.mongodb.net/').then(()=>console.log('Connected to MongoDB')).catch(err=>console.error('Could not connect to MongoDB',err));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' }
});
const User = mongoose.model('User', userSchema);

app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save(); // Save to DB
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// READ ALL (GET)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all docs
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//update

app.put('/users/:id', async (req, res) => {
    try {
        // { new: true } returns the updated document instead of the old one
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE (DELETE)
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});