import{assert as l}from"chai";import{features as o}from"/Users/adam/Code/testeranto.ts/tests/ClassicalReact/../testerantoFeatures.test.ts";import{EsbuildPuppeteerTesteranto as u}from"/Users/adam/Code/testeranto.ts/tests/ClassicalReact/./esbuild-puppeteer.testeranto.test.ts";var p=o.hello,h=u({Suites:{Default:"some default Suite"},Givens:{AnEmptyState:()=>{}},Whens:{IClickTheButton:()=>async({page:e})=>await e.click("#theButton")},Thens:{ThePropsIs:e=>async({page:s})=>{l.deepEqual(await s.$eval("#theProps",t=>t.innerHTML),JSON.stringify(e))},TheStatusIs:e=>async({page:s})=>l.deepEqual(await s.$eval("#theState",t=>t.innerHTML),JSON.stringify(e))},Checks:{AnEmptyState:()=>({})}},(e,s,t,a,i)=>[e.Default("a classical react component, bundled with esbuild and tested with puppeteer",[s.AnEmptyState("default",[],[],[a.ThePropsIs({}),a.TheStatusIs({count:0})]),s.AnEmptyState("default",[],[t.IClickTheButton()],[a.ThePropsIs({}),a.TheStatusIs({count:1})]),s.AnEmptyState("default",[o.hello],[t.IClickTheButton(),t.IClickTheButton(),t.IClickTheButton()],[a.TheStatusIs({count:3})]),s.AnEmptyState("default",[o.hello],[t.IClickTheButton(),t.IClickTheButton(),t.IClickTheButton(),t.IClickTheButton(),t.IClickTheButton(),t.IClickTheButton()],[a.TheStatusIs({count:6})])],[])],["./tests/ClassicalReact/index.ts",e=>`
            <!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module">${e}<\/script>
    </head>

    <body>
      <div id="root">
      </div>
    </body>

    <footer></footer>

    </html>
`],__filename);export{h as ClassicalComponentEsbuildPuppeteerTesteranto};
