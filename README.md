# kokomo bay 🏝

## tl;dr

1. Install the dependencies

`yarn install`

2. Start the test scheduler after nuking everything

`yarn nuke; yarn test`

3. Once the test scheduler is running, from another terminal, you can inspect it with `pm2`:

### view all processes

`yarn pm2 ls`

### view all logs

`yarn pm2 logs -f`

### view the logs of a single tests

`yarn pm2 logs 1 -f`

### launch the pm2 dashboard

`yarn pm2 monit`

### launch a pre-built test

echo '{"fs": "./foobar", "ports": ["3333"]}' | node js-bazel/myTests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.mjs

[
      "./src/app.reduxToolkit.test.ts",
      "node",
      []
    ],

    [
      "./src/app.redux.test.ts",
      "node",
      []
    ],

    [
      "./src/ClassicalComponent/react-test-renderer/web.test.tsx",
      "web",
      []
    ],
    [
      "./src/ClassicalComponent/react-test-renderer/node.test.tsx",
      "node",
      []
    ],
    [
      "./src/ClassicalComponent/react-dom/client.web.test.tsx",
      "web",
      []
    ],
    [
      "./src/ClassicalComponent/react-dom/server.node.test.tsx",
      "node",
      []
    ],
    [
      "./src/ReactStateAndHook.test.tsx",
      "node",
      []
    ],
    [
      "./src/Rectangle/Rectangle.test.electron.ts",
      "web",
      []
    ],
    [
      "./src/Rectangle/Rectangle.test.node.ts",
      "node",
      [
        [
          "./src/ClassicalComponent/test.ts",
          "web",
          []
        ]
      ]
    ],
    [
      "./src/MyFirstContract.solidity.test.ts",
      "node",
      []
    ],
    [
      "./src/MyFirstContract.solidity-precompiled.test.ts",
      "node",
      []
    ]


        [
      "./src/LoginPage/react/web.test.tsx",
      "web",
      []
    ],
    [
      "./src/LoginPage/react/node.test.tsx",
      "node",
      []
    ],
    [
      "./src/LoginPage/react-test-renderer/web.test.tsx",
      "web",
      []
    ],
    [
      "./src/LoginPage/react-test-renderer/node.test.tsx",
      "node",
      []
    ]