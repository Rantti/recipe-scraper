# Recipe Scraper

Yet another recipe-unifying tool for making the ultimate cooking book.

Scrape recipes from different sites using JSDOM. This tool is developed in hopes of producing a library for creating scrapers for different sites to parse different meal recipes.

Fundamental flow of how this works.
- Install this tool on your machine or use it with npx
- Pass this tool a configuration for scraping the site and a url to fetch the data from
- The tool will attempt to create a recipe by fetching the url contents, then by using the instructions from the config, reads the contents on the page for producing a recipe
- This tool could be combined with a webcrawler to produce a database of recipes from multiple sites

## Requirements
- Node v12
- Internet access

## Installation
- Clone the project
- Run `npm run install`
