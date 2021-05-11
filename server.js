const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

const express = require('express');
const app = express();
app.set('view engine', 'ejs');


app.get('/', async (request, response) => {
  
  // grab austrian vaccine data
  let vaccineCSV = await fetch('https://info.gesundheitsministerium.gv.at/data/timeline-eimpfpass.csv')
  let csv = await vaccineCSV.text();

  let lines = csv.split('\n');
  let lastLine = lines[lines.length - 1];
  let vaccineRate = lastLine.split(';')[7]; // 7 two vaccines, 9 one vaccine
  console.log('Vaccine rate:', vaccineRate);
  
  // get movie data
  let movieData = await fetch('https://cdn.glitch.com/83df72a2-dfa3-4f64-8e14-d1aba00fd736%2Fdata.json?v=1587165281149');
  let movies = await movieData.json();
  
  // get movie with "vaccine rating"
  movies = movies.filter(m => m.averageRating == Math.round(vaccineRate / 10));
  let randomMovie = movies[Math.floor(Math.random() * movies.length)];
  console.log(randomMovie);
  
  
  // get movie info from IMDB
  let imdbPage = await fetch('https://www.imdb.com/title/' + randomMovie.tconst);
  let html = await imdbPage.text();
  let dom = new JSDOM(html);
  let movie = {
    image: dom.window.document.querySelector('.poster img').src,
    title: dom.window.document.querySelector('.title_wrapper h1').textContent
  }
  console.log(movie);

  // render HTML
  response.render('index', {
    vaccinationRate: Math.round(vaccineRate),
    movie: movie
  });
});


const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});