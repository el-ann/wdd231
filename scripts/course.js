document.addEventListener("DOMContentLoaded", () => {
    // Set current year and last modified date
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = "Last Modified: " + document.lastModified;

    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
            technology: ['Python'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
            technology: ['HTML', 'CSS'],
            completed: true // Marking this course as completed
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call, debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
            technology: ['Python'],
            completed: false
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
            technology: ['C#'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        }
    ];

    const displayCourses = (filter) => {
        const courseList = document.getElementById("course-list");
        courseList.innerHTML = "";
        let totalCredits = 0;

        const filteredCourses = courses.filter(course => filter === "all" || course.subject === filter);
        filteredCourses.forEach(course => {
            const button = document.createElement("button");
            button.textContent = `${course.subject} ${course.number}: ${course.title} (${course.credits} credits)`;
            button.classList.add('course-button');
            button.style.backgroundColor = course.completed ? "#d4edda" : "#f8d7da";
            courseList.appendChild(button);
            totalCredits += course.credits;
        });

        document.getElementById("total-credits").textContent = totalCredits;
    };

    displayCourses("all");

    window.filterCourses = (filter) => {
        displayCourses(filter);
    };

    const menuToggle = document.getElementById("menu");
    const navMenu = document.getElementById("nav-menu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });

    document.getElementById('all-courses').addEventListener('click', () => filterCourses('all'));
    document.getElementById('cse-courses').addEventListener('click', () => filterCourses('CSE'));
    document.getElementById('wdd-courses').addEventListener('click', () => filterCourses('WDD'));
});