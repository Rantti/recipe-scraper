'use strict';
const { JSDOM } = require('jsdom');
const axios = require('axios');
const { isValidUrl } = require('./util/url.js');

const [url] = process.argv.slice(2);

if (!url) {
    console.error('No url given! :( \nUsage: node index.js [url to scrape]');
    process.exit(1);
}

if (!isValidUrl(url)) {
    console.error(`Given URL "${url}" does not seem like a correct url`);
    process.exit(1);
}

async function getReciperByUrl(url) {
    try {
        console.log('Fetching page...');
        const { data } = await axios.get(url);
        console.log('Fetched succesfully');
        const dom = new JSDOM(data, { url });
        const { document } = dom.window;
        const articles = document.querySelectorAll('article');
        const recipes = [];
        articles.forEach((article) => {
            const title = article.querySelector('[property="dc:title"]');
            if (title) {
                const summary = article.querySelector(
                    '.field-name-field-summary p'
                );
                const cookingTime = article.querySelector(
                    '.field-name-field-recipe-cooking-time-text .field-items div'
                );
                const servings = article.querySelector(
                    '.field-name-field-recipe-servings-text .field-items div'
                );
                const difficulty = article.querySelector(
                    '.field-name-field-recipe-difficulty .field-items div'
                );
                const ingredientsEl = article.querySelectorAll(
                    '.field-name-field-recipe-items .recipe-items__item'
                );
                const ingredients = ingredientsEl
                    ? [...ingredientsEl].reduce((result, ingredientEl) => {
                          const amount = ingredientEl.querySelector(
                              '.field-name-field-recipe-item-amount .field-item'
                          );
                          const unit = ingredientEl.querySelector(
                              '.field-name-field-recipe-item-unit .field-item'
                          );
                          const ingredient = ingredientEl.querySelector(
                              '.field-name-field-recipe-item-ingredient .field-item'
                          );
                          if (!amount && !unit && !ingredient) {
                              return result;
                          }
                          result.push(
                              `${amount ? amount.textContent : ''}${
                                  unit ? unit.textContent : 'kpl'
                              } ${ingredient ? ingredient.textContent : ''}`
                          );
                          return result;
                      }, [])
                    : [];

                const instructionsEl = article.querySelectorAll('.field-name-field-recipe-instructions ol li p');
                const instructions = instructionsEl ? [...instructionsEl].map(row => row.textContent): [];

                const recipe = {
                    title: title.textContent,
                    summary: summary ? summary.textContent : 'NA',
                    cookingTime: cookingTime ? cookingTime.textContent : 'NA',
                    servings: servings ? servings.textContent : 'NA',
                    difficulty: difficulty ? difficulty.textContent : 'NA',
                    ingredients,
                    instructions,
                };

                recipes.push(recipe);
            }
        });

        return recipes;
    } catch (error) {
        throw error;
    }
}

getReciperByUrl(url).then((res) => {
    console.log('done!!');
    console.log(res);
});
