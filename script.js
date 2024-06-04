//Recipes Search 
document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 0;
    const resultsPerPage = 10;

    document.getElementById('recipe-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const mealType = document.getElementById('meal-type').value;
        const diet = document.getElementById('diet').value;
        currentPage = 0;
        fetchRecipes(mealType, diet, currentPage);
    });

    document.getElementById('load-more').addEventListener('click', function() {
        const mealType = document.getElementById('meal-type').value;
        const diet = document.getElementById('diet').value;
        currentPage++;
        fetchRecipes(mealType, diet, currentPage);
    });

    async function fetchRecipes(mealType, diet, page) {
        const appId = '24eafdb9'; // Înlocuiește cu propriul tău app_id
        const appKey = '640ab11bb86277d2819c2734e08781de'; // Înlocuiește cu propriul tău app_key
        const from = page * resultsPerPage;
        const to = from + resultsPerPage;
        let url = `https://api.edamam.com/search?q=${mealType}&app_id=${appId}&app_key=${appKey}&from=${from}&to=${to}`;

        if (diet) {
            url += `&diet=${diet}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayRecipes(data.hits, page);
            if (data.hits.length === resultsPerPage) {
                document.getElementById('load-more').style.display = 'block';
            } else {
                document.getElementById('load-more').style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    function displayRecipes(recipes, page) {
        const recipesContainer = document.getElementById('recipes');
        if (page === 0) {
            recipesContainer.innerHTML = '';
        }

        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('col-md-4', 'recipe-card');
            recipeElement.innerHTML = `
                <img src="${recipe.recipe.image}" class="card-img-top" alt="${recipe.recipe.label}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.recipe.label}</h5>
                    <p class="card-text">Calories: ${Math.round(recipe.recipe.calories)}</p>
                    <a href="${recipe.recipe.url}" class="btn btn-primary" target="_blank">View Recipe</a>
                </div>
            `;
            recipeElement.addEventListener('click', () => {
                showRecipeDetails(recipe.recipe);
            });
            recipesContainer.appendChild(recipeElement);
        });
    }

    function showRecipeDetails(recipe) {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h2>${recipe.label}</h2>
            <img src="${recipe.image}" class="img-fluid mb-3" alt="${recipe.label}" />
            <h4>Ingredients</h4>
            <ul>${recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
            <h4>Instructions</h4>
            <p><a href="${recipe.url}" target="_blank">View Full Recipe</a></p>
        `;
        $('#recipeModal').modal('show');
    }
});





