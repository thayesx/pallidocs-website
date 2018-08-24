// Initialize requirements
let express = require("express");
let sass = require("node-sass-middleware");

// Initialize variables
let path = "site/";

// Run Server: runs all server tasks
let runServer = function() {
  // Setup server
  let server = express();
  server.listen(process.env.PORT || 3000, () => console.log('Pallidocs website running on ' + (process.env.PORT? process.env.PORT : "3000")));

  // Compile SASS
  server.use(
    sass({
      src: path,
      dest: path + "css/",
      debug: true,
      outputStyle: "compressed",
      prefix: "/css/",
    })
  );

  // Start Express static
  server.use(express.static(path));

  // Load base HTML
  server.get('/', (req, res) => {
    res.sendFile(path + 'index.html');
  });
};

// Run server
runServer();
