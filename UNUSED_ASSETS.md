# Unused Assets Report

The following assets were not found in the codebase. They can potentially be removed to reduce bundle size:

## Images Not Referenced in Code:

### SVG Files:
- `src/assets/react.svg` - Default Vite React logo
- `src/assets/pyramid.svg`
- `src/assets/pillar.svg`
- `src/assets/atom.svg`
- `src/assets/glassware.svg`
- `src/assets/rib-cage.svg`
- `src/assets/quran.svg`
- `src/assets/quran2.svg`
- `src/assets/programming.svg`
- `src/assets/sandglass.svg`
- `src/assets/countdown.svg`
- `src/assets/target.svg`
- `src/assets/fire.svg`

### PNG Files:
- `src/assets/fire.png`
- `src/assets/savings.png`
- `src/assets/coin.png`
- `src/assets/leadership.png`
- `src/assets/education.png`
- `src/assets/chart.png`

### Course Images (Check if dynamically loaded):
- `src/assets/course-image-1.jpg` through `course-image-6.jpg`
  - These might be used dynamically or in backend references
  - Verify before deletion

### Other:
- `src/assets/screenshot.png` - May be for documentation

## Recommendations:

1. **Before Deleting:** 
   - Verify these aren't loaded dynamically via backend data
   - Check if they're referenced in any configuration files
   - Look for any string concatenation that builds asset paths

2. **Keep for Now:**
   - Course images (might be loaded dynamically)
   - Any placeholder images used in development

3. **Safe to Remove:**
   - Default Vite/React logos
   - Unused icon assets
   - Duplicate assets (quran.svg vs quran2.svg)

## Estimated Space Savings:
Removing confirmed unused assets could save approximately 200-500KB from the final bundle.

## Action Items:
- [ ] Verify course images aren't dynamically referenced
- [ ] Check if any assets are used in test files
- [ ] Remove confirmed unused assets
- [ ] Update any documentation that references removed assets
