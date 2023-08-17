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
        button.innerHTML = pokemon.name;
        button.classList.add("pokemon-button");
        listItem.appendChild(button);
        pokemonUnorderedList.appendChild(listItem);
    }
    return {
		add: add,
		getAll: getAll,
        addListItem: addListItem
	};
})();

pokemonRepository.add({
	name: "Scyther",
	height: 1.5,
	types: ["Bug", "Flying"],
});

pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
});