const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
let selectedDrinks = [];
const fetchDrinks = async (searchText = '') => {
  try {
    const response = await fetch(`${API_URL}${searchText}`);
    const data = await response.json();
    return data.drinks || []; 
  } catch (error) {
    console.error('Error fetching drinks:', error);
    return [];
  }
};


const limitText = (text, max = 15) =>
  text.length > max ? text.slice(0, max) + '...' : text;


const renderDrinks = (drinks) => {
  drinkContainer.innerHTML = ''; 

  if (drinks.length === 0) {
    drinkContainer.innerHTML = '<p class="text-danger">No drinks found.</p>';
    return;
  }

  drinks.slice(0, 8).forEach((drink) => {
    const card = document.createElement('div');
    card.className = 'col-md-6';

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}">
        <div class="card-body">
          <h5 class="card-title">${drink.strDrink}</h5>
          <p class="card-text"><strong>Category:</strong> ${drink.strCategory}</p>
          <p class="card-text"><strong>Instructions:</strong> ${limitText(drink.strInstructions)}</p>
          <button class="btn btn-success me-2" onclick='addToGroup("${drink.strDrink}")'>Add to Group</button>
          <button class="btn btn-info" onclick='showDetails(${JSON.stringify(drink).replace(/"/g, '&quot;')})'>Details</button>
        </div>
      </div>
    `;
    drinkContainer.appendChild(card);
  });
};

const addToGroup = (drinkName) => {
  if (selectedDrinks.length >= 7) {
    alert('You can only add up to 7 drinks!');
    return;
  }

  if (selectedDrinks.includes(drinkName)) return;

  selectedDrinks.push(drinkName);
  updateGroupUI();
};

const updateGroupUI = () => {
  selectedGroup.innerHTML = '';

  selectedDrinks.forEach((name) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = name;
    selectedGroup.appendChild(li);
  });

  groupCount.textContent = selectedDrinks.length;
};

const showDetails = (drink) => {
  modalTitle.textContent = drink.strDrink;
  modalBody.innerHTML = `
    <p><strong>Category:</strong> ${drink.strCategory}</p>
    <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
    <p><strong>Glass:</strong> ${drink.strGlass}</p>
    <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
    <p><strong>Ingredient 1:</strong> ${drink.strIngredient1 || 'N/A'}</p>
    <p><strong>Ingredient 2:</strong> ${drink.strIngredient2 || 'N/A'}</p>
  `;
  drinkModal.show(); 
};

searchBtn.addEventListener('click', () => {
  const searchText = searchInput.value.trim();
  fetchDrinks(searchText).then(renderDrinks);
});

window.addEventListener('DOMContentLoaded', () => {
  fetchDrinks().then(renderDrinks);
});
