import { getDb } from '../db/connect.js';

const COLLECTION_NAME = 'books';

export const getAllBooksModel = async () => {
  const db = getDb();
  return await db.collection(COLLECTION_NAME).find({}).toArray();
};

export const getBookByIdModel = async (id) => {
  const db = getDb();
  return await db.collection(COLLECTION_NAME).findOne({ id });
};

export const createBookModel = async (bookData) => {
  const db = getDb();
  await db.collection(COLLECTION_NAME).insertOne(bookData);
  return bookData;
};

export const updateBookModel = async (id, updateData) => {
  const db = getDb();
  await db.collection(COLLECTION_NAME).updateOne({ id }, { $set: updateData });
  return { id, ...updateData };
};

export const deleteBookModel = async (id) => {
  const db = getDb();
  const result = await db.collection(COLLECTION_NAME).deleteOne({ id });
  return result.deletedCount > 0;
};

// Relational Check: Confirms the target author exists before touching books
export const authorExistsModel = async (authorId) => {
  const db = getDb();
  const author = await db.collection('authors').findOne({ id: authorId });
  return !!author;
};
