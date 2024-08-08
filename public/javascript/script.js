function openNav() {
    document.getElementById("categoriesSidebar").style.transform = "translateX(0)";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("header").style.marginLeft = "250px";
}
  
function closeNav() {
    document.getElementById("categoriesSidebar").style.transform = "translateX(-100%)";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("header").style.marginLeft = "0";
}

document.getElementById("generateCocktail").addEventListener("click", function(event) {
    event.preventDefault();
    fetch('/random-cocktail')
        .then(response => response.json())
        .then(cocktail => {
            const cocktailDetails = document.getElementById('cocktailDetails');
            cocktailDetails.innerHTML = `
                <h2>${cocktail.strDrink}</h2>
                <img class="img-cocktail" src="${cocktail.strDrinkThumb}/preview" alt="${cocktail.strDrink}" style="width:200px;">
                <p><strong>Category:</strong> ${cocktail.strCategory}</p>
                <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
                <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
                <h3>Ingredients:</h3>
                <ul>
                    ${Array.from({ length: 15 }, (_, i) => i + 1).map(i => cocktail[`strIngredient${i}`] ? `<li>${cocktail[`strIngredient${i}`]} - ${cocktail[`strMeasure${i}`] || ''}</li>` : '').join('')}
                </ul>
            `;
        })
        .catch(error => {
            const cocktailDetails = document.getElementById('cocktailDetails');
            cocktailDetails.innerHTML = `<div class="card"><p>Error: ${error.message}</p></div>`;
        });
});

document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const category = this.dataset.category;
        fetch(`/category/${category}`)
            .then(response => response.json())
            .then(data => {
                console.log("Received data:", data); // Adăugăm acest log
                const cocktails = data.drinks;
                if (!Array.isArray(cocktails)) {
                    throw new Error('Invalid response structure');
                }
                const cocktailDetails = document.getElementById('cocktailDetails');
                cocktailDetails.innerHTML = cocktails.map(cocktail => `
                    <div class="cocktail-card">
                        <h3>${cocktail.strDrink}</h3>
                        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="width:100px;">
                    </div>
                `).join('');
                document.getElementById("cocktailTitle").textContent = `Cocktails in ${category}`;
            })
            .catch(error => {
                console.error("Failed to fetch cocktails:", error); // Adăugăm acest log
                const cocktailDetails = document.getElementById('cocktailDetails');
                cocktailDetails.innerHTML = `<div class="card"><p>Error: ${error.message}</p></div>`;
            });
    });
});