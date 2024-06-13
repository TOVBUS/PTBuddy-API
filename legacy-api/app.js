const sync = require('./models/sync');
// const express = require('express');
// const morgan = require('morgan');
// const dotenv = require('dotenv');
// dotenv.config();
// const port = process.env.PORT || 3000;
// const app = express();

// const muscleImageRouter = require('./routers/muscleImageRouter');
// const openai = require('./routers/openaiRouter');
// const crawlerRouter = require('./routers/crawlerRouter');
// const activityRouter = require('./routers/activityRouter');

// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/ai', openai);
// app.use('/muscle-image', muscleImageRouter);
// app.use('/crawler', crawlerRouter);
// app.use('/activity', activityRouter);

// app.use((_, res) => {
//   res.status(404).json({ success: false, token: '', message: '요청이 잘못됨' });
// });
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

const muscleImageRouter = require('./routers/muscleImageRouter');
const openai = require('./routers/openaiRouter');
const crawlerRouter = require('./routers/crawlerRouter');
const activityRouter = require('./routers/activityRouter');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ai', openai);
app.use('/crawler', crawlerRouter);
app.use('/activity', activityRouter);

app.use((_, res) => {
  res.status(404).json({ success: false, token: '', message: '요청이 잘못됨' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const sync = require('./models/sync');
// sync(); // 데이터베이스 동기화
