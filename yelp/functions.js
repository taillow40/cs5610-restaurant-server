import axios from 'axios';
export const restaurantFromId = async (id) => {
    try {
        const response = await axios.get(`https://api.yelp.com/v3/businesses/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.YELP_API_KEY}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}