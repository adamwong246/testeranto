cat >dist/common/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

cat >dist/module/package.json <<!EOF
{
    "type": "module"
}
!EOF

# Create package.json for prebuild/cli to ensure ES modules
cat >dist/prebuild/cli/package.json <<!EOF
{
    "type": "module"
}
!EOF

# Clean up dist/cli directory
rm -rf dist/cli
mkdir -p dist/cli

# Create package.json in dist/cli to ensure ES modules
cat >dist/cli/package.json <<!EOF
{
    "type": "module"
}
!EOF

# Copy compiled CLI files from dist/prebuild/cli/ (they have .mjs extension)
cp -f dist/prebuild/cli/*.mjs dist/cli/ 2>/dev/null || true

# Rename .mjs to .js and add shebangs
for cmd in cli tui; do
  if [ -f "dist/cli/${cmd}.mjs" ]; then
    mv "dist/cli/${cmd}.mjs" "dist/cli/${cmd}.js"
    # Add shebang if not present
    if ! head -1 "dist/cli/${cmd}.js" | grep -q "^#!/"; then
      sed -i '' '1s/^/#!\/usr\/bin\/env node\n/' "dist/cli/${cmd}.js"
    fi
    chmod +x "dist/cli/${cmd}.js"
    echo "Made executable: dist/cli/${cmd}.js"
  else
    echo "Warning: dist/cli/${cmd}.mjs not found"
  fi
done
