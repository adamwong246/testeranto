import fresh from 'fresh-require';
import { watchFile } from 'node:fs';
import { cancelable } from 'cancelable-promise';

const jobs = {};

const changed = (key, suite) => {
  if (jobs[key]) {
    jobs[key].cancel
  } 
  jobs[key] = cancelable(new Promise( (resolve) => {    
    try {
      resolve(suite.runner({}))
    } catch(e) {
      console.error("MARK 1", e)
    }
  }));
  
};

watchFile('./dist/tests/Rectangle/Rectangle.test.ts', async (curr, prev) => {
  const t = fresh("./tests/Rectangle/Rectangle.test", require)
  const RectangleTesteranto = t.RectangleTesteranto;
  changed(
    'Rectangle', new RectangleTesteranto()[0]
  )
  // await new RectangleTesteranto()[0].runner({port: 3001})
  // console.log("done" )
});