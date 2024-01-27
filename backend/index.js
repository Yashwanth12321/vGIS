// index.js
import { makeAPIRequest } from './api.js';
import { getToken } from './auth.js';

// Use the imported functions in your code
const main = async () => {
    const authToken = await getToken();
    if (authToken) {
        await makeAPIRequest();
    } else {
        // Handle the case when the token is not available or failed to generate
        // ...
    }
};

main(); // Call the main function to start the program