// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const { Activity } = require('../models/activity');
// require('dotenv').config();
// const router = express.Router();

// const exerciseTitles = ['straight-arm-bent-knee-crunch', 'starfish-crunch', 'cocoon', 'straight-leg-raise-hold', 'crunch', 'reverse-crunch', 'knee-tuck', 'frog-crunch', 'leg-raise', 'plank', 'straight-leg-raise-to-knee-tuck', 'superman-push-up', 'air-bike', 'straight-leg-raise-with-hip-lift', 'sit-up', 'alternating-straight-leg-raise', 'rope-crunch', 'band-crunch', 'kneeling-band-crunch', 'weighted-decline-crunch', 'lying-crunch-machine', 'overhead-crunch-machine', 'crunch-machine', 'band-reverse-crunch-with-hip-raise', 'weighted-hanging-leg-raise-to-knee-tuck', 'cable-seated-crunch', 'weighted-twisting-crunch', 'kneeling-cable-crunch', 'hanging-oblique-knee-tuck', 'parallel-bar-twisting-leg-raise', 'decline-crunch', 'stability-ball-crunch', 'stability-ball-rollout', 'incline-straight-leg-raise', 'assisted-straight-leg-raise', 'hanging-straight-leg-raise', 'stability-ball-sit-up', 'hanging-knee-tuck', 'decline-twist', 'ab-wheel-rollout', 'parallel-bar-straight-leg-raise-hold', 'incline-reverse-crunch', 'sliding-floor-bridge-curl', 'straight-leg-raise-to-knee-tuck-on-bench', 'band-air-bike', 'cable-side-bend', 'cable-oblique-crunch', 'cable-twist', 'weighted-twisting-crunch', 'side-plank', 'elbow-to-knee-sit-up', 'wipers', 'frog-crunch', 'air-bike', 'band-air-bike', 'cocoon', 'elbow-to-knee-sit-up', 'side-plank-hip-adduction', 'elbow-to-knee-crunch', 'oblique-crunch', 'dumbbell-pylo-squat', 'dumbbell-iron-cross', 'seated-lateral-raise', 'lateral-raise', 'cable-upright-row', 'rope-face-pull', 't-bar-row-machine', 'reverse-push-up', 'incline-barbell-row', 'inverted-row', 'cable-seated-rear-lateral-raise', 'cable-crossover-reverse-fly', 'bent-knee-inverted-row', 'reverse-fly-machine-with-overhand-grip', 'reverse-fly-machine-with-parallel-grip', 'band-reverse-fly', 'cable-crossover-row', 'band-face-pull', 'dumbbell-high-shrug', 'smith-machine-shrug', 'cable-shrug', 'ez-bar-upright-row'];

// router.get('/crawl-and-save', async (req, res) => {
//     for (const title of exerciseTitles) {
//         const formattedActivityName = title.replace(/\s+/g, '-').toLowerCase();
//         const baseURL = 'https://www.fitnessai.com/exercise/';
//         const url = `${baseURL}${formattedActivityName}`;

//         try {
//             const { data } = await axios.get(url);
//             const $ = cheerio.load(data);

//             const activityTitle = $('h1.heading-20').text();
//             const proTip = $('div.pro-tip p').text();
//             const howToSteps = [];
//             $('div.instructions-ex ol li').each((i, el) => {
//                 howToSteps.push($(el).text());
//             });
//             const howTo = howToSteps.join(' ');
//             const primaryMuscleGroups = $('h1.heading-22').text();
//             const muscleImageURL = $('div.collection-item-2 img').attr('src');
//             const equipment = $('div.collection-list-3 .paragraph-8').text();
//             const videoURL = $('video source[type="video/mp4"]').attr('src');

//             const newItem = {
//                 id: formattedActivityName,
//                 activityTitle,
//                 proTip,
//                 howTo,
//                 primaryMuscleGroups,
//                 muscleImageURL,
//                 equipment,
//                 videoURL
//             };

