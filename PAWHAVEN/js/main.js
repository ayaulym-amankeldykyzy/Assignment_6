document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Shared state and reusable sound feedback.
  const soundState = { enabled: localStorage.getItem("pawhavenSound") !== "off" };
  let audioContext;
  function playFeedbackSound(frequency = 660) {
    if (!soundState.enabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext = audioContext || new AudioContextClass();
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.17);
    } catch (error) {
      console.info("Audio feedback is unavailable in this browser.");
    }
  }

  // Assignment 4: contact form validation with custom English messages and no reload.
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    const nameInput = contactForm.querySelector("#name");
    const emailInput = contactForm.querySelector("#email");
    const messageInput = contactForm.querySelector("#message");
    const feedback = contactForm.querySelector("#contact-feedback");
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = [
        { input: nameInput, message: "Please enter your name." },
        { input: emailInput, message: "Please enter your email address." },
        { input: messageInput, message: "Please enter your message." }
      ];
      const emptyField = fields.find((field) => !field.input.value.trim());
      if (emptyField) {
        feedback.textContent = emptyField.message;
        feedback.classList.add("is-error");
        emptyField.input.focus();
        return;
      }
      if (!emailInput.validity.valid) {
        feedback.textContent = "Please enter a valid email address.";
        feedback.classList.add("is-error");
        emailInput.focus();
        return;
      }
      feedback.classList.remove("is-error");
      feedback.textContent = "Sending your message…";
      const submittedName = nameInput.value.trim();
      // Callback-style demo response: no backend is connected, so no real message is sent.
      window.setTimeout(function showSuccessMessage() {
        feedback.textContent = `Thank you, ${submittedName}! Your message passed validation.`;
        contactForm.reset();
        playFeedbackSound(740);
      }, 450);
    });
  }

  // Assignment 4 + 5: build the FAQ content with JavaScript, then attach event listeners.
  function createFAQ() {
    const faqContainer = document.querySelector("#faq-container");
    if (!faqContainer) return;

    const heading = document.createElement("div");
    heading.className = "section-head";
    heading.innerHTML = '<div><h2 id="faq-heading">Frequently Asked Questions</h2><p class="section-intro">Quick answers about PAWHAVEN and responsible pet care.</p></div>';

    const faqList = document.createElement("div");
    faqList.className = "faq-list";
    const questions = [
      { question: "How can I adopt a pet?", answer: "Visit our Adoption page, learn about the pets, then send us a message through the contact form." },
      { question: "What products can I find in the shop?", answer: "Our shop introduces pet food, toys, collars and everyday accessories for your furry friends." },
      { question: "Can I ask for pet-care advice?", answer: "Yes. Use the Contact page and choose General question to send your question to our team." }
    ];

    questions.forEach((item) => {
      const faqItem = document.createElement("div");
      faqItem.className = "faq-item";
      const questionButton = document.createElement("button");
      questionButton.className = "faq-question";
      questionButton.type = "button";
      questionButton.setAttribute("aria-expanded", "false");
      questionButton.append(document.createTextNode(item.question + " "));
      const sign = document.createElement("span");
      sign.textContent = "+";
      questionButton.append(sign);

      const answer = document.createElement("div");
      answer.className = "faq-answer";
      answer.style.maxHeight = "0px";
      const answerText = document.createElement("p");
      answerText.textContent = item.answer;
      answer.append(answerText);

      questionButton.addEventListener("click", () => {
        const isOpen = questionButton.getAttribute("aria-expanded") === "true";
        questionButton.setAttribute("aria-expanded", String(!isOpen));
        answer.style.maxHeight = isOpen ? "0px" : `${answer.scrollHeight}px`;
        questionButton.classList.toggle("is-open", !isOpen);
        sign.textContent = isOpen ? "+" : "−";
        if (!isOpen) playFeedbackSound(520);
      });
      faqItem.append(questionButton, answer);
      faqList.append(faqItem);
    });
    faqContainer.append(heading, faqList);
  }
  createFAQ();

  // Assignment 4 + 5: create the signup popup using JavaScript instead of hard-coding it in HTML.
  function createSignupForm() {
    if (document.querySelector("#signup-overlay")) return;
    const overlayElement = document.createElement("div");
    overlayElement.className = "signup-overlay";
    overlayElement.id = "signup-overlay";
    overlayElement.setAttribute("aria-hidden", "true");
    overlayElement.innerHTML = `
      <section class="signup-modal" role="dialog" aria-modal="true" aria-labelledby="signup-title">
        <button class="modal-close" id="close-signup" type="button" aria-label="Close form">×</button>
        <h2 id="signup-title">Join the PAWHAVEN community</h2>
        <p>Create a demo account to receive pet-care updates.</p>
        <form id="signup-form" novalidate>
          <label for="signup-name">Your name</label>
          <input class="form-control" id="signup-name" name="name" required minlength="2" placeholder="Your name">
          <label for="signup-email">Email</label>
          <input class="form-control" id="signup-email" name="email" type="email" required placeholder="you@example.com">
          <label for="signup-password">Password</label>
          <input class="form-control" id="signup-password" name="password" type="password" required minlength="8" placeholder="At least 8 characters">
          <label for="signup-confirm">Confirm password</label>
          <input class="form-control" id="signup-confirm" name="confirm" type="password" required minlength="8" placeholder="Repeat password">
          <p class="form-feedback" id="signup-feedback" role="status"></p>
          <button class="btn btn-primary w-100 mt-2" type="submit">Create account</button>
        </form>
      </section>`;
    document.body.append(overlayElement);
  }
  createSignupForm();

  // Accessible sign-up popup and custom English validation.
  const overlay = document.querySelector("#signup-overlay");
  const openButton = document.querySelector("#open-signup");
  const closeButton = document.querySelector("#close-signup");
  const closeModal = () => {
    if (!overlay) return;
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
  };
  if (openButton && overlay) {
    openButton.addEventListener("click", () => {
      overlay.classList.add("is-visible");
      overlay.setAttribute("aria-hidden", "false");
      const firstInput = overlay.querySelector("#signup-name");
      if (firstInput) firstInput.focus();
    });
  }
  if (closeButton) closeButton.addEventListener("click", closeModal);
  if (overlay) {
    overlay.addEventListener("click", (event) => { if (event.target === overlay) closeModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
  }
  const signupForm = document.querySelector("#signup-form");
  if (signupForm) signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = signupForm.querySelector("#signup-name");
    const email = signupForm.querySelector("#signup-email");
    const password = signupForm.querySelector("#signup-password");
    const confirm = signupForm.querySelector("#signup-confirm");
    const feedback = signupForm.querySelector("#signup-feedback");
    feedback.classList.add("is-error");
    if (name.value.trim().length < 2) feedback.textContent = "Please enter a name with at least 2 characters.";
    else if (!email.value.trim() || !email.validity.valid) feedback.textContent = "Please enter a valid email address.";
    else if (password.value.length < 8) feedback.textContent = "Password must contain at least 8 characters.";
    else if (password.value !== confirm.value) feedback.textContent = "Passwords do not match.";
    else {
      feedback.classList.remove("is-error");
      feedback.textContent = "Success! Your form is valid. (Demo only — no account is created.)";
      playFeedbackSound(820);
      signupForm.reset();
    }
  });

  // Assignment 4 + 5: Day/Night theme switch. Preference persists between pages.
  const themeButton = document.querySelector("#theme-toggle");
  function applyTheme(isNight) {
    document.body.classList.toggle("theme-night", isNight);
    document.querySelectorAll("#theme-toggle").forEach((button) => {
      button.textContent = isNight ? "☀️ Day mode" : "🌙 Night mode";
      button.setAttribute("aria-pressed", String(isNight));
    });
    localStorage.setItem("pawhavenTheme", isNight ? "night" : "day");
  }
  applyTheme(localStorage.getItem("pawhavenTheme") === "night");
  if (themeButton) themeButton.addEventListener("click", () => {
    const isNight = !document.body.classList.contains("theme-night");
    applyTheme(isNight);
    playFeedbackSound(isNight ? 430 : 690);
  });

  // Sound toggle; sound effects are synthesized in JavaScript and need no external audio file.
  const soundButton = document.querySelector("#sound-toggle");
  function updateSoundButton() {
    if (!soundButton) return;
    soundButton.textContent = soundState.enabled ? "🔔 Sound: On" : "🔕 Sound: Off";
    soundButton.setAttribute("aria-pressed", String(soundState.enabled));
  }
  updateSoundButton();
  if (soundButton) soundButton.addEventListener("click", () => {
    soundState.enabled = !soundState.enabled;
    localStorage.setItem("pawhavenSound", soundState.enabled ? "on" : "off");
    updateSoundButton();
    if (soundState.enabled) playFeedbackSound(660);
  });

  // Assignment 4: readable date and time, refreshed every second.
  const clock = document.querySelector("#live-clock");
  function updateClock() {
    if (clock) clock.textContent = new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "medium" });
  }
  updateClock();
  window.setInterval(updateClock, 1000);

  // Assignment 5: keyboard navigation through the main navigation links with arrow keys.
  const navigationLinks = Array.from(document.querySelectorAll(".navbar-nav .nav-link"));
  navigationLinks.forEach((link, index) => {
    link.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % navigationLinks.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + navigationLinks.length) % navigationLinks.length;
      else return;
      event.preventDefault();
      navigationLinks[nextIndex].focus();
    });
  });

  // Assignment 5: Read More toggles extra content and updates the relevant attributes.
  const readMoreButton = document.querySelector("#read-more-team");
  const extraStory = document.querySelector("#team-story-extra");
  if (readMoreButton && extraStory) {
    readMoreButton.addEventListener("click", () => {
      const willExpand = extraStory.hidden;
      extraStory.hidden = !willExpand;
      readMoreButton.textContent = willExpand ? "Read less" : "Read more";
      readMoreButton.setAttribute("aria-expanded", String(willExpand));
      if (willExpand) extraStory.classList.add("content-reveal");
    });
  }

  // Assignment 5: an array of objects stores the catalogue; JavaScript renders product cards.
  const productCatalog = [
    { name: "Healthy Food", category: "food", price: "$18.90", image: "images/food.jpg", description: "Balanced everyday nutrition for cats and dogs." },
    { name: "Play Toys", category: "toys", price: "$9.50", image: "images/toy.jpg", description: "Fun, durable toys for active paws." },
    { name: "Walk Set", category: "accessories", price: "$24.00", image: "images/collar.jpg", description: "Comfortable collar and lead for daily walks." },
    { name: "Cozy Pet Bed", category: "accessories", price: "$32.00", image: "images/card1.jpg", description: "A soft resting spot for a well-earned nap." },
    { name: "Training Treats", category: "food", price: "$7.25", image: "images/card2.jpg", description: "Small rewards for positive training moments." },
    { name: "Rope Play Toy", category: "toys", price: "$11.00", image: "images/card3.jpg", description: "A playful choice for interactive games." }
  ];
  const productGrid = document.querySelector("#product-grid");
  const shopStatus = document.querySelector("#shop-status");
  const loadMoreButton = document.querySelector("#load-more-products");
  let visibleProductLimit = 3;

  function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "col-sm-12 col-md-6 col-lg-4 product-item card-filter-in";
    article.dataset.category = product.category;
    const card = document.createElement("div");
    card.className = "card h-100";
    const image = document.createElement("img");
    image.className = "img-fluid shop-card-image";
    image.dataset.lazySrc = product.image;
    image.alt = product.name;
    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("h3");
    title.className = "section-title";
    title.textContent = product.name;
    const description = document.createElement("p");
    description.className = "muted";
    description.textContent = product.description;
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = product.price;
    body.append(title, description, price);
    card.append(image, body);
    article.append(card);
    return article;
  }

  // Higher-order function: forEach creates cards from product objects and appends them to the page.
  function renderProducts() {
    if (!productGrid) return;
    productGrid.replaceChildren();
    productCatalog.slice(0, visibleProductLimit).forEach((product) => {
      productGrid.append(createProductCard(product));
    });
    addRatingWidgets(productGrid);
    if (loadMoreButton) {
      const allLoaded = visibleProductLimit >= productCatalog.length;
      loadMoreButton.hidden = allLoaded;
      loadMoreButton.disabled = allLoaded;
      if (allLoaded) loadMoreButton.textContent = "All products loaded";
    }
    filterProducts(document.querySelector(".shop-filter.is-active")?.dataset.filter || "all");
  }

  function addRatingWidgets(scope = document) {
    scope.querySelectorAll(".product-item:not([data-rating-ready])").forEach((product) => {
      product.setAttribute("data-rating-ready", "true");
      const body = product.querySelector(".card-body");
      if (!body) return;
      const rating = document.createElement("div");
      rating.className = "product-rating";
      rating.setAttribute("aria-label", "Rate this product");
      const label = document.createElement("span");
      label.className = "rating-label";
      label.textContent = "Rate it:";
      rating.append(label);
      for (let starValue = 1; starValue <= 5; starValue++) {
        const star = document.createElement("button");
        star.type = "button";
        star.className = "rating-star";
        star.textContent = "★";
        star.setAttribute("aria-label", `Rate ${starValue} out of 5`);
        star.dataset.rating = String(starValue);
        star.addEventListener("click", () => {
          rating.querySelectorAll(".rating-star").forEach((starButton) => {
            const active = Number(starButton.dataset.rating) <= starValue;
            starButton.classList.toggle("is-selected", active);
            starButton.setAttribute("aria-pressed", String(active));
          });
          label.textContent = `Your rating: ${starValue}/5`;
          playFeedbackSound(480 + starValue * 55);
        });
        rating.append(star);
      }
      body.append(rating);
    });
  }

  function filterProducts(category) {
    if (!productGrid) return;
    let visibleCount = 0;
    productGrid.querySelectorAll(".product-item").forEach((product) => {
      let shouldShow;
      // switch statement handles each product category explicitly.
      switch (category) {
        case "food": shouldShow = product.dataset.category === "food"; break;
        case "toys": shouldShow = product.dataset.category === "toys"; break;
        case "accessories": shouldShow = product.dataset.category === "accessories"; break;
        case "all":
        default: shouldShow = true;
      }
      product.hidden = !shouldShow;
      product.classList.toggle("card-filter-in", shouldShow);
      if (shouldShow) visibleCount++;
    });
    document.querySelectorAll(".shop-filter").forEach((button) => {
      const active = button.dataset.filter === category;
      button.classList.toggle("is-active", active);
      button.classList.toggle("btn-primary", active);
      button.classList.toggle("btn-outline-primary", !active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (shopStatus) shopStatus.textContent = `Showing ${visibleCount} ${category === "all" ? "products" : `${category} products`}.`;
  }

  if (productGrid) {
    renderProducts();
    document.querySelectorAll(".shop-filter").forEach((button) => {
      button.addEventListener("click", () => {
        filterProducts(button.dataset.filter);
        playFeedbackSound(550);
      });
    });
    if (loadMoreButton) loadMoreButton.addEventListener("click", () => {
      visibleProductLimit = Math.min(visibleProductLimit + 3, productCatalog.length);
      renderProducts();
      playFeedbackSound(720);
    });
  }

  // Animate cards as they enter the page; respects reduced-motion preferences in CSS.
  document.querySelectorAll(".card, .icon-card, .pure-card").forEach((card, index) => {
    card.style.setProperty("--animation-delay", `${Math.min(index * 45, 360)}ms`);
    card.classList.add("js-card-ready");
  });

  // ================= Assignment 6: jQuery features =================
  // All jQuery code is kept in this external JavaScript file.
  if (window.jQuery) {
    (function () {
      console.log("jQuery is ready!");

      // Task 4: colourful scroll progress bar.
      if (!$("#scroll-progress").length) {
        $("body").prepend('<div id="scroll-progress" aria-hidden="true"><span></span></div>');
      }
      function updateScrollProgress() {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        $("#scroll-progress span").css("width", percent + "%");
      }
      $(window).on("scroll", updateScrollProgress);
      updateScrollProgress();

      // Task 5: animated number counters (the stats block is added on the Home page).
      if ($(".hero").length && !$("#jquery-stats").length) {
        $(".hero").after(
          '<section class="section jquery-stats" id="jquery-stats">' +
            '<div class="container stats-grid">' +
              '<div class="stat-card"><strong class="counter" data-count="1200">0</strong><span>Happy customers</span></div>' +
              '<div class="stat-card"><strong class="counter" data-count="350">0</strong><span>Pets supported</span></div>' +
              '<div class="stat-card"><strong class="counter" data-count="24">0</strong><span>Care support</span></div>' +
            '</div></section>'
        );
      }
      function animateCounters() {
        $(".counter").each(function () {
          const $counter = $(this);
          if ($counter.data("counted")) return;
          const target = Number($counter.attr("data-count"));
          $({ value: 0 }).animate({ value: target }, {
            duration: 1600,
            easing: "swing",
            step: function () { $counter.text(Math.floor(this.value).toLocaleString() + "+"); },
            complete: function () { $counter.text(target.toLocaleString() + "+"); }
          });
          $counter.data("counted", true);
        });
      }
      if ($(".counter").length) {
        const counterObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounters();
              counterObserver.disconnect();
            }
          });
        });
        counterObserver.observe($("#jquery-stats")[0]);
      }

      // Task 1: real-time product filtering.
      // Task 2: autocomplete suggestions.
      // Task 3: highlight matching product text.
      const $search = $("#jquery-search");
      const $suggestions = $("#search-suggestions");

      function escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      function applyShopSearch() {
        const keyword = $.trim($search.val() || "").toLowerCase();
        const activeCategory = $(".shop-filter.is-active").data("filter") || "all";
        let visibleCount = 0;
        const suggestionNames = [];

        $(".product-item").each(function () {
          const $item = $(this);
          const categoryMatches =
            activeCategory === "all" || $item.data("category") === activeCategory;
          const searchableText = $item.text().toLowerCase();
          const textMatches = !keyword || searchableText.includes(keyword);
          const shouldShow = categoryMatches && textMatches;

          // Use the hidden property so the search works together with category filters.
          $item.prop("hidden", !shouldShow);
          if (shouldShow) {
            visibleCount++;
            if (keyword && suggestionNames.length < 5) {
              suggestionNames.push($item.find("h3").first().text());
            }
          }

          // Restore the original card before highlighting text nodes only.
          // Never run a search/replace on HTML markup: it can corrupt class attributes.
          const $body = $item.find(".card-body");
          if ($body.data("original-html")) {
            $body.html($body.data("original-html"));
          } else {
            $body.data("original-html", $body.html());
          }

          if (keyword && shouldShow) {
            const walker = document.createTreeWalker($body[0], NodeFilter.SHOW_TEXT, {
              acceptNode: function (node) {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                if (node.parentElement && node.parentElement.closest("mark, script, style")) {
                  return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
              }
            });
            const textNodes = [];
            while (walker.nextNode()) textNodes.push(walker.currentNode);

            textNodes.forEach(function (textNode) {
              const text = textNode.nodeValue;
              const regex = new RegExp(escapeRegExp(keyword), "ig");
              let match;
              let lastIndex = 0;
              const fragment = document.createDocumentFragment();

              while ((match = regex.exec(text)) !== null) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                const mark = document.createElement("mark");
                mark.className = "search-highlight";
                mark.textContent = match[0];
                fragment.appendChild(mark);
                lastIndex = match.index + match[0].length;
              }

              if (lastIndex > 0) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
                textNode.parentNode.replaceChild(fragment, textNode);
              }
            });
          }
        });

        $suggestions.empty();
        suggestionNames.forEach(function (name) {
          $("<button>", {
            type: "button",
            class: "suggestion-item",
            role: "option",
            text: name
          }).appendTo($suggestions).on("click", function () {
            $search.val(name);
            applyShopSearch();
            $suggestions.empty();
          });
        });

        if (keyword && suggestionNames.length === 0) {
          $("<div>", {
            class: "suggestion-empty",
            text: "No matching products found"
          }).appendTo($suggestions);
        }

        if ($("#shop-status").length) {
          $("#shop-status").text(
            "Showing " + visibleCount + " " +
            (visibleCount === 1 ? "product" : "products") + "."
          );
        }
      }

      if ($search.length) {
        $search.on("input keyup", applyShopSearch);
        $search.on("keydown", function (event) {
          if (event.key === "Escape") $suggestions.empty();
        });
        applyShopSearch();
      }

      // Keep search and category filters synchronized.
      $(".shop-filter").on("click", function () {
        window.setTimeout(applyShopSearch, 0);
      });

      // Task 6: loading spinner on contact and signup form submit.
      function showLoading($button) {
        if ($button.data("loading")) return;
        $button.data("loading", true).prop("disabled", true)
          .html('<span class="jquery-spinner" aria-hidden="true"></span> Please wait…');
        window.setTimeout(function () {
          $button.data("loading", false).prop("disabled", false).text($button.data("original-label"));
        }, 1500);
      }
      $("form#contact-form, form#signup-form").each(function () {
        const $form = $(this);
        const $button = $form.find('button[type="submit"]').first();
        if (!$button.length) return;
        $button.data("original-label", $button.text());
        $form.on("submit", function () {
          // Existing validation remains in place; only show loading for valid-looking forms.
          const valid = this.checkValidity() ||
            ($form.find("#signup-name").val() && $form.find("#signup-email")[0]?.checkValidity() &&
             $form.find("#signup-password").val()?.length >= 8 &&
             $form.find("#signup-password").val() === $form.find("#signup-confirm").val());
          if (valid) showLoading($button);
        });
      });

      // Shared toast helper for successful actions.
      function showToast(message) {
        let $toast = $("#jquery-toast");
        if (!$toast.length) $toast = $('<div id="jquery-toast" role="status" aria-live="polite"></div>').appendTo("body");
        $toast.stop(true, true).text(message).fadeIn(180).delay(2100).fadeOut(450);
      }

      // Task 7: temporary notifications for form submissions and product actions.
      $("#contact-form, #signup-form").on("submit", function () {
        showToast("Thank you! Your form was submitted in demo mode.");
      });
      $(document).on("click", ".shop-filter, #load-more-products", function () {
        showToast("Shop view updated.");
      });
      // Add a simple Add to basket action to each product card.
      $(document).on("click", ".product-item .card-body", function (event) {
        if ($(event.target).closest(".rating-star").length) return;
      });
      $(document).on("click", ".product-item .card-body", function () {
        // Notification is triggered by the dedicated button below.
      });
      function addCartButtons() {
        $(".product-item .card-body").each(function () {
          const $body = $(this);
          if (!$body.find(".jquery-cart-button").length) {
            $("<button>", { type: "button", class: "btn btn-outline-primary btn-sm jquery-cart-button", text: "Add to basket" })
              .appendTo($body);
          }
        });
      }
      addCartButtons();
      const productObserver = new MutationObserver(addCartButtons);
      const productGridNode = $("#product-grid")[0];
      if (productGridNode) productObserver.observe(productGridNode, { childList: true, subtree: true });
      $(document).on("click", ".jquery-cart-button", function () {
        showToast("Item added to basket!");
      });

      // Task 8: copy-to-clipboard button with checkmark and tooltip.
      $(document).on("click", ".copy-button", async function () {
        const $button = $(this);
        const selector = $button.attr("data-copy-target");
        const text = $(selector).text().trim();
        try {
          await navigator.clipboard.writeText(text);
          $button.html('<span class="copy-icon">✓</span> Copied!');
          $button.attr("title", "Copied to clipboard!");
          showToast("Copied to clipboard!");
          window.setTimeout(function () {
            $button.html('<span class="copy-icon">📄</span> Copy');
            $button.attr("title", "");
          }, 1800);
        } catch (error) {
          showToast("Clipboard access is unavailable in this browser.");
        }
      });

      // Task 9: lazy-load images only when they approach the viewport.
      function loadVisibleImages() {
        $("img[data-lazy-src]").each(function () {
          const $image = $(this);
          if ($image.offset().top < $(window).scrollTop() + $(window).height() + 120) {
            $image.attr("src", $image.attr("data-lazy-src"));
            $image.removeAttr("data-lazy-src");
          }
        });
      }
      $(window).on("scroll", loadVisibleImages);
      loadVisibleImages();
    })();
  } else {
    console.error("jQuery failed to load. Check the CDN connection.");
  }

});
