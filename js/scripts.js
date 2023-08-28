document.addEventListener("DOMContentLoaded", function () {
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
		//VAR
		let pokemonUnorderedList = document.querySelector(".pokemon-list");
		let listItem = document.createElement("li");
		let button = document.createElement("button");
		//TEXT FORMATTING
		let display = pokemon.name.replace("-m", " ♂").replace("-f", " ♀");
		button.innerText =
			`#${pokemon.id}` +
			"\n" +
			display.charAt(0).toUpperCase() +
			display.slice(1) + "\n";
		//ADD SMALL IMAGE
		let tinyImage = document.createElement("img");
		tinyImage.src = pokemon.frontImageUrl;
		tinyImage.alt = `${pokemon.name} Image`;
		button.appendChild(tinyImage)
		button.classList.add("pokemon-button", "show-modal");
		listItem.appendChild(button);
		pokemonUnorderedList.appendChild(listItem);
		button.addEventListener("click", function (e) {
			showDetails(pokemon);
		});
	}
	//LIST OF POKéMON FROM API
	async function loadList() {
		try {
			const response = await fetch(apiUrl);
			const json = await response.json();
			const pokemonPromises = json.results.map(async function (item) {
				let pokemon = {
					name: item.name,
					id: item.url.split('/')[6],
					detailsUrl: item.url,
				};
				await loadDetails(pokemon);
				add(pokemon);
				return pokemon;
			});

			// WAIT FOR PROMISES TO RESOLVE
			const pokemonArray = await Promise.all(pokemonPromises);

			// NOW, ADD POKéMON
			pokemonArray.forEach(function (pokemon) {
				addListItem(pokemon);
			});
		} catch (e) {
			console.error(e);
		}
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
			})
			.catch(function (e) {
				console.error(e);
			});
	}
	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon.name, pokemon.id, pokemon.frontImageUrl);
		});
	}
	function showModal(title, text, frontImageUrl) {
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
		closeIconElement.setAttribute("src", "/img/close-icon.svg");
		closeIconElement.setAttribute("class", "close-btn-svg");
		closeIconElement.setAttribute("alt", "Close");
		closeIconElement.addEventListener("click", hideModal);
		closeButtonContainer.appendChild(closeIconElement);
		//CONTENT ELEMENTS FOR MODAL
		let titleElement = document.createElement("h1");
		titleElement.setAttribute("class", "pokemon-name");
		//MORE TEXT FORMATTING
		let capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
		titleElement.innerText = capitalizedTitle.replace('-m', ' ♂').replace('-f', ' ♀');

		let idElement = document.createElement("p");
		idElement.classList.add("modal-id");
		idElement.innerText = text;

		let imageElement = document.createElement("img");
		imageElement.classList.add("pokemon-image");
		imageElement.src = frontImageUrl;

		//PUT THEM ON A MODAL
		modal.appendChild(closeButtonContainer);
		modal.appendChild(idElement);
		modal.appendChild(titleElement);
		modal.appendChild(imageElement);

		//PUT THE MODAL ON THE PAGE
		modalContainer.appendChild(modal);
		modalContainer.classList.add("is-visible");
	}
	
	//CLOSE BUTTON
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
});