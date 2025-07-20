currentYear.innerHTML = new Date().getFullYear();
lastModified.innerHTML = `Last Modification: ${document.lastModified}`;

const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
]
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
    return course.subject === filter;
  });

  if (filtered.length === 0) {
    courseListEl.innerHTML = "<li>No courses found.</li>";
    return;
  }

  filtered.forEach(course => {
    const li = document.createElement("li");

    li.textContent = `${course.subject} ${course.number} - ${course.title}`;

    li.className = course.completed ? "completed" : "not-completed";

    const status = document.createElement("span");
    status.textContent = course.completed ? "Completed" : "Not Completed";
    status.className = course.completed ? "completed-status" : "not-completed-status";
    status.setAttribute("aria-label", status.textContent);
    status.style.marginLeft = "1rem";
    status.style.fontWeight = "600";

    li.appendChild(status);
    courseListEl.appendChild(li);
  });

  const totalCredits = filtered.reduce((sum, course) => sum + course.credits, 0);

  const totalCreditsEl = document.getElementById("total-credits");
  if (totalCreditsEl) {
    totalCreditsEl.textContent = `Total Credits: ${totalCredits}`;
  }
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

  currentYearEl.textContent = new Date().getFullYear();
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