import app from './app.js';

//retrieve the PORT from environment varaibles
const PORT = process.env.PORT;

//Throw a distant error if the .env file wasn't loaded properly
if (!PORT) {
    throw new Error('CRITICAL: PORT environment variable is missing. Check your .env file setup.');
}

    //Start listening for network traffic
    app.listen(PORT, () => {
        console.log(`Server is running sucessfully on http://127.0.0.1:${PORT}`);
    });
    
