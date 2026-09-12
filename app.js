import express from 'express';

//1- Import getDB from database connection module
import { getDb} from './src/db/connect.js';

const app = express();

//Middleware to parse incoming Json request bodies
app.use (express.json());

//Route route (/get) return,ng a 200 OK Json response
app.get('/', (req, res) => {
    return res.status(200).json({ message: 'welcome to the books API' });
});

//2- Implement the Get /books to retrieve all books
app.get('/books', async (req, res) => {
    try {
        //Access the database, and target the books collection and convert documents to array
        const books = await getDb()
        .collection('books')
        .find({})
        .toArray();

        //Return the array with a  200 ok status
        return res.status(200).json(books);
    } catch (error)  {
        // Log the actual error message to the console for debugging purpose
        console.error('Failed to retrieve books:', error.message);

        //return a secure 500 error status matching
        return res.status(500).json({ message: 'Failed to retrieve books'});
    }
});


//3- Implement the GET /books/:id to retrieve a single book by its ID
app.get('/books/:id', async (req, res) => {
    try {
        //Capture the dynamic parameter string from the request URL
        const bookID = req.params.id;

        //Use the findOne to search for a custom string matching the id field
        const book = await getDb()
        .collection('books')
        .findOne({ id: bookID});

        // If no book matches that ID string, return a clean 404 client error
        if (!book) {
            return res.status(404).json({ message: 'Book not found'});
        }

        // If a book is found, return it with a 200 OK status
        return res.status(200).json(book);
    } catch (error) {
    console.error('Database Error inside GET /books/:id', error.message);
    return res.status(500).json({ message: 'Internal server error'});
}
});

// //Temporary  GET /trails practice route
// app.get('/trails', async (req, res) => {
//     try {
// //Connect to the DB and parse the trails collection into an array
// const trails = await getDb()
// .collection('trails')
// .find({})
// .toArray();

// //Send the array back to as Json payload
// return res.status(200).json(trails);
// } catch (error) {
//     console.error('Failed to retrieve trails:', error.message);
//     return res.status(500).json({ message: 'Failed to retrieve trails' });
// }
// });


export default app;