/**
 * TYT – Comments (Guestbook) with star ratings
 * -----------------------------------------------------------------
 * A public guestbook, backed by the same Firebase project already
 * used for the live Menu/Offers (tyt-cafe-8c2ae). Anyone can leave a
 * name + a 1–5 star rating + a comment; entries appear immediately,
 * newest first, and sync live for every visitor (no page reload
 * needed). An average-rating summary is computed from the same data.
 * -----------------------------------------------------------------
 */
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyA_iRaVTZwvi25XabH_PfC8cKK_BeYYRPY",
    authDomain: "tyt-cafe-8c2ae.firebaseapp.com",
    projectId: "tyt-cafe-8c2ae",
    storageBucket: "tyt-cafe-8c2ae.firebasestorage.app",
    messagingSenderId: "298823761893",
    appId: "1:298823761893:web:7652134d929a5466c9f90c",
    measurementId: "G-FPYN8MT74C"
  };

  const STAR_PATH = "M12 2.5 15.09 8.76 22 9.77 17 14.64 18.18 21.52 12 18.27 5.82 21.52 7 14.64 2 9.77 8.91 8.76 12 2.5Z";

  function tt(key, fallback) {
    return (window.TYT_I18N && window.TYT_I18N.t(key)) || fallback;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(ts) {
    try {
      const d = ts && ts.toDate ? ts.toDate() : null;
      if (!d) return "";
      const lang = window.TYT_I18N && window.TYT_I18N.getLang() === "ar" ? "ar-EG" : "en-GB";
      return d.toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" });
    } catch (e) {
      return "";
    }
  }

  /* Renders a read-only row of 5 stars, filled up to `rating` (rounded
     to the nearest whole star). Used on comment cards and the summary. */
  function starsHtml(rating) {
    const filled = Math.round(Math.max(0, Math.min(5, Number(rating) || 0)));
    let out = "";
    for (let i = 1; i <= 5; i++) {
      out += `<span class="${i <= filled ? "is-filled" : ""}"><svg viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg></span>`;
    }
    return out;
  }

  function initComments() {
    const form = document.getElementById("commentForm");
    const nameInput = document.getElementById("commentName");
    const messageInput = document.getElementById("commentMessage");
    const ratingInput = document.getElementById("commentRating");
    const ratingPicker = document.getElementById("ratingPicker");
    const submitBtn = document.getElementById("commentSubmitBtn");
    const statusEl = document.getElementById("commentStatus");
    const listEl = document.getElementById("commentsList");
    const emptyEl = document.getElementById("commentsEmpty");
    const summaryEl = document.getElementById("ratingSummary");
    const summaryScoreEl = document.getElementById("ratingSummaryScore");
    const summaryStarsEl = document.getElementById("ratingSummaryStars");
    const summaryCountEl = document.getElementById("ratingSummaryCount");

    if (!form || !listEl) return;

    /* ---- Star picker: click or keyboard (arrow keys / enter / space) ---- */
    let currentRating = 0;
    const starEls = ratingPicker ? Array.from(ratingPicker.querySelectorAll(".rating-picker-star")) : [];

    function paintPicker(value, isPreview) {
      starEls.forEach((el) => {
        const v = Number(el.dataset.value);
        el.classList.toggle(isPreview ? "is-hover" : "is-active", v <= value);
        if (!isPreview) el.classList.toggle("is-active", v <= currentRating);
        if (!isPreview) el.setAttribute("aria-checked", v === currentRating ? "true" : "false");
      });
    }

    function setRating(value) {
      currentRating = value;
      if (ratingInput) ratingInput.value = String(value);
      starEls.forEach((el, idx) => { el.tabIndex = Number(el.dataset.value) === value || (value === 0 && idx === 0) ? 0 : -1; });
      paintPicker(value, false);
    }

    if (ratingPicker && starEls.length) {
      starEls.forEach((el) => {
        const v = Number(el.dataset.value);
        el.addEventListener("click", () => setRating(v));
        el.addEventListener("mouseenter", () => paintPicker(v, true));
        el.addEventListener("mouseleave", () => paintPicker(currentRating, true));
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setRating(v); }
          else if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setRating(Math.min(5, v + 1)); starEls[Math.min(5, v + 1) - 1].focus(); }
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setRating(Math.max(1, v - 1)); starEls[Math.max(1, v - 1) - 1].focus(); }
        });
      });
    }

    /* ---- Firebase (classic "compat" build, loaded via plain <script>
       tags in the HTML — NOT an ES module). This is deliberate: ES
       modules are blocked by the browser when the page is opened as a
       local file (file://...) instead of through a real server, which
       would silently break the whole script, including the star
       picker above. The classic build has no such restriction, so the
       form works whether the site is opened locally or hosted. ---- */
    if (typeof firebase === "undefined") {
      console.info("TYT Comments: Firebase script did not load.");
      if (statusEl) {
        statusEl.classList.add("is-error");
        statusEl.textContent = tt("comments.error", "Something went wrong — please try again.");
      }
      return;
    }

    let db;
    try {
      const app = firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
      db = firebase.firestore(app);
    } catch (e) {
      console.info("TYT Comments: Firebase unavailable.", e);
      if (statusEl) {
        statusEl.classList.add("is-error");
        statusEl.textContent = tt("comments.error", "Something went wrong — please try again.");
      }
      return;
    }

    const commentsRef = db.collection("comments");

    function renderSummary(docs) {
      if (!summaryEl) return;
      const rated = docs.map((d) => Number(d.data().rating) || 0).filter((r) => r > 0);
      if (!rated.length) {
        summaryEl.hidden = true;
        return;
      }
      const avg = rated.reduce((a, b) => a + b, 0) / rated.length;
      summaryEl.hidden = false;
      if (summaryScoreEl) summaryScoreEl.textContent = avg.toFixed(1);
      if (summaryStarsEl) summaryStarsEl.innerHTML = starsHtml(avg);
      if (summaryCountEl) {
        const label = rated.length === 1
          ? tt("comments.ratingCountOne", "based on 1 review")
          : tt("comments.ratingCountMany", "based on {n} reviews").replace("{n}", String(rated.length));
        summaryCountEl.textContent = label;
      }
    }

    function renderComments(docs) {
      renderSummary(docs);
      if (!docs.length) {
        listEl.innerHTML = "";
        if (emptyEl) emptyEl.classList.add("show");
        return;
      }
      if (emptyEl) emptyEl.classList.remove("show");
      listEl.innerHTML = docs
        .map((d) => {
          const c = d.data();
          const initial = escapeHtml((c.name || "?").trim().charAt(0).toUpperCase() || "?");
          const rating = Number(c.rating) || 0;
          return `
          <article class="comment-card">
            <div class="comment-card-head">
              <span class="comment-avatar">${initial}</span>
              <div class="comment-meta">
                <span class="comment-name">${escapeHtml(c.name)}</span>
                <span class="comment-date">${formatDate(c.createdAt)}</span>
              </div>
              ${rating ? `<span class="star-rating">${starsHtml(rating)}</span>` : ""}
            </div>
            <p class="comment-message">${escapeHtml(c.message)}</p>
          </article>`;
        })
        .join("");
    }

    commentsRef
      .orderBy("createdAt", "desc")
      .limit(100)
      .onSnapshot(
        (snap) => renderComments(snap.docs),
        (err) => console.info("TYT Comments: live sync unavailable.", err)
      );

    let submitting = false;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (submitting) return;

      const name = nameInput.value.trim();
      const message = messageInput.value.trim();
      const rating = Number(ratingInput ? ratingInput.value : 0) || 0;

      if (!name || !message) {
        if (statusEl) {
          statusEl.classList.add("is-error");
          statusEl.textContent = tt("comments.errorFields", "Please fill in your name and review.");
        }
        return;
      }
      if (!rating) {
        if (statusEl) {
          statusEl.classList.add("is-error");
          statusEl.textContent = tt("comments.errorRating", "Please choose a star rating.");
        }
        return;
      }

      submitting = true;
      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = tt("comments.submitting", "Posting…");
      if (statusEl) {
        statusEl.classList.remove("is-error");
        statusEl.textContent = "";
      }

      try {
        await commentsRef.add({
          name: name.slice(0, 40),
          message: message.slice(0, 500),
          rating: Math.max(1, Math.min(5, rating)),
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        form.reset();
        setRating(0);
        if (statusEl) {
          statusEl.classList.remove("is-error");
          statusEl.textContent = tt("comments.success", "Thanks! Your review has been posted.");
        }
      } catch (err) {
        console.info("TYT Comments: failed to post.", err);
        if (statusEl) {
          statusEl.classList.add("is-error");
          statusEl.textContent = tt("comments.error", "Something went wrong — please try again.");
        }
      } finally {
        submitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initComments);
  } else {
    initComments();
  }
})();
