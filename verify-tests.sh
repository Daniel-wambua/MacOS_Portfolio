#!/bin/bash

echo "🧪 Test Setup Verification"
echo "=========================="
echo ""

# Check if test directories exist
echo "📁 Checking test directories..."
for dir in src/__tests__/store src/__tests__/components src/__tests__/constants src/__tests__/hoc src/__tests__/utils; do
  if [ -d "$dir" ]; then
    echo "✅ $dir exists"
  else
    echo "❌ $dir missing"
  fi
done
echo ""

# Check if test files exist
echo "📄 Checking test files..."
test_files=(
  "src/__tests__/setup.js"
  "src/__tests__/store/window.test.js"
  "src/__tests__/store/location.test.js"
  "src/__tests__/components/WindowControls.test.jsx"
  "src/__tests__/components/Navbar.test.jsx"
  "src/__tests__/components/Welcome.test.jsx"
  "src/__tests__/components/NotFound.test.jsx"
  "src/__tests__/constants/index.test.js"
  "src/__tests__/hoc/WindowWrapper.test.jsx"
  "src/__tests__/Router.test.jsx"
  "src/__tests__/App.test.jsx"
)

for file in "${test_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file missing"
  fi
done
echo ""

# Check if config files exist
echo "⚙️  Checking configuration files..."
config_files=(
  "vitest.config.js"
  "TESTING.md"
  "TEST_SUMMARY.md"
  "TEST_SETUP.md"
)

for file in "${config_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file missing"
  fi
done
echo ""

# Count total test files
echo "📊 Test Statistics:"
test_count=$(find src/__tests__ -name "*.test.js" -o -name "*.test.jsx" | wc -l)
echo "   Total test files: $test_count"
echo ""

# Check package.json for test scripts
echo "📦 Checking package.json scripts..."
if grep -q '"test":' package.json; then
  echo "✅ Test script found"
else
  echo "❌ Test script missing"
fi

if grep -q '"test:coverage":' package.json; then
  echo "✅ Coverage script found"
else
  echo "❌ Coverage script missing"
fi
echo ""

echo "✨ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Run tests: npm test"
echo "3. View coverage: npm run test:coverage"
echo "4. Read TESTING.md for more information"