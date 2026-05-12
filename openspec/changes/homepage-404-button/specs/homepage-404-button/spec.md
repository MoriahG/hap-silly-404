## ADDED Requirements

### Requirement: Homepage shows a 404 button

The homepage SHALL include a visible button that invites users to visit the custom 404 page.

#### Scenario: Button is present on homepage

- **WHEN** a user loads `/`
- **THEN** the page displays a clearly labeled button for visiting the custom 404 page

### Requirement: 404 button performs standard in-site navigation

The homepage 404 button MUST navigate to `/this-page-does-not-exist` using standard same-tab navigation behavior so the normal not-found route serves the custom 404 page.

#### Scenario: User activates the button

- **WHEN** a user clicks or keyboard-activates the homepage 404 button
- **THEN** the browser navigates to `/this-page-does-not-exist` in the same tab
