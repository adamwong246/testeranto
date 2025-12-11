export default (services) => {
  return {
    version: "3.8",
    services,
    volumes: {
      node_modules: {
        driver: "local",
      },
    },
    networks: {
      default: {
        name: "allTests_network",
      },
    },
  };
};
