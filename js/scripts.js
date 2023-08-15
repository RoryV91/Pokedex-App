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
	return {
		add: add,
		getAll: getAll,
	};
})();

pokemonRepository.add({
	name: "Scyther",
	height: 1.5,
	types: ["Bug", "Flying"],
});

pokemonRepository.getAll().forEach(function (pokemon) {
	if (pokemon.height > 1.0) {
		document.write(
			pokemon.name +
				"." +
				` Height: ${pokemon.height}` +
				" Wow, that’s big!" +
				"<br>"
		);
	} else {
		document.write(pokemon.name + "." + ` Height: ${pokemon.height}` + "<br>");
	}
});
