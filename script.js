const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal'),
  areafood = document.getElementById('areafood');

// Search meal and fetch from API
function searchMeal(e) {
  mealsEl.removeEventListener('click', categoriesSearch)
  mealsEl.addEventListener('click', (e) => {
    const elem = e.path.find((item) => item.className === 'meal-info')
    if(elem) {
      getMealById(elem.dataset.mealid)
    }
  })
  e.preventDefault();
  fetch(`https://themealdb.com/api/json/v1/1/search.php?s=${search.value}`)
  .then((response) => response.json())
  .then((data) => {
    if (data.meals === null) {
      resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
      single_mealEl.innerHTML = ''
    } else {
      resultHeading.innerHTML = `<h2>Results for '${search.value}':<h2>`;
      search.value = ''
      single_mealEl.innerHTML = ''
      mealsEl.innerHTML = data.meals
        .map(
          meal => `
        <div class="meal">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <div class="meal-info" data-mealID="${meal.idMeal}">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      `
        )
        .join('');
    }
  });
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
  .then(response => response.json())
  .then((data) => {
    const meal = data.meals[0]
    addMealToDOM(meal)
  })
}

// Fetch random meal from API
function getRandomMeal() {
  mealsEl.innerHTML = ''
  resultHeading.innerHTML = ''
  fetch(`https://themealdb.com/api/json/v1/1/random.php`)
  .then(response => response.json())
  .then((data) => {
    const meal = data.meals[0]
    addMealToDOM(meal)
  })
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if(meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    } else {
      break
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h2>${meal.strMeal}</h2>
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
        </ul>
      </div>
    </div>
  `;
}

submit.addEventListener('submit', (e) => {
  e.preventDefault()
  if(search.value.trim() === '') {
    mealsEl.innerHTML = ''
    single_mealEl.innerHTML = ''
    resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
  } else {
    searchMeal(e)
  }
})

random.addEventListener('click', getRandomMeal)


fetch('https://themealdb.com/api/json/v1/1/categories.php')
.then(response => response.json())
.then(data => {
  mealsEl.addEventListener('click', categoriesSearch)
  resultHeading.innerHTML = `<h2>All categories<h2>`;
    mealsEl.innerHTML = data.categories
        .map(
          meal => `
        <div class="meal">
          <img src="${meal.strCategoryThumb}" alt="${meal.strCategory}" />
          <div class="meal-info" data-mealID="${meal.idCategory}">
            <h3>${meal.strCategory}</h3>
          </div>
        </div>
      `
        )
        .join('');
})

function categoriesSearch(e) {
  mealsEl.removeEventListener('click', categoriesSearch)
  const elem = e.path.find((item) => item.className === 'meal-info')
    if(elem) {
      fetch(`https://themealdb.com/api/json/v1/1/filter.php?c=${elem.childNodes[1].innerHTML}`)
      .then(response => response.json())
      .then((data) => {
        mealsEl.innerHTML = data.meals
          .map(
            meal => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
        `
          )
          .join('');
      })
      mealsEl.addEventListener('click', (e) => {
        const elem = e.path.find((item) => item.className === 'meal-info')
        if(elem) {
          getMealById(elem.dataset.mealid)
          mealsEl.innerHTML=""
          resultHeading.innerHTML =""
        }
      })
    }
}

// find element by area
function getMealByArea(area) {
  mealsEl.removeEventListener('click', categoriesSearch)
  fetch(`https://themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  .then(response => response.json())
  .then(data => {
    mealsEl.innerHTML = data.meals
          .map(
            meal => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
        `
          )
          .join('')
          resultHeading.innerHTML =`<h2>${area} meal</h2>`
          mealsEl.addEventListener('click', (e) => {
            const elem = e.path.find((item) => item.className === 'meal-info')
            if(elem) {
              getMealById(elem.dataset.mealid)
              mealsEl.innerHTML=""
              resultHeading.innerHTML =""
            }
          })
  })
}

areafood.addEventListener('click', (e) => {
  if(e.target.tagName == 'IMG') {
    getMealByArea(e.target.dataset.area)
  }
})