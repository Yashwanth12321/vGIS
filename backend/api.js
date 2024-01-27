import axios from 'axios';
import fs from 'fs';

import { getToken } from './auth.js';
const REST_KEY=process.env.REST_KEY;

export const makeAPIRequest = async () => {
    const authToken = await getToken();

    if (authToken) {
        try {
            const response = await axios.request({
                method: 'get',
                url: ' https://apis.mapmyindia.com/advancedmaps/v1/'+REST_KEY+'/still_image',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'image/png' // Add 'Content-Type' header
                },
                params: {
                    center: '28.5959394,77.2255611'
                },
                responseType: 'arraybuffer' // Make sure the response type is arraybuffer

            });

            // Handle the response data
            fs.writeFile('output.png', response.data, (err) => {
                if (err) throw err;
                console.log('Image saved!');
            });
        } catch (error) {
            // Handle the error
            console.error("error");
        }
    } else {
        console.log("No token found",authToken);
    }
};