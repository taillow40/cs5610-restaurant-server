import axios from 'axios';

function YelpRoutes(app) {
  const search = async (req, res) => {
    const {
      term,
      location
    } = req.query;

    var params = {};
    if (term != 'null') params.term = term;
    if (location != 'null') {
      params.location = location;
    } else {
      params.location = 'Boston';
    }
    try {
      const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
        headers: {
          Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        },
        params: params,
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  app.get("/api/yelp/search", search);
}

export default YelpRoutes;