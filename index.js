//import libraries
const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');
const { images } = require('images-downloader');
const download = require('images-downloader').images;

//Create memes-folder
fs.mkdir('./memes', function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('New directory successfully created.');
  }
});

//download paths to pictures from website via got and cheerio

let imagesArray = []; //declare empty array

const getMemeUrl = 'https://memegen.link/examples';

got(getMemeUrl)
  .then((response) => {
    const $ = cheerio.load(response.body);

    $('img').each((i, img) => {
      let scrapedMeme = `https://api.memegen.link/images` + img.attribs.src;

      index = scrapedMeme.lastIndexOf('?');
      if (index > 0) scrapedMeme = scrapedMeme.substring(0, index); //shorten url after '?'

      imagesArray.push(scrapedMeme); //push links into array

      if (imagesArray.length === 10) {
        return false;
      }
    });

    //console.log(imagesArray);

    //files will be downloaded to 'memes'
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
