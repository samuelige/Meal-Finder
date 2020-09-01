const submit = document.getElementById('submit'),
    search = document.getElementById('search'),
    random = document.getElementById('random'),
    resultHeading = document.getElementById('result-heading'),
    mealElement = document.getElementById('meals'),
    singleMeal = document.getElementById('single-meal');

    searchMeal = ((e) => {
        e.preventDefault();

        //Clear Meal
        singleMeal.innerHTML = '';
        
        // Get Search Items
        const mainItem = search.value;

        search.value = '';
        
        // Check if the search input is empty
        mainItem.trim() ? fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mainItem}`)
          .then(res => res.json())
          .then(data => {console.log(data); 
            resultHeading.innerHTML = `<h2>Search result "${mainItem}" :</h2>`;
            data.meals === null ? resultHeading.innerHTML = `<p>There are no search results. Try again!</P>` 
            : mealElement.innerHTML =data.meals.map(meal => `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
            `)
            .join('');
        }) 
            : alert('Please fill text fields');
        
    });

    // Fetch meal by ID
    getMealById = (mealID) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
    }
    // Fetch Random meal fro API
    getRandomMeal = () => {
        // Clear meals and heading
        mealElement.innerHTML = '';
        resultHeading.innerHTML = '';
        fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
           const meal = data.meals[0];
           addMealToDOM(meal);
        });
    }
    // Add meal to Dom
    addMealToDOM = (meal) => {
        const ingredients = [];

        for(let i = 1; i <= 20; i++){
            if(meal[`strIngredient${i}`]){
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            }else {
                break; 
            }
        }
        singleMeal.innerHTML =`
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul
            </div>
        </div>
        `;  
        
    }

// Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealElement.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        // item.classList ?  item.classList.contains('meal-info') :  false;
        if(item.classList){
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    // console.log(mealInfo);
     
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});