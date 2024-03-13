import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { db, connectToDb } from './db.js';
import { v4 as uuidv4 } from 'uuid';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync('./credentials.json'));
//const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const port = process.env.PORT || 8000;
const app = express();
// Middleware to parse the request body as JSON
// when it receives a POST request that has a JSON body, it will parse the body and make it available in the request object
app.use(express.json());

// To have node server serve the files statically
app.use(express.static(path.join(__dirname, '../build')));

// Enable All CORS Requests
app.use(cors());
// loading the user from the token
app.use( async (req, res, next) => {
    const { authtoken } = req.headers;
    if (authtoken) {
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
        }
        catch (error) {
            res.status(403).send('Unauthorized');
            console.log('Error verifying token', error);
        }
    } 
    req.user = req.user || {};
    next();
});

// connect to the database
// endpoint to get all articles
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await db.collection('articles').find({}).toArray();
        if (articles) {
            res.status(200).send(articles);
        } else {
            res.status(404).send('Articles not found.');
        }
    } catch (error) {
        res.status(500).send({ message: 'Error connecting to the database', error });
    }
});
// endpoint to get article by name
app.get('/api/articles/:name', async (req, res) => {
     
    const { name } = req.params;
    const { uid } = req.user;
    const article = await db.collection('articles').findOne({ name });
    if (article) {
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = uid && !upvoteIds.includes(uid);
        res.status(200).send(article);
    } else {
        res.status(404).send('Article not found.');
    }
});
app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
});

// endpoint to upvote an article using mongodb
app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;
    const article = await db.collection('articles').findOne({ name });
    
    if (article) {
        const upvoteIds = article.upvoteIds || [];
        //const canUpvote = uid && !upvoteIds.includes(uid);
        const hasUpvoted = upvoteIds.includes(uid);
        if (hasUpvoted) {
            await db.collection('articles').updateOne({ name }, { 
                $pull: { upvoteIds: uid }, 
                $inc: { upvotes: -1 } 
            });
        } else {
            await db.collection('articles').updateOne({ name },{ 
                $push: { upvoteIds: uid }, 
                $inc: { upvotes: 1 } 
            });
        }
        const updatedArticle = await db.collection('articles').findOne({ name });
        res.status(200).send(updatedArticle);
    } else {
        res.status(404).send('Article not found.');
    }  
});
// endpoint to add a comment to an article using mongodb
app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const { email } = req.user;
    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { id: uuidv4(), postedBy: email, text } },
    });
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article);
    } else {
        res.send('That article doesn\'t exist!');
    }
});
// endpoint to get all comments from an article using mongodb
app.get('/api/articles/:name/comments', async (req, res) => {
    const articleName = req.params.name;
    try {
        const article = await db.collection('articles').findOne({ name: articleName });
        if (article) {
            res.status(200).send(article.comments);
        } else {
            res.status(404).send('Article not found.');
        }
    } catch (error) {
        res.status(505).send({ message: 'Error connecting to the database', error });
    }
});
// endpoint to delete a comment from an article using mongodb
app.delete('/api/articles/:name/comments/:id', async (req, res) => {
    const articleName = req.params.name;
    const commentId = req.params.id;
    try {
        const article = await db.collection('articles').findOne({ name: articleName });
        if (article) {
            await db.collection('articles').updateOne({ name: articleName }, { $pull: { comments: { id: commentId } } });
            res.status(200).send(article);
        } else {
            res.status(404).send('Article not found.');
        }
    } catch (error) {
        res.status(505).send({ message: 'Error connecting to the database', error });
    }
});

// Handle all the routes that don't start with /api
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});


connectToDb(() => {
    console.log('Connected to the database');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
