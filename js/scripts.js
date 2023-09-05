// IIFE
let pokemonRepository = (function () {
	// GLOBAL VARIABLES
	let pokemonList = [];
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=1010";

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
		let thumbnail = document.createElement("img");
		thumbnail.setAttribute("src", pokemon.thumbnailUrl);
		thumbnail.setAttribute("alt", `${capitalizeFirstLetter(replaceGenderSymbols(pokemon.name))} thumbnail`);	
		button.innerText =
			`#${pokemon.id}` +
			"\n" +
			capitalizeFirstLetter(replaceGenderSymbols(pokemon.name)) +
			"\n";
		
		button.classList.add("pokemon-button", "btn-block");

		// ADD DATA
		button.setAttribute("data-toggle", "modal");
		button.setAttribute("data-target", "#pokemonModal");

		button.appendChild(thumbnail);
		listItem.appendChild(button);
		pokemonList.appendChild(listItem);

		button.addEventListener("click", function (e) {
			showDetails(pokemon, button);
		});
	}
	// PRELOAD THUMBNAIL IMAGES
	function preloadThumbnailImage(url) {
		return new Promise((resolve, reject) => {
		  const img = new Image();
		  img.src = url;
		  img.onload = resolve;
		  img.onerror = reject;
		});
	  }
	  
	// LIST OF POKéMON FROM API
// JavaScript (update the text as the loading progresses)
async function loadList() {
    // Show the loading spinner
    const loadingSpinner = document.getElementById('loading-spinner');
    const spinnerText = document.querySelector('.spinner-text');
    loadingSpinner.style.display = 'block';

    try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        const totalPokemon = json.results.length;
        let loadedPokemon = 0;

        for (const item of json.results) {
            // Preload the thumbnail image
            await preloadThumbnailImage(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.split("/")[6]}.png`);

            const pokemon = {
                name: item.name,
                id: item.url.split("/")[6],
                detailsUrl: item.url,
                thumbnailUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.split("/")[6]}.png`,
            };
            add(pokemon);

            // Update the loading text
            loadedPokemon++;
            const percentage = Math.round((loadedPokemon / totalPokemon) * 100);
            spinnerText.textContent = `${percentage}%`;
        }

        // Hide the loading spinner when loading is complete
        loadingSpinner.style.display = 'none';
    } catch (e) {
        console.error(e);
        // Hide the loading spinner in case of an error
        loadingSpinner.style.display = 'none';
    }
}

	  
	// LOAD DETAILS FOR ONE POKéMON
	function loadDetails(item) {
		let url = item.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (details) {
				item.frontImageUrl =
					details.sprites.other["official-artwork"].front_default;
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
		let modalContainer = document.querySelector("#modal-container");
		if ($(".modal.show").length > 0) {
			$(".modal.show").modal("hide");
		}

		// CREATE MODAL
		let modal = document.createElement("div");
		modal.classList.add("modal", "fade", "custom-border");
		modal.id = `pokemonModal-${pokemon.id}`;
		modal.setAttribute("tabindex", "-1");
		modal.setAttribute("aria-labelledby", "exampleModalLabel");
		modal.setAttribute("aria-hidden", "true");

		// CREATE MODAL DIALOG
		let modalDialog = document.createElement("div");
		modalDialog.classList.add("modal-dialog");

		// CREATE MODAL CONTENT
		let modalContent = document.createElement("div");
		modalContent.classList.add("modal-content", "custom-border");

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
		modalHeader.classList.add("modal-header", "custom-border");
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
		imageElement.classList.add(
			"pokemon-image",
			"mx-auto",
			"d-block",
			"border",
			"mb-3"
		);
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
		modalContainer.appendChild(modal);

		// FOCUS ON FIRST ELEMENT WHEN MODAL IS SHOWN
		$(modal).on("shown.bs.modal", function () {
			idElement.focus();
		});

		// RETURN FOCUS TO TRIGGERING BUTTON WHEN MODAL IS HIDDEN
		$(modal).on("hidden.bs.modal", function () {
			modal.remove();
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

// DARK MODE SWITCH
function toggleDarkMode() {
	const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const darkModeToggle = document.getElementById("dark-mode-toggle");
  
	// SET CHECKED PROPERTY BASED ON USER PREFERENCE
	darkModeToggle.checked = prefersDarkMode;
  
	if (prefersDarkMode) {
	  document.documentElement.style.setProperty(
		"--background",
		"var(--background-dark)"
	  );
	  document.documentElement.style.setProperty("--text", "var(--text-dark)");
	} else {
	  document.documentElement.style.setProperty(
		"--background",
		"var(--background-light)"
	  );
	  document.documentElement.style.setProperty("--text", "var(--text-light)");
	}
  }
  
  toggleDarkMode();
  
  // DARK MODE SWITCH LISTENER
  window.matchMedia("(prefers-color-scheme: dark)").addListener(toggleDarkMode);
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  
  darkModeToggle.addEventListener("change", function () {
	if (this.checked) {
	  // ENABLE
	  document.documentElement.style.setProperty(
		"--background",
		"var(--background-dark)"
	  );
	  document.documentElement.style.setProperty("--text", "var(--text-dark)");
	} else {
	  // DISABLE
	  document.documentElement.style.setProperty(
		"--background",
		"var(--background-light)"
	  );
	  document.documentElement.style.setProperty("--text", "var(--text-light)");
	}
  });
  

	// TEXT FORMATTING

	// CAPITALIZE FIRST LETTER OF DATA FROM API
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	//INCLUDE GENDER SYMBOLS (AND EXCEPTIONS FOR MR. MIME, MR. RIME, MIME JR.)
	function replaceGenderSymbols(name) {
		if (name === "mr-mime") {
			return "Mr. Mime";
		} else if (name === "mr-rime") {
			return "Mr. Rime";
		} else if (name === "mime-jr") {
			return "Mime Jr.";
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

	// PAGE NAVIGATION

	// EVENT LISTENER FOR NAVBAR
	document.querySelectorAll(".nav-link").forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();

			const sectionId = this.getAttribute("data-section");
			const section = document.querySelector(`#${sectionId}`);

			if (section) {
				section.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	});

	// EVENT LISTENER FOR DROPDOWN MENU
	const generationLinks = document.querySelectorAll(".generation-link");
	generationLinks.forEach(function (genLink) {
		genLink.addEventListener("click", function (e) {
			e.preventDefault();

			// FIND FIRST POKéMON OF GENERATION
			const offset = genLink.getAttribute("data-offset");
			const buttons = document.querySelectorAll(".pokemon-button");
			const buttonToFocus = buttons[offset];
			if (buttonToFocus) {
				const navHeight = document.querySelector(".navbar").offsetHeight;
				const buttonPosition = buttonToFocus.getBoundingClientRect().top;
				const scrollPosition = window.scrollY + buttonPosition - navHeight;

				window.scrollTo({
					top: scrollPosition,
					behavior: "smooth",
				});

				setTimeout(() => {
					buttonToFocus.focus();
				}, 500);
			}
		});
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

// CALL IIFE

document.addEventListener("DOMContentLoaded", function () {
    pokemonRepository.loadList().then(function () {
        pokemonRepository.getAll().forEach(function (pokemon) {
            pokemonRepository.addListItem(pokemon);
        });
    });
});
