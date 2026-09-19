import {
  getAllBooksModel,
  getBookByIdModel,
  createBookModel,
  updateBookModel,
  deleteBookModel,
  authorExistsModel
} from '../models/books.js';

export const getAllBooks = async (req, res) => {
  try {
    const books = await getAllBooksModel();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books.' });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await getBookByIdModel(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book.' });
  }
};

export const createBook = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    if (!id || !authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields.' });
    }

    const existingBook = await getBookByIdModel(id);
    if (existingBook) {
      return res.status(400).json({ message: 'Book id already exists.' });
    }

    const validAuthor = await authorExistsModel(authorId);
    if (!validAuthor) {
      return res.status(400).json({ message: 'authorId does not match an existing author.' });
    }

    const createdBook = await createBookModel({ id, authorId, title, publicationDate });
    return res.status(201).json(createdBook);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create book.' });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate } = req.body;

    if (!authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields.' });
    }

    const existingBook = await getBookByIdModel(id);
    if (!existingBook) return res.status(404).json({ message: 'Book not found.' });

    const validAuthor = await authorExistsModel(authorId);
    if (!validAuthor) {
      return res.status(400).json({ message: 'authorId does not match an existing author.' });
    }

    const updatedBook = await updateBookModel(id, { authorId, title, publicationDate });
    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update book.' });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBook = await getBookByIdModel(id);
    if (!existingBook) return res.status(404).json({ message: 'Book not found.' });

    await deleteBookModel(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete book.' });
  }
};
