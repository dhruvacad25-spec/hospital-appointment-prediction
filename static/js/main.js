document.addEventListener("DOMContentLoaded", function () {
  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // AOS init
  if (window.AOS) {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }

  // Sticky nav shadow on scroll
  var nav = document.getElementById("siteNav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });
  }

  // ---- Hero ledger strip: sequential "resolve" animation ----
  var ledgerRows = document.querySelectorAll(".ledger-row[data-outcome]");
  if (ledgerRows.length) {
    ledgerRows.forEach(function (row, i) {
      var outcome = row.getAttribute("data-outcome"); // show | risk | miss
      setTimeout(function () {
        row.classList.add("is-resolved", "t-" + outcome);
        var tag = row.querySelector(".slot-tag");
        if (tag) {
          tag.classList.add("tag-" + outcome);
          tag.textContent = outcome === "show" ? "Attending" : outcome === "risk" ? "At risk" : "No-show";
        }
      }, 600 + i * 480);
    });
  }

  // ---- Predict form: loading state on submit ----
  var predictForm = document.getElementById("predictForm");
  if (predictForm) {
    predictForm.addEventListener("submit", function () {
      var btn = predictForm.querySelector(".btn-submit");
      if (btn) btn.classList.add("is-loading");
    });
  }

  // ---- Result page: animate confidence meter on load ----
  var meterFill = document.querySelector(".confidence-meter .meter-fill");
  if (meterFill) {
    var pct = meterFill.getAttribute("data-pct") || "0";
    requestAnimationFrame(function () {
      setTimeout(function () {
        meterFill.style.width = pct + "%";
      }, 250);
    });
  }

  // ---- Dashboard charts (Chart.js) ----
  if (window.Chart && document.getElementById("attendanceTrendChart")) {
    var inkSoft = "rgba(11,34,38,0.55)";
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = inkSoft;

    new Chart(document.getElementById("attendanceTrendChart"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        datasets: [
          {
            label: "Attended",
            data: [78, 80, 81, 83, 82, 84, 85, 86],
            borderColor: "#1F6F6B",
            backgroundColor: "rgba(31,111,107,0.12)",
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 2.5,
          },
          {
            label: "No-show",
            data: [22, 20, 19, 17, 18, 16, 15, 14],
            borderColor: "#C8533F",
            backgroundColor: "rgba(200,83,63,0.08)",
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: "rgba(11,34,38,0.06)" }, ticks: { callback: function (v) { return v + "%"; } } },
          x: { grid: { display: false } },
        },
      },
    });

    new Chart(document.getElementById("departmentChart"), {
      type: "bar",
      data: {
        labels: ["Cardiology", "Orthopedics", "Pediatrics", "Dermatology", "General", "ENT"],
        datasets: [
          {
            label: "No-show rate",
            data: [24, 17, 11, 19, 15, 13],
            backgroundColor: "#E8A33D",
            borderRadius: 6,
            maxBarThickness: 34,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: "rgba(11,34,38,0.06)" }, ticks: { callback: function (v) { return v + "%"; } } },
          x: { grid: { display: false } },
        },
      },
    });

    new Chart(document.getElementById("statusDonut"), {
      type: "doughnut",
      data: {
        labels: ["Attended", "At risk", "No-show"],
        datasets: [
          {
            data: [68, 14, 18],
            backgroundColor: ["#36C5B5", "#E8A33D", "#C8533F"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: { legend: { display: false } },
      },
    });
  }
});