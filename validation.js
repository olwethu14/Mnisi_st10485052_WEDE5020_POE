
document.addEventListener("DOMContentLoaded", function () {
  // Gallery search engine
  const searchForm = document.getElementById("search-form");
  const input = document.getElementById("searchInput");
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const noResults = document.getElementById("no-results");

  function runSearch(query) {
    const q = query.trim().toLowerCase();
    let visibleCount = 0;

    galleryItems.forEach(function (img) {
      const altText = (img.alt || "").toLowerCase();
      const fileName = (img.src || "").toLowerCase();
      const matches = !q || altText.includes(q) || fileName.includes(q);

      img.style.display = matches ? "" : "none";
      if (matches) visibleCount++;
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  if (searchForm && input) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      runSearch(input.value);
    });

    input.addEventListener("input", function () {
      if (input.value.trim().length >= 2 || input.value.trim() === "") {
        runSearch(input.value);
      }
    });
  }

  // Prefill the enquiry message when a service or package is selected.
  const params = new URLSearchParams(window.location.search);
  const messageField = document.getElementById("message");
  const selectedPackage = params.get("package");
  const selectedService = params.get("service");

  if (messageField && (selectedPackage || selectedService)) {
    const selection = selectedPackage || selectedService;
    const selectionType = selectedPackage ? "package" : "service";
    messageField.value = "Hi, I am interested in the " + selection + " " + selectionType +
      ". Please let me know what is required from me to get started.";
  }

  // Enquiry response
  const enquiryForm = document.getElementById("myForm");
  if (enquiryForm) {
    const successBox = document.getElementById("success-box");
    const successTitle = document.getElementById("success-title");
    const successMessage = successBox ? successBox.querySelector("p") : null;
    const closeSuccessButton = document.getElementById("close-success");
    const formError = document.getElementById("form-error");

    enquiryForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (formError) formError.hidden = true;

      const submitButton = enquiryForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        await fetch(enquiryForm.action, {
          method: "POST",
          body: new FormData(enquiryForm),
          mode: "no-cors"
        });

        if (!successBox || !successTitle || !successMessage || !closeSuccessButton) {
          throw new Error("The enquiry confirmation elements are missing from the page.");
        }

        successTitle.textContent = "Thank You for Your Enquiry!";
        successMessage.innerHTML = "Your enquiry has been received. We will get back to you within <strong>2 working days</strong>.";
        enquiryForm.reset();
        enquiryForm.hidden = true;
        successBox.classList.add("show");
        successBox.setAttribute("aria-hidden", "false");
        closeSuccessButton.focus();
      } catch (error) {
        if (formError) {
          formError.textContent = "We couldn't submit your enquiry. Please try again.";
          formError.hidden = false;
        }
        console.error("Enquiry submission failed:", error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });

    if (successBox && closeSuccessButton) {
      closeSuccessButton.addEventListener("click", function () {
        successBox.classList.remove("show");
        successBox.setAttribute("aria-hidden", "true");
        enquiryForm.hidden = false;
        enquiryForm.querySelector("#name").focus();
      });
    }
  }

  // Gallery lightbox
  const fullImgBox = document.getElementById("fullImgBox");
  const fullImg = document.getElementById("fullImg");

  window.openFullImg = function (picture) {
    if (fullImgBox && fullImg) {
      fullImgBox.style.display = "flex";
      fullImg.src = picture;
    }
  };

  window.closeFullImg = function () {
    if (fullImgBox) {
      fullImgBox.style.display = "none";
    }
  };
});
