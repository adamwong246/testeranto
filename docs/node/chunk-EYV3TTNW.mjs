import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  init_cjs_shim
} from "./chunk-4IESOCHA.mjs";

// src/app.test.ts
init_cjs_shim();
var AppSpecification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Redux store",
      {
        test0: Given.AnEmptyState(
          ["hello"],
          [When.TheEmailIsSetTo("adam@email.com")],
          [Then.TheEmailIs("adam@email.com")]
        ),
        test1: Given.AStateWithEmail(
          ["hello"],
          [],
          [
            Then.TheEmailIsNot("adam@email.com"),
            Then.TheEmailIs("bob@mail.com")
          ],
          "bob@mail.com"
        ),
        test2: Given.AnEmptyState(
          ["hello"],
          [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
          [Then.TheEmailIs("aloha")]
        ),
        test3: Given.AnEmptyState(
          [`aloha`, `hello`],
          [],
          [Then.TheEmailIs("")]
        ),
        test4: Given.AnEmptyState(
          [`aloha`, `hello`],
          [When.TheEmailIsSetTo("hey there")],
          [Then.TheEmailIs("hey there")]
        )
      },
      [
        // Check.AnEmptyState(
        //   "imperative style",
        //   [`aloha`],
        //   async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
        //     await TheEmailIsSetTo("foo");
        //     await TheEmailIs("foo");
        //     const reduxPayload = await TheEmailIsSetTo("foobar");
        //     await TheEmailIs("foobar");
        //     // assert.deepEqual(reduxPayload, {
        //     //   type: "login app/setEmail",
        //     //   payload: "foobar",
        //     // });
        //   }
        // ),
      ]
    )
  ];
};

export {
  AppSpecification
};
