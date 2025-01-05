const helmet = require("helmet");
const logger = require("../config/winston.config"); 

const helmetConfig = (env) => {
  try {
    if (env === "development") {
      logger.info("Helmet configured for development environment.");
      return helmet({
        contentSecurityPolicy: {
          directives: {
            scriptSrc: ["'self'", "'unsafe-inline'"], //limit xss and csp
          },
        },
      });
    } else {
      logger.info("Helmet configured for production environment.");
      return helmet({
        contentSecurityPolicy: {
          directives: {
            scriptSrc: ["'self'"], //limit scripts to server scipts only
          },
        },
        frameguard: { action: "deny" }, // jologiri az bargozari site dar frame yek site digar be manzoore mahdood kardan click jacking
        xssFilter: true, //mahdood kardan X-XSS baraye moroogarhaie ghadimi
        hsts: { // ejbar kardan moroogar be estefade az https
          maxAge: 31536000, 
          includeSubDomains: true, 
          preload: true,
        },
        noSniff: true, //MIME-type sniffing jologiri mikone az estefade az file haie gheire mojaz be onvane style ya script
        referrerPolicy: { policy: "no-referrer" }, // zamani ke be kasi link midahid az efshaie etelaat hasas user jologiri mikonad

      });
    }
  } catch (error) {
    logger.error("Error configuring Helmet:", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

module.exports = helmetConfig;
