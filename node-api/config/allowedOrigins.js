
// const getClientUrl = () => {
//   if (process.env.NODE_ENV === "development") {
//       return `http://${process.env.LOCAL_URL}:${process.env.PORT}`; // Use localhost for development
//     }
//     else if (process.env.NODE_ENV === "staging") {
//       return `http://${process.env.STAGING_URL}:${process.env.PORT}`; // Use localhost for development
//     }
//     else {
//       return `http://${process.env.PRODUCTION_URL}:${process.env.PORT}`; // Use server IP for other environments
//     }
// };

// const CLIENT_BASE_URL = getClientUrl();


const getServerUrl = () => {
  if (process.env.NODE_ENV === "development") {
      return `http://${process.env.DB_HOST}:${process.env.PORT}`; // Use localhost for development
    }
    else if (process.env.NODE_ENV === "staging") {
      return `http://${process.env.STAGING_URL}:${process.env.PORT}`; // Use localhost for development
    }
    else {
      return `http://${process.env.PRODUCTION_URL}:${process.env.PORT}`; // Use server IP for other environments
    }
};

const SERVER_BASE_URL = getServerUrl();

const allowedOrigins = [
  'http://35.154.115.237:9999'
  //  CLIENT_BASE_URL
];

module.exports = allowedOrigins;