import{assert as u}from"chai";import{features as i}from"/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";import c from"puppeteer";import h from"esbuild";import{Testeranto as S}from"testeranto";var p=(n,o,e)=>S(e,o,n,{ports:0},{beforeAll:async function([t,a]){return{page:await(await c.launch({headless:!0,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"})).newPage(),htmlBundle:a(h.buildSync({entryPoints:[t],bundle:!0,minify:!0,format:"esm",target:["esnext"],write:!1}).outputFiles[0].text)}},beforeEach:function(t){return t.page.setContent(t.htmlBundle).then(()=>({page:t.page}))},andWhen:function({page:t},a){return a()({page:t})},butThen:async function({page:t}){return{page:t}},afterEach:async function({page:t},a,l){return l.png(await(await t).screenshot()),{page:t}}});import s from"react";var r=class extends s.Component{constructor(o){super(o),this.state={count:0}}render(){return s.createElement("div",{style:{border:"3px solid green"}},s.createElement("h1",null,"Hello Classical React"),s.createElement("pre",{id:"theProps"},JSON.stringify(this.props)),s.createElement("p",null,"foo: ",this.props.foo),s.createElement("pre",{id:"theState"},JSON.stringify(this.state)),s.createElement("p",null,"count: ",this.state.count," times"),s.createElement("button",{id:"theButton",onClick:()=>{this.setState({count:this.state.count+1})}},"Click"))}};var B=i.hello,E=p({Suites:{Default:"some default Suite"},Givens:{AnEmptyState:()=>{}},Whens:{IClickTheButton:()=>async({page:n})=>await n.click("#theButton")},Thens:{ThePropsIs:n=>async({page:o})=>{u.deepEqual(await o.$eval("#theProps",e=>e.innerHTML),JSON.stringify(n))},TheStatusIs:n=>async({page:o})=>u.deepEqual(await o.$eval("#theState",e=>e.innerHTML),JSON.stringify(n))},Checks:{AnEmptyState:()=>({})}},(n,o,e,t,a)=>[n.Default("a classical react component, bundled with esbuild and tested with puppeteer",[o.AnEmptyState([],[],[t.ThePropsIs({}),t.TheStatusIs({count:0})]),o.AnEmptyState([],[e.IClickTheButton()],[t.ThePropsIs({}),t.TheStatusIs({count:1})]),o.AnEmptyState([i.hello],[e.IClickTheButton(),e.IClickTheButton(),e.IClickTheButton()],[t.TheStatusIs({count:3})]),o.AnEmptyState([i.hello],[e.IClickTheButton(),e.IClickTheButton(),e.IClickTheButton(),e.IClickTheButton(),e.IClickTheButton(),e.IClickTheButton()],[t.TheStatusIs({count:6})])],[])],["./tests/ClassicalReact/index.ts",n=>`
            <!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module">${n}<\/script>
    </head>

    <body>
      <div id="root">
      </div>
    </body>

    <footer></footer>

    </html>
`,r]);export{E as ClassicalComponentEsbuildPuppeteerTesteranto};
