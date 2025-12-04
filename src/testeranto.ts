import { main } from './testeranto/main';

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
