import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// In-memory posts storage
let posts = [
    { id: 1, title: "First Post", content: "This is the first blog post." },
    { id: 2, title: "Second Post", content: "This is the second blog post." }
];

// Helper function to generate unique IDs
const generateId = () => {
    return posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
};

// Routes
app.get('/', (req, res) => {
    console.log('GET / - Rendering index with posts:', posts);
    res.render('index.ejs', { posts });
});

app.post('/add-post', (req, res) => {
    console.log('POST /add-post - Request body:', req.body);
    const { title, content } = req.body;
    if (title && content) {
        const newPost = {
            id: generateId(),
            title: title.trim(),
            content: content.trim()
        };
        posts.push(newPost);
        console.log('New post added:', newPost);
        res.redirect('/');
    } else {
        console.log('Add post failed: Missing title or content');
        res.status(400).send('Title and content are required');
    }
});

app.post('/edit-post', (req, res) => {
    console.log('POST /edit-post - Request body:', req.body);
    const { id, title, content } = req.body;
    const postId = parseInt(id);
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1 && title && content) {
        posts[postIndex] = {
            id: postId,
            title: title.trim(),
            content: content.trim()
        };
        console.log('Post edited:', posts[postIndex]);
        res.redirect('/');
    } else {
        console.log('Edit post failed: Invalid data');
        res.status(400).send('Invalid post data');
    }
});

app.post('/delete-post', (req, res) => {
    console.log('POST /delete-post - Request body:', req.body);
    const { id } = req.body;
    const postId = parseInt(id);
    posts = posts.filter(p => p.id !== postId);
    console.log('Post deleted, remaining posts:', posts);
    res.redirect('/');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});