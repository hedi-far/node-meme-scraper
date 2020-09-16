// import libraries
const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
const download = require('images-downloader').images;
const path = require('path');

// create memes-folder
fs.mkdir(path.join(__dirname, `./memes`), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Directory created successfully!');
});

// download paths to pictures from website via got and cheerio
// declare empty array
const imagesArray = [];

const getMemeUrl = 'https://memegen.link/examples';

got(getMemeUrl)
  .then((response) => {
    const $ = cheerio.load(response.body);

    $('img').each((i, img) => {
      let scrapedMeme = `https://api.memegen.link/images` + img.attribs.src;

      const index = scrapedMeme.lastIndexOf('?');
      if (index > 0) scrapedMeme = scrapedMeme.substring(0, index); // shorten url after '?'

      imagesArray.push(scrapedMeme); //push links into array

      if (imagesArray.length === 10) {
        return false;
      }
    });

    // files will be downloaded to 'memes'
    const dest = './memes';

    download(imagesArray, dest)
      .then((result) => {
        console.log('Images downloaded', result);
      })
      .catch((error) => console.log('downloaded error', error));
  })
  .catch((err) => {
    console.log(err);
  });
