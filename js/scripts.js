let pokemonRepository = (function () {
	let pokemonList = [
		{
			name: "Zubat",
			height: 0.8,
			types: ["Poison", "Flying"],
		},
		{
			name: "Growlithe",
			height: 0.7,
			types: ["Fire"],
		},
		{
			name: "Cubone",
			height: 0.4,
			types: ["Ground"],
		},
		{
			name: "Aerodactyl",
			height: 1.8,
			types: ["Flying", "Rock"],
		},
	];
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