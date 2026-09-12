import app from './app.js';
import { connectToDb } from './src/db/connect.js';


//retrieve the PORT from environment varaibles
const PORT = process.env.PORT;

//Throw a distant error if the .env file wasn't loaded properly
if (!PORT) {
    throw new Error('CRITICAL: PORT environment variable is missing. Check your .env file setup.');
}

const startServer = async () => {
    try {
        await connectToDb();

        app.listen(PORT, () => {
            console.log(`Server is running successfully on http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error.message);
        process.exit(1);} 
};

startServer();
    