//             await Activity.create(newItem);
//             console.log(`Activity.create(newItem): ${newItem}`);
//             res.send(newItem);

//         } catch (error) {
//             console.error(`Error with ${formattedActivityName}: ${error}`);
//             continue;  // 오류 발생 시 다음 항목으로 계속
//         }
//     }
//     res.send('Completed processing all activities');
// });

// module.exports = router;

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { Activity } = require('../models');
require('dotenv').config();
const router = express.Router();

const exerciseTitles = [
  'straight-arm-bent-knee-crunch', 'starfish-crunch', 'cocoon', 'straight-leg-raise-hold', 'crunch', 'reverse-crunch', 'knee-tuck', 'frog-crunch', 'leg-raise', 'plank', 'straight-leg-raise-to-knee-tuck', 'superman-push-up', 'air-bike', 'straight-leg-raise-with-hip-lift', 'sit-up', 'alternating-straight-leg-raise', 'rope-crunch', 'band-crunch', 'kneeling-band-crunch', 'weighted-decline-crunch', 'lying-crunch-machine', 'overhead-crunch-machine', 'crunch-machine', 'band-reverse-crunch-with-hip-raise', 'weighted-hanging-leg-raise-to-knee-tuck', 'cable-seated-crunch', 'weighted-twisting-crunch', 'kneeling-cable-crunch', 'hanging-oblique-knee-tuck', 'parallel-bar-twisting-leg-raise', 'decline-crunch', 'stability-ball-crunch', 'stability-ball-rollout', 'incline-straight-leg-raise', 'assisted-straight-leg-raise', 'hanging-straight-leg-raise', 'stability-ball-sit-up', 'hanging-knee-tuck', 'decline-twist', 'ab-wheel-rollout', 'parallel-bar-straight-leg-raise-hold', 'incline-reverse-crunch', 'sliding-floor-bridge-curl', 'straight-leg-raise-to-knee-tuck-on-bench', 'band-air-bike', 'cable-side-bend', 'cable-oblique-crunch', 'cable-twist', 'weighted-twisting-crunch', 'side-plank', 'elbow-to-knee-sit-up', 'wipers', 'frog-crunch', 'air-bike', 'band-air-bike', 'cocoon', 'elbow-to-knee-sit-up', 'side-plank-hip-adduction', 'elbow-to-knee-crunch', 'oblique-crunch', 'dumbbell-pylo-squat', 'dumbbell-iron-cross', 'seated-lateral-raise', 'lateral-raise', 'cable-upright-row', 'rope-face-pull', 't-bar-row-machine', 'reverse-push-up', 'incline-barbell-row', 'inverted-row', 'cable-seated-rear-lateral-raise', 'cable-crossover-reverse-fly', 'bent-knee-inverted-row', 'reverse-fly-machine-with-overhand-grip', 'reverse-fly-machine-with-parallel-grip', 'band-reverse-fly', 'cable-crossover-row', 'band-face-pull', 'dumbbell-high-shrug', 'smith-machine-shrug', 'cable-shrug', 'ez-bar-upright-row'
];

router.get('/crawl-and-save', async (req, res) => {
    for (const title of exerciseTitles) {
        const formattedActivityName = title.replace(/\s+/g, '-').toLowerCase();
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
            const videoURL = $('video source[type="video/mp4"]').attr('src');

            const newItem = {
                id: formattedActivityName,
                activityTitle,
                proTip,
                howTo,
                primaryMuscleGroups,
                muscleImageURL,
                equipment,
                videoURL
            };

            await Activity.create(newItem);
            console.log(`Activity.create(newItem): ${newItem}`);

        } catch (error) {
            console.error(`Error with ${formattedActivityName}: ${error}`);
            continue;  // 오류 발생 시 다음 항목으로 계속
        }
    }
    res.send('Completed processing all activities');
});

module.exports = router;
