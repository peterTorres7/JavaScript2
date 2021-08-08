let games = [
    { name : "assasin'screed", console : "playstation", genre: "fantasy", hours : 99 },
    { name : "supermario", console : "nintendo", genre: "kids", hours : 40 },
    { name : "halo", console : "xbox", genre: "shooting", hours : 10 },
    { name : "dragonball", console : "playstation", genre: "fighting", hours : 20 },
    { name : "callofduty", console : "xbox", genre: "rpg", hours : 50 }
];

const getAll = () => {
    return games;
}

const getItem = (name) => {
    return games.find((game) => {
        return game.name === name;
    });
};

//add delete item route

export { getAll, getItem };
