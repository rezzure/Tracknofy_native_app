# TODO: Fix Navigation Issues in MenuBar.jsx

## Tasks
- [x] Fix navigation paths in MenuBar.jsx to use correct Expo Router paths (/profile, /notifications, etc.)
- [x] Update ClientLayout (_layout.jsx) to properly handle profile navigation if needed
- [x] Fix notification navigation issue (blank screen on second mount) by adding toggleMenu and using router.replace
- [x] Test navigation to profile and notifications pages (fixed notification icon opening menu issue)
- [x] Fix header positioning issue where top screen moves upward and becomes hidden (added SafeAreaProvider to root layout)

## Details
- Change `(Client)/profile` to `/profile`
- Change `(Client)/notifications` to `/notifications`
- Change `(Client)/${screen}` to `/${screen}` in navigateTo function
- Ensure MenuBar component is correctly integrated in ClientLayout
