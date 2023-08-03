let pokemonList = [
    {
        name: 'Zubat', 
        height: 0.8,
        types: [
            'Poison', 
            'Flying'
        ],
    },
    {
        name: 'Growlithe',
        height: 0.7,
        types: [
            'Fire'
        ]
    },
    {
        name: 'Cubone',
        height: 0.4,
        types: [
            'Ground'
        ]
    },
    {
        name: 'Aerodactyl',
        height: 1.8,
        types: [
            'Flying',
            'Rock'
        ]
    }

]
for (let i=0; i<pokemonList.length; i++) {
    if (pokemonList[i].height > 1.0) {
           document.write(pokemonList[i].name + "." + ` Height: ${pokemonList[i].height}` + " Wow, that’s big!"+ "<br>") 
    } else {
        document.write(pokemonList[i].name + "." + ` Height: ${pokemonList[i].height}` +  "<br>")
    }

}