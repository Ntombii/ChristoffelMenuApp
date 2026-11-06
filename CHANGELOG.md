# Changelog


## [1.0.2] - 2026-11-06

### Added
- Created the home screen.
- Added user login functionality.
- Added user registration (sign-up) functionality.
- Added menu management functionality.
- Added the ability to add new menu items.
- Added the ability to edit existing menu items.
- Added menu statistics screen.
- Added image upload of menu items on Add Menu page


### Changed
- Improved home screen navigation.
- Updated menu interface and styling.
- Updated add_menu.js and edit_menu.js to save uploaded images as base64 data in AsyncStorage instead of temporary gallery URIs.

### Fixed
- Fixed navigation issues between screens.
- Improved form validation.
- Fixed the upload Image button for it had a handler present but references ImagePicker without importing it
- Debugged the add_menu.js.The prices input was not showing as well as the other buttons due to the form likely laid out in a fixed View. So the content below the image fals outside the visible viewport. Ive changed it to a scrollabble form.

## [Unreleased]

### Planned
- Improve application performance.
- Add additional menu management features.
- Improve error handling.