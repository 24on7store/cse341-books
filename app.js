import express from 'express';

const app = express();

//Middleware to parse inconming Json request bodies
app.use (express.json());

//Route route (/get) return,ng a 200 OK Json response
app.get('/', (req, res) => {
    return res.status(200).json({message: 'welcome to the books API' });
});

export default app;