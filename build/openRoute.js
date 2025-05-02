
const generate_random_array = (arraySize, min, max) =>
{
	const array = new Array();
	
	for(let i = 0; i < arraySize; i++)
	{
		array.push(Math.random() * (max - min) + min)
	}

	return array;
}

/*

For each ordered pair of stations u and v in the transportation network G, 
determine the minimal refueling cost of starting at u (with a full tank) and reaching v 
with exactly one refueling operation at v.  
Note that the refueling cost is infinity if the shortest path from u to v requires more than a full tank of gas. 
Otherwise, the cost is the price at v times the amount of fuel required by the shortest path from u to v.

Construct a new graph G' whose vertices are the vertices (stations) in G. For each ordered pair of stations u and v, there is an edge and the distance (cost) of the edge from u to v is the minimal refueling cost determined in I above.

Solve the all-pairs shortest path problem on G'. (See the details in the module on the foundational algorithms for the all-pairs shortest path problem.) 

Now we can determine the optimal refueling plan from any given station u to station v in the following way.
	Find the shortest path p' from u to v in G'. The vertices (stations) in the path are the vertices that we should stop and fuel.
	Transform the path p' from u to v in G' to a path p from u to v in G in the following way: for each edge (s, t) in the path p, replace the edge by the shortest path from s to to t in G.
	This path p is the refueling path to take from u to v in G.

 */


const OpenRoute = (stations, edges, n, capacity, fuelPrice) => {

    const G = Array.from({ length: n }, () => Array(n).fill(Infinity));
    

    for (const [station, edge] of Object.entries(edges)) {
        for (const e of edge) {
            //console.log(e);
            const dy = stations[station].y - stations[e].y;
            const dx = stations[station].x - stations[e].x;
            G[station][e] = Math.sqrt(dx * dx + dy * dy);
            G[e][station] = Math.sqrt(dx * dx + dy * dy);
            
        }
    }
    console.log(G);

    

    // Step 1: Compute all-pairs shortest paths in original graph G using Dijkstra from each node
    const shortestPaths = Array.from({ length: n }, () => Array(n).fill(Infinity));

    const dijkstra = (start) => {
        const dist = Array(n).fill(Infinity);
        dist[start] = 0;
        const visited = Array(n).fill(false);
        for (let i = 0; i < n; i++) {
            let u = -1;
            for (let j = 0; j < n; j++) {
                if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
            }
            if (dist[u] === Infinity) break;
            visited[u] = true;
            for (let v = 0; v < n; v++) {
                if (G[u][v] !== Infinity && dist[u] + G[u][v] < dist[v]) {
                    dist[v] = dist[u] + G[u][v];
                }
            }
        }
        return dist;
    };

    // Compute shortest paths from every node
    for (let i = 0; i < n; i++) {
        shortestPaths[i] = dijkstra(i);
    }

    // Step 2: Build the new graph G' with edge costs based on refueling cost at destination
    const GPrime = Array.from({ length: n }, () => Array(n).fill(Infinity));
    for (let u = 0; u < n; u++) {
        for (let v = 0; v < n; v++) {
            const fuelNeeded = shortestPaths[u][v];
            // Only allow if the path from u to v is possible with a full tank
            if (fuelNeeded <= capacity) {
                // Refueling cost is fuel needed * price at v
                GPrime[u][v] = fuelNeeded * fuelPrice[v];
            }
        }
    }

    // Step 3: Run Floyd-Warshall on G' to compute all-pairs shortest paths
    const distGPrime = Array.from({ length: n }, (_, i) => GPrime[i].slice());
    const next = Array.from({ length: n }, () => Array(n).fill(null));

    // Initialize next for path reconstruction
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (distGPrime[i][j] < Infinity) {
                next[i][j] = j;
            }
        }
    }

    // Standard Floyd-Warshall triple loop
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (distGPrime[i][k] + distGPrime[k][j] < distGPrime[i][j]) {
                    distGPrime[i][j] = distGPrime[i][k] + distGPrime[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }

    // Step 4: Reconstruct path in G' from u to v using "next" pointers
    const reconstructPathGPrime = (u, v) => {
        if (next[u][v] === null) return [];
        const path = [u];
        while (u !== v) {
            u = next[u][v];
            path.push(u);
        }
        return path;
    };

    // Step 5: Store original shortest paths (predecessor) for transforming G' path to G path
    const predecessors = Array.from({ length: n }, () => Array(n).fill(null));

    for (let u = 0; u < n; u++) {
        const dist = Array(n).fill(Infinity);
        dist[u] = 0;
        const prev = Array(n).fill(null);
        const visited = Array(n).fill(false);

        // Dijkstra again but with path tracking for u
        for (let i = 0; i < n; i++) {
            let node = -1;
            for (let j = 0; j < n; j++) {
                if (!visited[j] && (node === -1 || dist[j] < dist[node])) node = j;
            }
            if (dist[node] === Infinity) break;
            visited[node] = true;
            for (let v = 0; v < n; v++) {
                if (G[node][v] !== Infinity && dist[node] + G[node][v] < dist[v]) {
                    dist[v] = dist[node] + G[node][v];
                    prev[v] = node;
                }
            }
        }

        // Save the reconstructed shortest path from u to every v
        for (let v = 0; v < n; v++) {
            let path = [];
            let cur = v;
            while (cur !== null) {
                path.unshift(cur);
                cur = prev[cur];
            }
            predecessors[u][v] = path;
        }
    }

    // Given two nodes u, v, get the actual shortest path in G
    const reconstructShortestPathG = (u, v) => predecessors[u][v];

    // Final step: transform the abstract refueling path in G' to the full detailed path in G
    const reconstructFullPath = (u, v) => {
        const pathInGPrime = reconstructPathGPrime(u, v);
        const fullPath = [];
        for (let i = 0; i < pathInGPrime.length - 1; i++) {
            const from = pathInGPrime[i];
            const to = pathInGPrime[i + 1];
            const subpath = reconstructShortestPathG(from, to);
            if (i > 0) subpath.shift(); // Avoid duplicate nodes
            fullPath.push(...subpath);
        }

        edges = []

        for (let i = 0; i < fullPath.length - 1; i++) {

            edges.push([fullPath[i], fullPath[i + 1]]);
        }

        return edges;
    };

    // Return an interface with useful functions
    return {
        getFuelCost: (u, v) => distGPrime[u][v],                    // Total minimal fuel cost
        getRefuelingStations: (u, v) => reconstructPathGPrime(u, v), // Where to refuel
        getFullPath: (u, v) => reconstructFullPath(u, v)             // Actual route through G
    };
};


export {generate_random_array, OpenRoute}