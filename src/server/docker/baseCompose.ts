export default (services, testsName) => {
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
        name: `${testsName}_network`,
      },
    },
  };
};
