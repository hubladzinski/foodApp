const Recipe = require("../models/recipe");
const User = require("../models/user");
const fetch = require("node-fetch");

exports.get_recipes = async (req, res, next) => {
  try {
    let recipe_list = await Recipe.find().exec();
    res.send(recipe_list);
  } catch (err) {
    return next(err);
  }
};

exports.post_recipe = async (req, res, next) => {
  if ((await Recipe.findOne({ name: req.body.name }).exec()) != null) {
    res.send("Przepis o takiej nazwie już istnieje");
  } else {
    try {
      let recipe = new Recipe({
        name: req.body.name,
        tags: req.body.tags,
        description: req.body.description,
        ingredients: req.body.ingredients,
        preparation: req.body.preparation,
        /* author: req.body.userId, */
      });

      let saveRecipe = await recipe.save();

      res.status(200).json({
        response: "Recipe saved sucessfully",
        recipe: saveRecipe,
      });
    } catch (err) {
      return next(err);
    }
  }
};

exports.get_recipies_edamam = async (req, res) => {
  let params = {
    keyword: req.body.keyword,
    calories: req.body.calories ? `&calories=${req.body.calories}` : "",
    dietLabel: req.body.dietLabel ? `&diet=${req.body.dietLabel}` : "",
    healthLabel: req.body.healthLabel ? req.body.healthLabel : "",
  };

  let healthLabelString = "";
  if (params.healthLabel !== "") {
    params.healthLabel.forEach((label) => {
      healthLabelString += `&health=${label}`;
    });
  }

  let requestUrl = `https://api.edamam.com/search?q=${params.keyword}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&from=0&to=3${healthLabelString}${params.dietLabel}${params.calories}`;

  try {
    let response = await fetch(requestUrl);
    let responseJson = await response.json();
    res.send(responseJson);
  } catch (err) {
    res.send(err);
  }
};
