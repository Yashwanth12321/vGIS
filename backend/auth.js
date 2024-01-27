import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load the environment variables from .env file

export const getToken = async () => {
    let authToken = fs.readFileSync('authToken.txt', 'utf8'); // Read the auth token from the file
    let expirationTime = fs.readFileSync('expirationTime.txt', 'utf8'); // Read the expiration time from the file

    // Check if a valid token exists and if it has not expired
    if (authToken && Date.now() < Number(expirationTime)) {
        console.log('Using existing auth token:', authToken);
        return authToken;
    }

    try {
        const response = await axios.post('https://outpost.mappls.com/api/security/oauth/token', null, {
            params: {
                grant_type: 'client_credentials',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        authToken = response.data.access_token; // Get the new auth token
        expirationTime = Date.now() + (response.data.expires_in * 1000); // Calculate the new expiration time
        fs.writeFileSync('authToken.txt', authToken); // Write the new auth token to the file
        fs.writeFileSync('expirationTime.txt', expirationTime.toString()); // Write the new expiration time to the file

        console.log('New auth token generated:', authToken);
        return authToken;
    } catch (error) {
        console.error('Error getting auth token:', error.response ? error.response.data : error.message);
        return null;
    }
};
