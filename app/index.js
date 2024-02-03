const server = require('./server');
require('dotenv').config();

const PORT = process.env.NODE_LOCAL_PORT || 3300;

// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`));
