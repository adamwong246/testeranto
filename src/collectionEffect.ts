import { useEffect } from "react";

export const collectionEffect = (
  collection: string,
  setter: (any) => any,
  coercer: (any) => any = (x) => x
) => {
  useEffect(() => {
    (async () => {
      fetch(`http://localhost:8080/${collection}.json`)
        .then((response) => response.json())
        .then((json) => {
          Promise.all(
            json.ids.map(async (_id) => {
              return {
                _id,
                ...coercer(
                  await (
                    await fetch(
                      `http://localhost:8080/${collection}/${_id}.json`
                    )
                  ).json()
                ),
              };
            })
          ).then((items: any[]) => {
            console.log("setting", collection, items);
            setter(items);
          });
        })
        .catch((error) => console.error(error));
    })();
  }, []);
};
