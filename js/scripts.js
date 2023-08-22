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
		button.innerText = pokemon.name;
		button.classList.add("pokemon-button", "show-modal");
		listItem.appendChild(button);
		pokemonUnorderedList.appendChild(listItem);
		button.addEventListener("click", function (e) {
			showDetails(pokemon);
		});
	}
	function loadList() {
		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.results.forEach(function (item) {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url,
					};
					add(pokemon);
				});
			})
			.catch(function (e) {
				console.error(e);
			});
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
			console.log(pokemon);
		});
	}
	function showModal(title, text) {
		let modalContainer = document.querySelector("#modal-container");
		// Clear all existing modal content
		modalContainer.innerHTML = "";
		let modal = document.createElement("div");
		modal.classList.add("modal");
		modalContainer.addEventListener('click', (e) => {
			// Since this is also triggered when clicking INSIDE the modal
			// We only want to close if the user clicks directly on the overlay
			let target = e.target;
			if (target === modalContainer) {
			  hideModal();
			}
		  });

		// Add the new modal content
		let closeButtonElement = document.createElement("button");
		closeButtonElement.classList.add("modal-close");
		closeButtonElement.innerText = "Close";
		closeButtonElement.addEventListener("click", hideModal);

		let titleElement = document.createElement("h1");
		titleElement.innerText = title;

		let contentElement = document.createElement("p");
		contentElement.innerText = text;

		modal.appendChild(closeButtonElement);
		modal.appendChild(titleElement);
		modal.appendChild(contentElement);
		modalContainer.appendChild(modal);
		modalContainer.classList.add("is-visible");
	}
	document.querySelector("#show-modal").addEventListener("click", () => {
		showModal("Modal title", "This is the modal content!");
	});

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
