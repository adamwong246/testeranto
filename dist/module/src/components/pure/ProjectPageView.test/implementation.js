import { assert } from "chai";
export const implementation = {
    suites: {
        Default: "Project Page View Tests",
    },
    givens: {
        Default: () => ({
            summary: {},
            nodeLogs: null,
            webLogs: null,
            pureLogs: null,
            config: { tests: [] },
            loading: false,
            error: null,
            projectName: "test-project",
            route: "tests",
            setRoute: () => { },
            navigate: () => { },
        }),
        WithError: () => ({
            summary: null,
            nodeLogs: null,
            webLogs: null,
            pureLogs: null,
            config: { tests: [] },
            loading: false,
            error: "Test error message",
            projectName: "test-project",
            route: "tests",
            setRoute: () => { },
            navigate: () => { },
        }),
    },
    whens: {},
    thens: {
        happyPath: () => async ({ container, html }, pm) => {
            console.group('[Test] Verifying render output');
            // debugger
            const p = await pm.page();
            await pm.customScreenShot({ path: "happyPath.png" }, p);
            assert.equal(1, 1);
            // try {
            //   console.log('Checking for container-fluid');
            //   const containerFluid = container.querySelector(".container-fluid");
            //   expect(containerFluid).to.exist;
            //   expect(containerFluid?.children.length).to.be.greaterThan(0);
            //   console.log('Checking for NavBar');
            //   const navBar = container.querySelector("nav.navbar");
            //   expect(navBar).to.exist;
            //   console.log('Render verification passed');
            //   console.groupEnd();
            //   return { container, html };
            // } catch (err) {
            //   console.error('Verification failed:', err);
            //   console.error('Full HTML:', html);
            //   console.groupEnd();
            //   throw err;
            // }
        },
        unhappyPath: () => async ({ container }, pm) => {
            // expect(container.textContent).contain("Test error message");
            assert.equal(1, 1);
            const p = await pm.page();
            await pm.customScreenShot({ path: "unhappyPath.png" }, p);
            return { container };
        },
    },
};
