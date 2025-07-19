currentYear.innerHTML = new Date().getFullYear();
lastModified.innerHTML = `Last Modification: ${document.lastModified}`;

const courses = [
  { code: "WDD 130", name: "Web Fundamentals", category: "WDD", completed: true, link: "https://catalog.byupathway.edu/courses/WDD130" },
  { code: "WDD 131", name: "Dynamic Web Fundamentals", category: "WDD", completed: true, link: "https://catalog.byupathway.edu/courses/WDD131" },
  { code: "WDD 231", name: "Web Frontend Development I", category: "WDD", completed: false, link: "https://catalog.byupathway.edu/courses/WDD231" },
  { code: "CSE 110", name: "Introduction to Programming", category: "CSE", completed: true, link: "https://catalog.byupathway.edu/courses/CSEPC110" },
  { code: "CSE 111", name: "Programming with Functions", category: "CSE", completed: true, link: "https://catalog.byupathway.edu/courses/CSE111" },
  { code: "CSE 210", name: "Programming with Classes", category: "CSE", completed: false, link: "https://catalog.byupathway.edu/courses/CSE210" }
];

const courseListEl = document.getElementById("course-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const hamburgerBtn = document.getElementById("hamburger");
const navMenu = document.getElementById("primary-navigation");
const currentYearEl = document.getElementById("currentYear");
const lastModifiedEl = document.getElementById("lastModified");

function renderCourses(filter = "all") {
  courseListEl.innerHTML = "";

  const filtered = courses.filter(course => {
    if (filter === "all") return true;
    return course.category === filter;
  });

  if (filtered.length === 0) {
    courseListEl.innerHTML = "<li>No courses found.</li>";
    document.getElementById("total-credits").textContent = "Total Credits: 0";
    return;
  }

  filtered.forEach(course => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = course.link;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = `${course.code} - ${course.name}`;
    a.setAttribute("aria-label", `${course.code} ${course.name}`);

    const status = document.createElement("span");
    status.textContent = course.completed ? "Completed" : "Not Completed";
    status.className = course.completed ? "completed-status" : "not-completed-status";
    status.setAttribute("aria-label", status.textContent);

    li.className = course.completed ? "completed" : "not-completed";
    li.appendChild(a);
    li.appendChild(status);

    courseListEl.appendChild(li);
  });
    
  const totalCredits = filtered.reduce((sum, course) => sum + 2, 0);
  document.getElementById("total-credits").textContent = `Total Credits: ${totalCredits}`;
}



filterButtons.forEach(button => {
  button.addEventListener("click", () => {

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    const filter = button.dataset.filter;
    renderCourses(filter);
  });
});


function init() {

  renderCourses();

  const year = new Date().getFullYear();
  currentYearEl.textContent = year;

  lastModifiedEl.textContent = `Last Modified: ${document.lastModified}`;

  hamburgerBtn.addEventListener("click", () => {
    const expanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
    hamburgerBtn.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
      navMenu.classList.remove("open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", init);