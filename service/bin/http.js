const http = require('../app.js');
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
