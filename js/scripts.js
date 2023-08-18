let pokemonRepository = (function () {
	let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	function add(pokemon) {
		pokemonList.push(pokemon);
	}
	function getAll() {
		return pokemonList;
	}
    function addListItem(pokemon) {
        let pokemonUnorderedList = document.querySelector(".pokemon-list");
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add("pokemon-button");
        listItem.appendChild(button);
        pokemonUnorderedList.appendChild(listItem);
        button.addEventListener("click", function(e) {
            showDetails(pokemon);
        });
    }
    function showDetails(pokemon) {
        console.log(pokemon.name);
    }
    return {
		add: add,
		getAll: getAll,
        addListItem: addListItem,
        showDetails: showDetails
	};
})();

pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
});