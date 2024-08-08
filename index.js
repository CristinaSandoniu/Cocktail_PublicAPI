import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

// Setare motor de șabloane EJS
app.set('view engine', 'ejs');

// Setare director pentru fișierele statice
app.use(express.static('public'));

app.get("/", async (req, res) => {
    try {
      const cocktailResponse = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        const cocktail = cocktailResponse.data.drinks[0];
        
        const categoriesResponse = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list");
        const categories = categoriesResponse.data.drinks;

        res.render("index.ejs", { data: cocktail, categories });
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("index.ejs", {
        error: error.message,
      });
    }
  });

  app.get('/category/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
        const cocktails = response.data.drinks;
        console.log("API response:", response.data); 
        if (!Array.isArray(cocktails)) {
            throw new Error('Invalid response structure');
        }
        res.json(cocktails);
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500).json({ error: error.message });
    }
});

  app.get('/random-cocktail', async (req, res) => {
    try {
        const response = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        const cocktail = response.data.drinks[0];
        res.json(cocktail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
