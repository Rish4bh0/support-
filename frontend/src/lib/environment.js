const isProduction = process.env.NODE_ENV === "production";

export const environment = {
    SERVER_URL: isProduction ? process.env.REACT_APP_SERVER_URL_PROD : process.env.REACT_APP_SERVER_URL_DEV
}

