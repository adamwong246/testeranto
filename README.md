# kokomo bay 🏝

## tl;dr

1. Install the dependencies

`yarn install`

2. Start the test scheduler after nuking everything

`yarn stop; yarn testeranto js/testeranto.config.mjs`

3. Once the test scheduler is running, from another terminal, you can inspect it with `pm2`:

### view all processes

`yarn pm2 ls`

### view all logs

`yarn pm2 logs -f`

### view the logs of a single tests

`yarn pm2 logs 1 -f`

### launch the pm2 dashboard

`yarn pm2 monit`
