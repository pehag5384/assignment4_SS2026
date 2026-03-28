/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealInfo = document.getElementById('meal-container');

const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
async function fetchRandomMeal() {
  let response = await fetch ('https://www.themealdb.com/api/json/v1/1/random.php');
  let randomMeal = await response.json();
  // console.log(randomMeal)
  return randomMeal
  }

/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/

function getIngrediatArray(mealData) {
  let ingrediantArray = [];

  for (let index = 1; index <= 20; index++){ //øker index med 1 doe hver iterasjon
    // console.log(index);
    //ingrediantArray.push(mealData.strIngredient1)
    //console.log('ingrediant1Test:',mealData.strIngredient1);
    //console.log('tempArray:',ingrediantArray);
    let ingrediant = mealData[`strIngredient${index}`];
    let measure = mealData[`strMeasure${index}`];

    if (ingrediant != '') {
      ingrediantArray.push ({name:ingrediant,measure:measure});
    }
  }
  return ingrediantArray;
  console.log('log array:',ingrediantArray);
}

function displayMealData(meal) {
  //console.log("3", meal.meals[0])

  let data = meal.meals[0];
  let ingrediantsArray = getIngrediatArray(data);
console.log('ingredientsArray: ',ingrediantsArray)

let ingrediantElement = ingrediantsArray.map(ingrediant => `<tr><td>${ingrediant.name}</td> <td>${ingrediant.measure}</td></tr>`) //går igjennom arrayet der ingrediant skriver ingrediensnavn og measure
let elementString = ingrediantElement.join('') //gjør det om til string
  console.log('data:',data);
  mealInfo.innerHTML = `
  <div>
    <h2>${data.strMeal} </h2>
    <img src = '${data.strMealThumb}'>
    <h3>Category:</h3>
    <p>${data.strCategory}</p>
    <h3>Instructions:</h3>
    <p>${data.strInstructions}</p>
    <h3>Ingredients:</h3>
    <table><tbody>${elementString}</tbody></table>
  </div>
  `
}
/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/
function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  return mealCategoryToCocktailIngredient[category] || "cola";
}

/*
Fetch a Cocktail Using a Spirit from TheCocktailDB
Returns Promise that resolves to cocktail object
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
Don't forget encodeURIComponent()
If no cocktails found, fetch random
*/

//Svar Martin
async function fetchCocktailByDrinkIngredient(drinkIngredient) {
    let url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" 
            + encodeURIComponent(drinkIngredient);

  let response = await fetch(url);
  let data = await response.json();
 
  if (data.drinks) {
    return data.drinks[0]; // returner første cocktail
  } else {
    // hvis ingen funnet -> hent tilfeldig
    return fetchRandomCocktail();
  }
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
//Svar Martin
  async function fetchRandomCocktail() {
  let response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
  let data = await response.json();
  return data.drinks[0];
}


/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
  document.getElementById("cocktail-container").innerHTML =
    "<h2>" + cocktail.strDrink + "</h2>";
}

/*
Call init() when the page loads
*/
window.onload = init;
