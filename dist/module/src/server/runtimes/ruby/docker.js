export const rubyDockerComposeFile = (config, container_name, projectConfigPath, rubyConfigPath, testName) => {
    return {
        build: {
            context: process.cwd(),
            dockerfile: config[container_name].dockerfile,
        },
        container_name,
        environment: Object.assign({ NODE_ENV: "production" }, config.env),
        working_dir: "/workspace",
        volumes: [
            `${process.cwd()}/src:/workspace/src`,
            `${process.cwd()}/example:/workspace/example`,
            `${process.cwd()}/dist:/workspace/dist`,
            `${process.cwd()}/testeranto:/workspace/testeranto`,
        ],
        command: rubyBuildCommand(projectConfigPath, rubyConfigPath, testName),
    };
};
export const rubyBuildCommand = (projectConfigPath, rubyConfigPath, testName) => {
    return `bundle exec rubeno /workspace/testeranto/testeranto.ts /workspace/${rubyConfigPath} ${testName}`;
};
export const rubyBddCommand = (fpath) => {
    // const jsonStr = JSON.stringify({ ports: [1111] });
    // return `ruby example/Calculator-test.rb '${jsonStr}'`;
    const jsonStr = JSON.stringify({ ports: [1111] });
    return `ruby ${fpath} '${jsonStr}'`;
};
