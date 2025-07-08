// Script to fix menu.ts TypeScript errors
const fs = require('fs');
const path = require('path');

// Read the menu.ts file
const menuPath = path.join(__dirname, 'src', 'data', 'menu.ts');
let menuContent = fs.readFileSync(menuPath, 'utf8');

// Remove all defaultSpiceLevel properties
menuContent = menuContent.replace(/^\s*defaultSpiceLevel:.*,?\r?\n/gm, '');

// Remove all spicyLevel properties
menuContent = menuContent.replace(/^\s*spicyLevel:.*,?\r?\n/gm, '');

// Update combo categories from 'combos' to 'medium-combos' or 'large-combos'
menuContent = menuContent.replace(/category: ['"]combos['"]/g, (match, offset) => {
  // Check if this is a medium or large combo by looking for nearby text
  const nearbyText = menuContent.substring(Math.max(0, offset - 200), offset + 200);
  
  if (nearbyText.includes('size: \'large\'')) {
    return 'category: \'large-combos\'';
  } else {
    return 'category: \'medium-combos\'';
  }
});

// Write the updated content back to the file
fs.writeFileSync(menuPath, menuContent);

console.log('Menu file updated successfully!');
