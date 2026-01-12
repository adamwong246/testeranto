import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building VS Code extension...');

try {
    // Run bundle
    console.log('Running npm run bundle...');
    execSync('npm run bundle', { stdio: 'inherit', timeout: 60000 });
    
    // Verify extension
    console.log('\nVerifying extension...');
    execSync('npm run verify:extension', { stdio: 'inherit', timeout: 30000 });
    
    // Package extension with timeout and minimal output
    console.log('\nPackaging extension (this may take a moment)...');
    execSync('npx vsce package --no-dependencies', { 
        stdio: 'inherit', 
        timeout: 120000 
    });
    
    // Find the .vsix file
    const files = fs.readdirSync(process.cwd());
    const vsixFiles = files.filter(file => file.endsWith('.vsix'));
    
    if (vsixFiles.length > 0) {
        for (const vsixFile of vsixFiles) {
            const fullPath = path.resolve(process.cwd(), vsixFile);
            console.log(`\n✅ Extension packaged successfully: ${vsixFile}`);
            console.log(`📁 Full path: ${fullPath}`);
            console.log(`\nTo install:`);
            console.log(`1. Open VS Code`);
            console.log(`2. Go to Extensions (Ctrl+Shift+X)`);
            console.log(`3. Click "..." → "Install from VSIX..."`);
            console.log(`4. Select: ${fullPath}`);
        }
    } else {
        console.error('\n❌ No .vsix file found in current directory.');
        console.log('Files in current directory:');
        files.slice(0, 20).forEach(f => console.log(`  ${f}`));
        if (files.length > 20) console.log(`  ... and ${files.length - 20} more`);
        process.exit(1);
    }
} catch (error) {
    console.error('\n❌ Failed to package extension:', error.message);
    if (error.signal === 'SIGTERM') {
        console.error('Process timed out. Try running: npx vsce package --no-dependencies');
    }
    process.exit(1);
}
