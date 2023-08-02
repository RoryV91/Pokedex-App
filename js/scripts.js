let pokémonList = [
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
    }

]
for (let i=0; i<pokémonList.length; i++) {
    document.write(pokémonList[i].name + "." + "<br>")
}