declare module "*.test.js" {
  type ITestTypes = [string, IRunTime, ITestTypes[]];
  const content: ITestTypes[];
  export default content;
}

// declare module '@revideo/core' {
//   export function makeScene2D(callback: (view: any) => Generator): any;
//   export function createRef<T>(): { current: T | null };
//   export function waitFor(seconds: number): Generator;
//   export function all(...animations: any[]): any;
//   export function chain(...animations: any[]): any;

//   export class Txt {
//     constructor(props: {
//       text: string;
//       fill: string;
//       fontSize: number;
//       fontFamily: string;
//     });
//     scale(x: number, duration: number): any;
//   }
// }

// declare module '@revideo/player' {
//   export class Player {
//     constructor(config: {
//       container: string;
//       width: number;
//       height: number;
//       autoplay: boolean;
//       loop: boolean;
//       scene: any;
//     });
//   }
// }

interface Window {
  revideo: {
    core: typeof import("@revideo/core");
    player: typeof import("@revideo/player");
    setupVideoPlayer: (container: string) => Promise<void>;
  };
}
