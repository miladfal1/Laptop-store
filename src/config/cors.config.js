const cors = require("cors");

const corsOptions = {
  origin: "http://localhost", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true, 
};

module.exports = (app) => {
  app.use(cors(corsOptions));
};
