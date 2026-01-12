import fs from 'fs';
import path from 'path';

console.log('Verifying VS Code extension build...');

const requiredFiles = [
    'dist/vscode/extension.js',
    'media/icon.svg',
    'package.json'
];

let allFilesExist = true;

for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`✓ ${file}`);
    } else {
        console.log(`✗ ${file} (MISSING)`);
        allFilesExist = false;
    }
}

if (allFilesExist) {
    console.log('\n✅ All required files for VS Code extension are present.');
    
    // Check package.json for required fields
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredFields = ['name', 'displayName', 'version', 'engines', 'main', 'publisher'];
    for (const field of requiredFields) {
        if (packageJson[field]) {
            if (field === 'engines') {
                console.log(`✓ package.json has ${field}:`, packageJson[field]);
                // Check for vscode engine
                if (!packageJson.engines.vscode) {
                    console.log(`✗ package.json engines missing 'vscode' field`);
                    allFilesExist = false;
                }
            } else {
                console.log(`✓ package.json has ${field}: ${packageJson[field]}`);
            }
        } else {
            console.log(`✗ package.json missing required field: ${field}`);
            allFilesExist = false;
        }
    }
    
    // Check for activationEvents and contributes
    if (!packageJson.activationEvents) {
        console.log('✗ package.json missing activationEvents');
        allFilesExist = false;
    } else {
        console.log('✓ package.json has activationEvents');
    }
    
    if (!packageJson.contributes) {
        console.log('✗ package.json missing contributes');
        allFilesExist = false;
    } else {
        console.log('✓ package.json has contributes');
    }
    
    if (allFilesExist) {
        console.log('\n✅ Extension is ready for packaging.');
        process.exit(0);
    } else {
        console.log('\n❌ Extension has missing required fields.');
        process.exit(1);
    }
} else {
    console.log('\n❌ Some required files are missing.');
    process.exit(1);
}
