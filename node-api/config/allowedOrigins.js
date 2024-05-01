
// const getClientUrl = () => {
//   if (process.env.NODE_ENV === "development") {
//       return `http://${process.env.LOCAL_URL}:${process.env.CLIENT_PORT}`; // Use localhost for development
//     }
//     else if (process.env.NODE_ENV === "staging") {
//       return `http://${process.env.STAGING_URL}:${process.env.CLIENT_PORT}`; // Use localhost for development
//     }
//     else {
//       return `http://${process.env.PRODUCTION_URL}:${process.env.CLIENT_PORT}`; // Use server IP for other environments
//     }
// };

// const CLIENT_BASE_URL = getClientUrl();


const getServerUrl = () => {
  if (process.env.NODE_ENV === "development") {
      return `http://${process.env.DB_HOST}:${process.env.SERVER_PORT}`; // Use localhost for development
    }
    else if (process.env.NODE_ENV === "staging") {
      return `http://${process.env.STAGING_URL}:${process.env.SERVER_PORT}`; // Use localhost for development
    }
    else {
      return `http://${process.env.PRODUCTION_URL}:${process.env.SERVER_PORT}`; // Use server IP for other environments
    }
};

const SERVER_BASE_URL = getServerUrl();

const allowedOrigins = [
  'http://35.154.115.237:9999',
  'http://localhost:8081',
  SERVER_BASE_URL,
  // CLIENT_BASE_URL
];

module.exports = allowedOrigins;