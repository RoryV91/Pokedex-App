//IIFE
let pokemonRepository = (function () {
	//VAR
	let pokemonList = [];
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=151";
	//PUSH TO LIST
	function add(pokemon) {
		pokemonList.push(pokemon);
	}
	function getAll() {
		return pokemonList;
	}
	//FOR EACH POKéMON BUTTON
	function addListItem(pokemon) {
		let pokemonUnorderedList = document.querySelector(".pokemon-list");
		let listItem = document.createElement("li");
		let button = document.createElement("button");
		button.innerText =
			`#${pokemon.id}` +
			"\n" +
			capitalizeFirstLetter(replaceGenderSymbols(pokemon.name)) +
			"\n";
		button.classList.add("pokemon-button", "show-modal");
		listItem.appendChild(button);
		pokemonUnorderedList.appendChild(listItem);
		button.addEventListener("click", function (e) {
			showDetails(pokemon);
		});
	}
	//LIST OF POKéMON FROM API
	function loadList() {
		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.results.forEach(function (item) {
					let pokemon = {
						name: item.name,
						id: item.url.split("/")[6],
						detailsUrl: item.url,
					};
					add(pokemon);
				});
			})
			.catch(function (e) {
				console.error(e);
			});
	}
	//LOAD DETAILS FOR ONE POKéMON
	function loadDetails(item) {
		let url = item.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (details) {
				item.frontImageUrl = details.sprites.front_default;
				item.height = details.height;
				item.weight = details.weight;
				item.types = details.types;
				item.id = details.id;
				item.abilities = details.abilities;
				item.stats = details.stats;
			})
			.catch(function (e) {
				console.error(e);
			});
	}
	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon);
		});
	}
	function showModal(pokemon) {
		let modalContainer = document.querySelector("#modal-container");
		modalContainer.innerHTML = "";
		let modal = document.createElement("div");
		modal.classList.add("modal");
		modalContainer.addEventListener("click", (e) => {
			let target = e.target;
			if (target === modalContainer) {
				hideModal();
			}
		});

		// MODAL
		let closeButtonContainer = document.createElement("div");
		closeButtonContainer.classList.add("modal-close");
		let closeIconElement = document.createElement("img");
		closeIconElement.setAttribute("src", "./img/close-icon.svg");
		closeIconElement.setAttribute("class", "close-btn-svg");
		closeIconElement.setAttribute("alt", "Close");
		closeIconElement.addEventListener("click", hideModal);
		closeButtonContainer.appendChild(closeIconElement);

		//CONTENT ELEMENTS FOR MODAL

		//DISPLAY POKéMON NAME
		let titleElement = document.createElement("h1");
		titleElement.setAttribute("class", "pokemon-name");
		titleElement.innerText = replaceGenderSymbols(
			capitalizeFirstLetter(pokemon.name)
		);

		//DISPLAY POKéMON NUMBER
		let idElement = document.createElement("p");
		idElement.classList.add("modal-id");
		idElement.innerText = pokemon.id;

		//PRIMARY IMAGE
		let imageElement = document.createElement("img");
		imageElement.classList.add("pokemon-image");
		imageElement.src = pokemon.frontImageUrl;

		//DISPLAY POKéMON TYPES
		let typesElement = document.createElement("p");
		typesElement.textContent =
			"Types: " +
			pokemon.types
				.map((type) => capitalizeFirstLetter(type.type.name))
				.join(", ");
		typesElement.setAttribute("class", "pokemon-types");

		//DISPLAY POKéMON ABILITIES
		let abilitiesElement = document.createElement("p");
		abilitiesElement.classList.add("pokemon-abilities");
		let abilitiesText =
			"Abilities: " +
			pokemon.abilities
				.map((ability) => capitalizeFirstLetter(ability.ability.name))
				.join(", ");
		abilitiesElement.textContent = abilitiesText;
		modal.appendChild(abilitiesElement);

		//DISPLAY POKéMON STATS
		let statsTableElement = document.createElement("table");
		pokemon.stats.forEach((stat) => {
			let statsRow = document.createElement("tr");
			let statNameCell = document.createElement("td");
			let statValueCell = document.createElement("td");
			statNameCell.textContent = capitalizeFirstLetter(stat.stat.name);
			statValueCell.textContent = stat.base_stat;
			statNameCell.classList.add("stat-name-cell");
			statValueCell.classList.add("stat-value-cell");
			statsRow.appendChild(statNameCell);
			statsRow.appendChild(statValueCell);
			statsTableElement.appendChild(statsRow);
		});
		statsTableElement.setAttribute("class", "pokemon-stats");
		let statsContainer = document.createElement("div");
		statsContainer.classList.add("stats-container");
		statsContainer.appendChild(statsTableElement);

		//PUT CONTENT ON MODAL
		modal.appendChild(closeButtonContainer);
		modal.appendChild(idElement);
		modal.appendChild(titleElement);
		modal.appendChild(imageElement);
		modal.appendChild(typesElement);
		modal.appendChild(statsContainer);
		modal.appendChild(abilitiesElement);

		//PUT THE MODAL ON THE PAGE
		modalContainer.appendChild(modal);
		modalContainer.classList.add("is-visible");
	}
	//TEXT FORMATTING

	// CAPITALIZE FIRST LETTER OF DATA FROM API
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	//INCLUDE GENDER SYMBOLS
	function replaceGenderSymbols(name) {
		return name
			.replace(/-m(?!.)$/, " ♂")
			.replace(/-f(?!.)$/, " ♀")
			.replace(/(?<=[a-z])-/, " ");
	}

	//CLOSE MODAL
	function hideModal() {
		let modalContainer = document.querySelector("#modal-container");
		modalContainer.classList.remove("is-visible");
	}
	window.addEventListener("keydown", (e) => {
		let modalContainer = document.querySelector("#modal-container");
		if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
			hideModal();
		}
	});
	//IIFE FUNCTIONS
	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		showDetails: showDetails,
		loadList: loadList,
		loadDetails: loadDetails,
		showModal: showModal,
		hideModal: hideModal,
		replaceGenderSymbols: replaceGenderSymbols,
		capitalizeFirstLetter: capitalizeFirstLetter,
	};
})();
//CALL IIFE
pokemonRepository.loadList().then(function () {
	pokemonRepository.getAll().forEach(function (pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
