// IIFE
let pokemonRepository = (function () {
	// VAR
	let pokemonList = [];
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=551";
	// PUSH TO LIST
	function add(pokemon) {
		pokemonList.push(pokemon);
	}
	function getAll() {
		return pokemonList;
	}
	// FOR EACH POKéMON BUTTON
	function addListItem(pokemon) {
		let pokemonList = document.querySelector(".pokemon-list");
		let listItem = document.createElement("li");
		listItem.classList.add(
			"col-12",
			"col-sm-6",
			"col-md-4",
			"col-lg-3",
			"mb-3",
			"list-unstyled",
			"text-center"
		);

		let button = document.createElement("button");
		button.innerText =
			`#${pokemon.id}` +
			"\n" +
			capitalizeFirstLetter(replaceGenderSymbols(pokemon.name)) +
			"\n";
		button.classList.add(
			"pokemon-button",
			"show-modal",
			"btn-block",
			"btn-secondary"
		);

		listItem.appendChild(button);
		pokemonList.appendChild(listItem);

		button.addEventListener("click", function (e) {
			showDetails(pokemon, button);
		});
	}

	// LIST OF POKéMON FROM API
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
	// LOAD DETAILS FOR ONE POKéMON
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
	function showDetails(pokemon, triggeringButton) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon, triggeringButton);
		});
	}
	function showModal(pokemon, triggeringButton) {
		// CREATE MODAL
		let modal = document.createElement("div");
		modal.classList.add("modal", "fade", "border");
		modal.id = "pokemonModal";
		modal.setAttribute("tabindex", "-1");
		modal.setAttribute("aria-labelledby", "exampleModalLabel");
		modal.setAttribute("aria-hidden", "true");

		// CREATE MODAL DIALOG
		let modalDialog = document.createElement("div");
		modalDialog.classList.add("modal-dialog");

		// CREATE MODAL CONTENT
		let modalContent = document.createElement("div");
		modalContent.classList.add("modal-content");

		// DETERMINE POKéMON TYPE(S)
		const types = pokemon.types.map((type) => type.type.name);

		// Set the background color of the modal content
		if (types.length === 1) {
			modalContent.style.backgroundColor = `var(--${types[0]}-color)`;
		} else {
			const typeColors = types.map((type) => `var(--${type}-color)`);
			const gradientBg = `linear-gradient(45deg, ${typeColors.join(", ")})`;
			modalContent.style.backgroundImage = gradientBg;
		}

		// CREATE MODAL HEADER
		let modalHeader = document.createElement("div");
		modalHeader.classList.add("modal-header");
		modalContent.appendChild(modalHeader);

		// DISPLAY POKÉMON NUMBER
		let idElement = document.createElement("p");
		idElement.classList.add("modal-id", "mr-auto");
		idElement.innerText = `#${pokemon.id}`;
		modalHeader.appendChild(idElement);

		// MODAL TITLE
		let modalTitle = document.createElement("h5");
		modalTitle.classList.add("modal-title", "pokemon-name", "mx-auto");
		modalTitle.innerText = capitalizeFirstLetter(
			replaceGenderSymbols(pokemon.name)
		);
		modalHeader.appendChild(modalTitle);

		// CLOSE BUTTON
		let closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.classList.add("close");
		closeButton.setAttribute("data-dismiss", "modal");
		closeButton.setAttribute("aria-label", "Close");
		closeButton.innerHTML = "&times;";
		modalHeader.appendChild(closeButton);

		// MODAL BODY
		let modalBody = document.createElement("div");
		modalBody.classList.add("modal-body");

		// DISPLAY PRIMARY POKÉMON IMAGE
		let imageElement = document.createElement("img");
		imageElement.classList.add("pokemon-image", "mx-auto", "d-block", "border", "mb-3");
		imageElement.src = pokemon.frontImageUrl;
		modalBody.appendChild(imageElement);

		// DISPLAY POKÉMON TYPES
		let typesElement = document.createElement("p");
		typesElement.classList.add("pokemon-types");
		typesElement.textContent =
			"Types: " +
			pokemon.types
				.map((type) => capitalizeFirstLetter(type.type.name))
				.join(", ");
		modalBody.appendChild(typesElement);

		// DISPLAY POKÉMON ABILITIES
		let abilitiesElement = document.createElement("p");
		abilitiesElement.classList.add("pokemon-abilities");
		abilitiesElement.textContent =
			"Abilities: " +
			pokemon.abilities
				.map((ability) => capitalizeFirstLetter(ability.ability.name))
				.join(", ");
		modalBody.appendChild(abilitiesElement);

		// DISPLAY POKÉMON STATS
		let statsTableElement = document.createElement("table");
		statsTableElement.classList.add("table");
		statsTableElement.classList.add("table-bordered");
		let statsTableBody = document.createElement("tbody");
		statsTableElement.appendChild(statsTableBody);

		pokemon.stats.forEach((stat) => {
			let statsRow = document.createElement("tr");
			statsTableBody.appendChild(statsRow);

			let statNameCell = document.createElement("td");
			statNameCell.textContent = capitalizeFirstLetter(stat.stat.name);
			statsRow.appendChild(statNameCell);

			let statValueCell = document.createElement("td");
			statValueCell.textContent = stat.base_stat;
			statsRow.appendChild(statValueCell);
		});

		// APPEND TO MODAL
		modalBody.appendChild(statsTableElement);
		modalContent.appendChild(modalBody);
		modalDialog.appendChild(modalContent);
		modal.appendChild(modalDialog);

		// APPEND MODAL
		let modalContainer = document.querySelector("#modal-container");
		modalContainer.innerHTML = "";
		modalContainer.appendChild(modal);

		// FOCUS ON FIRST ELEMENT WHEN MODAL IS SHOWN
		$(modal).on("shown.bs.modal", function () {
			idElement.focus();
		});

		// RETURN FOCUS TO TRIGGERING BUTTON WHEN MODAL IS HIDDEN
		$(modal).on("hidden.bs.modal", function () {
			triggeringButton.focus();
		});

		// SHOW MODAL
		$(modal).modal("show");
	}
	  

	// CLOSE MODAL
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

	// TEXT FORMATTING

	// CAPITALIZE FIRST LETTER OF DATA FROM API
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	//INCLUDE GENDER SYMBOLS
	function replaceGenderSymbols(name) {
		if (name === "mr-mime") {
			return "Mr. Mime";
		} else {
			return name
				.replace(/-m(?!.)$/, " ♂")
				.replace(/-f(?!.)$/, " ♀")
				.replace(
					/(^\w+)-(\w+)/,
					(match, p1, p2) =>
						`${capitalizeFirstLetter(p1)} ${capitalizeFirstLetter(p2)}`
				);
		}
	}

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
