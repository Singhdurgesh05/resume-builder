export default {
  // Personal Info (used by all templates)
  name: "John Doe",
  phone: "+91-8989898989",
  email: "johndoe@gmail.com",
  linkedin: "linkedin.com/in/johndoe",
  github: "github.com/johndoe",
  location: "Bangalore, India",

  // Modern template specific
  role: "Senior Software Engineer",
  address: {
    line1: "123 Tech Street",
    city: "Bangalore",
    state: "Karnataka",
    zip: "560001"
  },

  summary:
    "Innovative Programmer and Internet Entrepreneur striving to make the world more unified and connected through technology. Passionate about building scalable systems and mentoring teams.",

  // Education (supports both templates)
  education: [
    {
      // Classic template fields
      degree: "B.Tech in Computer Science",
      institute: "IIT Bombay — 8.26 GPA",
      points: [
        "Graduated with distinction",
        "Built a cloud-hosted IoT platform"
      ],
      date: "2018 – 2022",
      location: "Mumbai, India",

      // Modern template fields
      school: "IIT Bombay",
      start: "2018",
      end: "2022"
    }
  ],

  // Experience (supports both templates)
  experience: [
    {
      // Classic template fields
      title: "Software Development Engineer I",
      company: "Amazon",
      points: [
        "Improved system latency by 30%",
        "Used Redis & DynamoDB caching"
      ],
      date: "2022 – Present",
      location: "Bangalore, India",

      // Modern template fields
      position: "Software Development Engineer I",
      start: "2022",
      end: "Present",
      description: [
        "Improved system latency by 30%",
        "Used Redis & DynamoDB caching"
      ]
    }
  ],

  // Projects (Classic template)
  projects: [
    {
      title: "URL Shortener",
      link: "https://urlshortener.com",
      role: "Lead Developer",
      points: [
        "Handled 5M+ req/day",
        "Implemented hashing"
      ],
      date: "2021 – 2022"
    }
  ],

  // Achievements (Classic template)
  achievements: [
    "Top 200 in Google Kick Start",
    "Winner of Amazon SDE Hackathon",
    "Published IEEE Papers"
  ],

  // Skills (supports both templates)
  skills: {
    // Classic template format
    languages: "Java, Python, JS, C++",
    frameworks: "React, Node.js, Spring",
    databases: "PostgreSQL, MongoDB, DynamoDB",
    cloud: "AWS (Lambda, EC2, S3)",
    tools: "Git, Docker, Jenkins",

    // Modern template format (array with levels)
    skillsList: [
      { name: "JavaScript", level: 90 },
      { name: "React", level: 85 },
      { name: "Node.js", level: 80 },
      { name: "Python", level: 75 },
      { name: "AWS", level: 70 }
    ]
  },

  // Languages (Modern template)
  languages: ["English", "Hindi", "Spanish"]
};
