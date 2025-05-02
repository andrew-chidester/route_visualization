function createNetwork() {

    const stations = [];
    const edges = {};

    const max = -100;
    const min = 100;

    const minDistance = 15;

    stations.push({ x: 0, y: 0 });

    for (var i = 1; i < 9; i++) {
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

    stations.push({ x: -200, y: 0 });

    
    for (var i = 0; i < 10; i++) {
        let connected = false;
        var singleEdge = []
        for (var j = 0; j < 10; j++) {
            if (i == j) continue;
            if ((i == 0 && j == 9) || (i == 9 && j == 0)) continue;

            if (Math.random() < 0.4) {
                singleEdge.push(j);
                connected = true;
            }
        }
        if (!connected) {
            let ran = Math.floor(Math.random() * 10);
            while (ran == i) {
                ran = Math.floor(Math.random() * 10);
            }

            singleEdge.push(ran);
        }
        edges[i] = singleEdge;

    }

    console.log(edges);


    return { stations, edges };
}


export { createNetwork };