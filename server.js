const express = require('express');

const app = express();
const PORT = 1234;

app.use(express.static('docs'));

app.listen(PORT, () => {
  console.log(`Wooster is listening on port ${PORT}.`);
})