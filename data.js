const fetch = require('node-fetch');
const fs = require('fs');



(async () => {
  
  // 1. download tsv
  let file = await fetch('https://cdn.glitch.com/09ca286b-ae66-4ba3-ac0e-da42bc699861%2Fdata.tsv?v=1620661068028');
  file = await file.text();  

  // 2. convert tsv to javascript object
  file = file.split('\n');
  let data = file.map(line => {
    line = line.split('\t');
    return {
      tconst: line[0],
      averageRating: line[1],
      numVotes: line[2]
    }
  });  
  
  let results = [];
  
  // 3. for every rate (1.0, 1.1, 1.2, ... 10.0)
  for (let i = 10; i <= 100; i++) {
    let rating = i / 10; // 1.5

    // 3.5 filter only current rating
    let filtered = data.filter(l => l.averageRating == rating);
    
    // 4. sort by numVotes
    let sorted = filtered.sort((a, b) => b.numVotes - a.numVotes);
    console.log(sorted[0]);

    // 5. save top 10 movies
    sorted = sorted.slice(0, 50);
    results = results.concat(sorted);
  }

  // 6. save results
  console.log(results.length);
  fs.writeFileSync('movie-data.json', JSON.stringify(results));
})();