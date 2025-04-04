

function createNetwork() {

    const stations = [];
    const edges = [];

    const max = -100;
    const min = 100;

    const minDistance = 15;

    for (var i = 0; i < 10; i++) {
        const x = Math.random() * (max - min)
        const y = Math.random() * (max - min) + min

        for (let station of stations) {
            const dist = Math.sqrt(Math.pow(x - station.x, 2) + Math.pow(y - station.y, 2))
            console.log(i);

            if (dist < minDistance) {
                i--;
                console.log("Too close");
                continue;
            }
        }


        stations.push({ x, y });
    }

    console.log(stations);


    return stations;
}


export { createNetwork };