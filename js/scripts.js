let pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=151";
	function add(pokemon) {
		pokemonList.push(pokemon);
	}
	function getAll() {
		return pokemonList;
	}
	function addListItem(pokemon) {
		let pokemonUnorderedList = document.querySelector(".pokemon-list");
		let listItem = document.createElement("li");
		let button = document.createElement("button");
		let display = pokemon.name.replace("-m", " ♂").replace("-f", " ♀");
		button.innerText =
			`#${pokemon.id}` +
			"\n" +
			display.charAt(0).toUpperCase() +
			display.slice(1);
		button.classList.add("pokemon-button", "show-modal");
		listItem.appendChild(button);
		pokemonUnorderedList.appendChild(listItem);
		button.addEventListener("click", function (e) {
			showDetails(pokemon);
		});
	}
	async function loadList() {
		try {
			const response = await fetch(apiUrl);
			const json = await response.json();
			const pokemonPromises = json.results.map(async function (item) {
				let pokemon = {
					name: item.name,
					id: item.id,
					detailsUrl: item.url,
				};
				await loadDetails(pokemon);
				add(pokemon);
				return pokemon;
			});

			// Wait for all promises to resolve before adding list items
			const pokemonArray = await Promise.all(pokemonPromises);

			// Now add list items for each pokemon
			pokemonArray.forEach(function (pokemon) {
				addListItem(pokemon);
			});
		} catch (e) {
			console.error(e);
		}
	}
	function loadDetails(item) {
		let url = item.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (details) {
				item.imageUrl = details.sprites.front_default;
				item.height = details.height;
				item.weight = details.weight;
				item.types = details.types;
				item.id = details.id;
			})
			.catch(function (e) {
				console.error(e);
			});
	}
	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon.name, pokemon.id, pokemon.imageUrl);
		});
	}
	function showModal(title, text, imageUrl) {
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

		// Add the new modal content
		let closeIconElement = document.createElement("img");
		closeIconElement.classList.add("modal-close");
		closeIconElement.setAttribute("src",  "/img/close-icon.svg");
		closeIconElement.setAttribute("alt", "Close");
		closeIconElement.addEventListener("click", hideModal);

		let titleElement = document.createElement("h1");
		titleElement.setAttribute("class", "pokemon-name");
		titleElement.innerText = title;

		let idElement = document.createElement("p");
		idElement.classList.add("modal-id");
		idElement.innerText = text;

		let imageElement = document.createElement("img");
		imageElement.classList.add("pokemon-image");
		imageElement.src = imageUrl;

		modal.appendChild(closeIconElement);
		modal.appendChild(idElement);
		modal.appendChild(titleElement);
		modal.appendChild(imageElement);

		modalContainer.appendChild(modal);
		modalContainer.classList.add("is-visible");
	}

	function hideModal() {
		let modalContainer = document.querySelector("#modal-container");
		modalContainer.classList.remove("is-visible");
	}

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		showDetails: showDetails,
		loadList: loadList,
		loadDetails: loadDetails,
		showModal: showModal,
		hideModal: hideModal,
	};
})();

pokemonRepository.loadList().then(function () {
	pokemonRepository.getAll().forEach(function (pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
