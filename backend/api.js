import axios from 'axios';
import { getToken } from './auth.js';

export const makeAPIRequest = async () => {
    const authToken = await getToken();
    if (authToken) {
        try {
            const response = await axios({
                method: 'post',
                url: 'https://atlas.mappls.com/api/places/geocode',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json' // Add 'Content-Type' header
                },
                params: {
                    address: 'Delhi'
                }
            });

            // Handle the response data
            console.log(response.data);
        } catch (error) {
            // Handle the error
            console.error("error");
        }
    } else {
        // Handle the case when the token is not available or failed to generate
        // ...
    }
};