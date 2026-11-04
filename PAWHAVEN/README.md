# PAWHAVEN - Frontend Assignment 6

Team: Miras Kamaladin, Dias Aibekuly, Ayaulym Amankeldykyzy

Group: SE-2504

## Run locally

Open `index.html` in a browser. The JavaScript is separated into `js/main.js`; styles are in `css/style.css`. jQuery 3.7.1 is loaded from its CDN.

## Assignment 6 features

* jQuery initialization using `$(document).ready()`.
* Real-time product search using `keyup` and `input` events.
* Autocomplete suggestions displaying matching product names.
* Search highlighting for matching words in product cards.
* Colourful scroll progress bar that updates while scrolling.
* Animated number counters on the Home page.
* Loading spinner on Contact and Signup form submission.
* Temporary toast notifications for user actions.
* Copy to Clipboard button with checkmark and confirmation message.
* Lazy loading of images when they approach the visible area.

## jQuery implementation

* DOM manipulation and event handling using jQuery selectors and methods.
* Product filtering combines the search keyword with existing category filters.
* Autocomplete suggestions are generated dynamically from matching products.
* Search highlighting modifies text nodes without changing HTML tags or attributes.
* Number counters use jQuery animations.
* Toast notifications use `fadeIn()` and `fadeOut()`.
* Scroll events update the progress bar and trigger lazy image loading.

Note: Forms and basket actions are front-end demonstrations only. They do not send data to a server or process real transactions.

All Assignment 6 features are integrated into the existing PAWHAVEN project.
