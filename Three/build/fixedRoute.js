
const generate_random_array = (arraySize, min, max) =>
{
	const array = new Array();
	
	for(let i = 0; i < arraySize; i++)
	{
		array.push(Math.random() * (max - min) + min)
	}

	return array;
}


const DP_Refueling_FT = (n, capacity, fuelPrice, fuelToNextStation) =>
{
	const bestToDest = new Array(n).fill(Infinity);
	const nextDest = new Array(n).fill(-1);
	const nextFuel = new Array(n).fill(0);
	
	// Last station
	bestToDest[n-1] = 0;

	for(let i = n-2; i >= 0; i--)
	{
		let fuelused = 0;
		for(let j = i + 1; j < n; j++)
		{
			fuelused += fuelToNextStation[j-1];
			if(fuelused > capacity) {break;}
			if(fuelPrice[j] * fuelused + bestToDest[j] < bestToDest[i])
			{
				bestToDest[i] = fuelPrice[j] * fuelused + bestToDest[j];
				nextDest[i] = j;
				nextFuel[i] = fuelused;
			}
		}
		//console.log(nextDest);
		//console.log(bestToDest);
	}

	const optimalPath = new Array();

	let currentStation = 0;

	while(nextDest[currentStation] > 0)
	{
		currentStation = nextDest[currentStation];
		optimalPath.push(currentStation);
	}

	return new Array(optimalPath, bestToDest[0]);
}

const GreedyRefueling = (n, capacity, fuelPrice, fuelToNextStation) =>
{
	const greedyPath = new Array();
	let cost = 0;
	let fuelUsed = 0;

	for(let i = 0; i < n - 1; i++)
	{
		
		if(fuelUsed + fuelToNextStation[i] > capacity)
		{
			cost += fuelUsed * fuelPrice[i];
			greedyPath.push(i);
			fuelUsed = 0;
		}

		fuelUsed += fuelToNextStation[i];
	}

	cost += fuelUsed * fuelPrice[n-1];
	greedyPath.push(n-1);


	return new Array(greedyPath, cost);
}



export {generate_random_array, DP_Refueling_FT, GreedyRefueling}