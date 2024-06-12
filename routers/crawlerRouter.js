const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { Activity } = require('../models');

const router = express.Router();

router.get('/crawl/:activityName', async (req, res) => {
    const activityName = req.params.activityName;
    const formattedActivityName = activityName.split(' ').join('-').toLowerCase();
    const baseURL = 'https://www.fitnessai.com/exercise/';
    const url = `${baseURL}${formattedActivityName}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const activityTitle = $('h1.heading-20').text();
        const proTip = $('div.pro-tip p').text();
        const howToSteps = [];
        $('div.instructions-ex ol li').each((i, el) => {
            howToSteps.push($(el).text());
        });
        const howTo = howToSteps.join(' ');
        const primaryMuscleGroups = $('h1.heading-22').text();
        const muscleImageURL = $('div.collection-item-2 img').attr('src');
        const equipment = $('div.collection-list-3 .paragraph-8').text();

        const newItem = {
            id: formattedActivityName,
            activityTitle,
            proTip,
            howTo,
            primaryMuscleGroups,
            muscleImageURL,
            equipment
        };

        await Activity.create(newItem);
        console.log(`Activity.create(newItem): ${newItem}`);
        res.send(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error occurred during storing data' });
    }
});

module.exports = router;
