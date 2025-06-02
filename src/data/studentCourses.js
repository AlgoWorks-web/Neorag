export const studentCourses = [
  {
    id: 1,
    title: "React Fundamentals",
    instructor: "Sarah Williams",
    description: "Learn the core concepts of React including components, props, state, and hooks.",
    progress: 65,
    thumbnail: "react-fundamentals",
    startDate: "2023-10-15",
    endDate: "2023-12-20",
    schedule: [
      {
        day: "Monday",
        time: "10:00 AM - 12:00 PM",
        type: "Live Session",
        zoomLink: "https://zoom.us/j/1234567890?pwd=abc123"
      },
      {
        day: "Wednesday",
        time: "10:00 AM - 12:00 PM",
        type: "Live Session",
        zoomLink: "https://zoom.us/j/1234567890?pwd=abc123"
      }
    ],
    materials: [
      { id: 1, name: "React Cheat Sheet.pdf", type: "pdf" },
      { id: 2, name: "Component Lifecycle Diagram.png", type: "image" },
      { id: 3, name: "Project Setup Guide.docx", type: "doc" }
    ],
    videos: [
      { id: 1, title: "Introduction to React", duration: "15:30", watched: true },
      { id: 2, title: "Components and Props", duration: "22:15", watched: true },
      { id: 3, title: "State and Lifecycle", duration: "28:45", watched: false },
      { id: 4, title: "Hooks in Depth", duration: "35:20", watched: false }
    ]
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    instructor: "Michael Chen",
    description: "Master advanced JavaScript concepts like closures, promises, async/await, and functional programming.",
    progress: 40,
    thumbnail: "advanced-js",
    startDate: "2023-11-01",
    endDate: "2024-01-15",
    schedule: [
      {
        day: "Tuesday",
        time: "2:00 PM - 4:00 PM",
        type: "Live Session",
        zoomLink: "https://zoom.us/j/0987654321?pwd=xyz789"
      },
      {
        day: "Thursday",
        time: "2:00 PM - 4:00 PM",
        type: "Live Session",
        zoomLink: "https://zoom.us/j/0987654321?pwd=xyz789"
      }
    ],
    materials: [
      { id: 1, name: "JavaScript Best Practices.pdf", type: "pdf" },
      { id: 2, name: "Async Patterns Cheat Sheet.pdf", type: "pdf" }
    ],
    videos: [
      { id: 1, title: "Closures and Scope", duration: "18:45", watched: true },
      { id: 2, title: "Promises and Async/Await", duration: "25:30", watched: false },
      { id: 3, title: "Functional Programming", duration: "32:10", watched: false }
    ]
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    instructor: "David Rodriguez",
    description: "Build scalable backend services with Node.js, Express, and MongoDB.",
    progress: 20,
    thumbnail: "nodejs-backend",
    startDate: "2023-11-10",
    endDate: "2024-02-05",
    schedule: [
      {
        day: "Friday",
        time: "1:00 PM - 3:00 PM",
        type: "Live Session",
        zoomLink: "https://zoom.us/j/5432167890?pwd=def456"
      }
    ],
    materials: [
      { id: 1, name: "Node.js Setup Guide.pdf", type: "pdf" },
      { id: 2, name: "Express Routing Cheat Sheet.pdf", type: "pdf" },
      { id: 3, name: "MongoDB Basics.docx", type: "doc" }
    ],
    videos: [
      { id: 1, title: "Introduction to Node.js", duration: "20:15", watched: true },
      { id: 2, title: "Building REST APIs with Express", duration: "30:45", watched: false }
    ]
  }
];