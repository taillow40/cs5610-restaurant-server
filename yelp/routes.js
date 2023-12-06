import axios from 'axios';
function YelpRoutes(app){
    const search = async (req, res) => {
        const { term, location } = req.query;
        try {
          const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
            headers: {
              Authorization: `Bearer ${process.env.YELP_API_KEY}`,
            },
            params: {
              term,
              location,
            },
          });
          res.json(response.data);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }

      app.get("/api/yelp/search", search);
}

export default YelpRoutes;