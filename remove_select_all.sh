#!/bin/bash

# This script removes the Select All button from the verses view in index.tsx
FILE="/Users/zacharylavallee/Desktop/Git/Verse/frontend/app/(tabs)/index.tsx"

# Create a backup of the original file
cp "$FILE" "${FILE}.bak"

# Use sed to remove the Select All button and replace it with a spacer
sed -i '' '
/style={styles\.selectAllButton}/,/TouchableOpacity>/ {
  /TouchableOpacity/,/TouchableOpacity>/ {
    /TouchableOpacity/ s/.*/<View style={{width: 80}} \/>/ 
    /style=/d
    /onPress=/,/}}}$/d
    /Text style=/,/Text>/d
  }
}
' "$FILE"

echo "Select All button removed successfully."
