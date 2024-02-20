const isProduction = process.env.NODE_ENV === "production";

const environment = {
    SERVER_URL: isProduction ? process.env.APP_SERVER_URL_PROD : process.env.APP_SERVER_URL_DEV
}

module.exports = environment;