// Education data structure for Morocco's education system

// Pre-University Education
export const preUniversityEducation = {
  primary: {
    name: "Primary Education",
    ageRange: "6-12 years",
    duration: "6 years",
    description: "Foundation education covering basic literacy, numeracy, and knowledge",
    levels: [
      {
        name: "First Cycle (CP1-CE2)",
        grades: ["CP1 (1st grade)", "CP2 (2nd grade)", "CE1 (3rd grade)", "CE2 (4th grade)"],
        focus: "Basic reading, writing, arithmetic, and introduction to French"
      },
      {
        name: "Second Cycle (CM1-CM2)",
        grades: ["CM1 (5th grade)", "CM2 (6th grade)"],
        focus: "Deepening knowledge and preparing for secondary education"
      }
    ],
    subjects: [
      "Arabic", "French", "Islamic Education", "Mathematics", 
      "Science", "Social Studies", "Physical Education", "Arts"
    ],
    certifications: ["Primary Education Certificate (CPS)"],
    institutions: [
      "Public Primary Schools", 
      "Private Primary Schools", 
      "Mission Schools (French, Spanish, American curriculum)"
    ]
  },
  
  lowerSecondary: {
    name: "Lower Secondary Education (Collège)",
    ageRange: "12-15 years",
    duration: "3 years",
    description: "General education continuing from primary and preparing students for specialized tracks",
    grades: ["1st year", "2nd year", "3rd year"],
    subjects: [
      "Arabic", "French", "English", "Mathematics", "Physics", "Chemistry", 
      "Biology", "History", "Geography", "Islamic Education", 
      "Physical Education", "Technology", "Arts"
    ],
    certifications: ["Lower Secondary Education Certificate (BEC)"],
    institutions: [
      "Public Collèges",
      "Private Collèges",
      "International Schools"
    ]
  },
  
  upperSecondary: {
    name: "Upper Secondary Education (Lycée)",
    ageRange: "15-18 years",
    duration: "3 years",
    description: "Specialized education preparing students for university or professional life",
    structure: [
      {
        name: "Common Core (Tronc Commun)",
        duration: "1 year",
        description: "First year with general education before specialization"
      },
      {
        name: "Baccalaureate Cycle",
        duration: "2 years",
        description: "Two years of specialized education leading to baccalaureate"
      }
    ],
    tracks: {
      scientificBac: {
        name: "Scientific Baccalaureate",
        options: [
          {
            name: "Mathematical Sciences",
            mainSubjects: ["Mathematics", "Physics", "Chemistry"],
            description: "Focus on advanced mathematics and physical sciences"
          },
          {
            name: "Experimental Sciences",
            mainSubjects: ["Biology", "Chemistry", "Physics", "Earth Sciences"],
            description: "Focus on experimental and life sciences"
          },
          {
            name: "Agricultural Sciences",
            mainSubjects: ["Agricultural Sciences", "Biology", "Chemistry"],
            description: "Focus on agriculture, animal husbandry, and environmental sciences"
          },
          {
            name: "Technical Sciences",
            mainSubjects: ["Engineering Sciences", "Mathematics", "Physics"],
            description: "Focus on technical and engineering applications"
          }
        ]
      },
      literaryBac: {
        name: "Literary Baccalaureate",
        options: [
          {
            name: "Arts",
            mainSubjects: ["Arts", "Literature", "Languages", "Philosophy"],
            description: "Focus on artistic expression, literature, and philosophy"
          },
          {
            name: "Humanities",
            mainSubjects: ["Philosophy", "Literature", "History", "Geography"],
            description: "Focus on human sciences and philosophical studies"
          },
          {
            name: "Foreign Languages",
            mainSubjects: ["French", "English", "Spanish", "German"],
            description: "Focus on mastering multiple languages and translation"
          }
        ]
      },
      economicBac: {
        name: "Economic Sciences Baccalaureate",
        options: [
          {
            name: "Economic Sciences",
            mainSubjects: ["Economics", "Mathematics", "Management", "Accounting"],
            description: "Focus on economic theory and applications"
          },
          {
            name: "Management Sciences",
            mainSubjects: ["Management", "Accounting", "Economics", "Law"],
            description: "Focus on business management and commercial sciences"
          }
        ]
      },
      technicalBac: {
        name: "Technical Baccalaureate",
        options: [
          {
            name: "Mechanical Engineering",
            mainSubjects: ["Mechanical Design", "Manufacturing", "Mathematics"],
            description: "Focus on mechanical systems and manufacturing"
          },
          {
            name: "Electrical Engineering",
            mainSubjects: ["Electrical Systems", "Electronics", "Automation"],
            description: "Focus on electrical and electronic systems"
          },
          {
            name: "Civil Engineering",
            mainSubjects: ["Construction", "Architecture", "Technical Drawing"],
            description: "Focus on building and infrastructure construction"
          },
          {
            name: "Computer Science",
            mainSubjects: ["Programming", "Databases", "Systems Architecture"],
            description: "Focus on computer systems and programming"
          }
        ]
      },
      professionalBac: {
        name: "Professional Baccalaureate",
        description: "Vocational education combining academic subjects with professional training",
        options: [
          {
            name: "Hospitality and Tourism",
            mainSubjects: ["Tourism Geography", "Hotel Management", "Languages", "Customer Service"],
            description: "Focus on hospitality industry skills and tourism management"
          },
          {
            name: "Accounting and Management",
            mainSubjects: ["Bookkeeping", "Accounting Software", "Business Communication"],
            description: "Focus on practical accounting and office management skills"
          },
          {
            name: "Automotive Technology",
            mainSubjects: ["Vehicle Mechanics", "Electrical Systems", "Diagnostics"],
            description: "Focus on vehicle repair and maintenance"
          },
          {
            name: "Digital Technology",
            mainSubjects: ["Web Development", "Computer Support", "Network Administration"],
            description: "Focus on information technology support and services"
          },
          {
            name: "Health Services",
            mainSubjects: ["Basic Nursing", "Healthcare Administration", "Patient Care"],
            description: "Focus on healthcare support roles"
          }
        ]
      }
    },
    certifications: ["Baccalaureate Diploma"],
    institutions: [
      "Public Lycées", 
      "Private Lycées", 
      "Technical High Schools",
      "International Schools"
    ]
  }
};

// Higher Education System
export const educationTracks = {
  scientific: {
    name: "Scientific Track",
    description: "Focus on mathematics, physics, biology, chemistry and related sciences",
    universities: [
      "Mohammed V University (Rabat)",
      "Hassan II University (Casablanca)",
      "Cadi Ayyad University (Marrakech)",
      "Mohammed VI Polytechnic University (Ben Guerir)",
      "University of Science and Technology Houari Boumediene (Algiers)",
      "Ibn Tofail University (Kenitra)",
      "Abdelmalek Essaâdi University (Tetouan)",
      "Ibn Zohr University (Agadir)",
      "Sidi Mohammed Ben Abdellah University (Fez)",
      "Sultan Moulay Slimane University (Beni Mellal)"
    ],
    specializedInstitutes: [
      "National Institute of Statistics and Applied Economics (INSEA)",
      "National School of Applied Sciences (ENSA) - multiple campuses",
      "Faculty of Sciences - multiple universities",
      "Institute of Applied Technology (ITA)"
    ],
    programs: {
      undergraduate: [
        "Bachelor in Mathematics",
        "Bachelor in Physics",
        "Bachelor in Chemistry",
        "Bachelor in Biology",
        "Bachelor in Geology",
        "Bachelor in Computer Science",
        "Bachelor in Statistics"
      ],
      graduate: [
        "Master in Pure Mathematics",
        "Master in Applied Mathematics",
        "Master in Theoretical Physics",
        "Master in Experimental Physics",
        "Master in Organic Chemistry",
        "Master in Inorganic Chemistry",
        "Master in Molecular Biology",
        "Master in Ecology",
        "Master in Biochemistry",
        "Master in Geophysics"
      ],
      doctoral: [
        "PhD in Mathematics",
        "PhD in Physics",
        "PhD in Chemistry",
        "PhD in Biology",
        "PhD in Earth Sciences"
      ]
    },
    careers: [
      "Researcher",
      "Laboratory Technician",
      "Data Analyst",
      "Science Teacher/Professor",
      "Environmental Consultant",
      "Quality Control Specialist",
      "Scientific Writer"
    ]
  },
  
  literary: {
    name: "Literary & Humanities Track",
    description: "Focus on languages, literature, philosophy, history and social sciences",
    universities: [
      "Mohammed V University (Rabat)",
      "Hassan II University (Casablanca)",
      "Ibn Tofail University (Kenitra)",
      "Ibn Zohr University (Agadir)",
      "Cadi Ayyad University (Marrakech)",
      "Sidi Mohammed Ben Abdellah University (Fez)",
      "Abdelmalek Essaâdi University (Tetouan)",
      "Mohammed I University (Oujda)",
      "Moulay Ismail University (Meknes)",
      "Chouaib Doukkali University (El Jadida)"
    ],
    specializedInstitutes: [
      "Institute of Hispanic-Lusophone Studies (Rabat)",
      "King Fahd School of Translation (Tangier)",
      "Institute of Amazigh Culture (Rabat)",
      "Higher School of Arts and Humanities (Casa)"
    ],
    programs: {
      undergraduate: [
        "Bachelor in Arabic Literature",
        "Bachelor in French Literature",
        "Bachelor in English Studies",
        "Bachelor in Hispanic Studies",
        "Bachelor in Philosophy",
        "Bachelor in History",
        "Bachelor in Geography",
        "Bachelor in Sociology",
        "Bachelor in Anthropology",
        "Bachelor in Islamic Studies"
      ],
      graduate: [
        "Master in Comparative Literature",
        "Master in Linguistics",
        "Master in Modern Philosophy",
        "Master in Contemporary History",
        "Master in Cultural Anthropology",
        "Master in Gender Studies",
        "Master in Translation Studies",
        "Master in Moroccan Heritage",
        "Master in Middle Eastern Studies"
      ],
      doctoral: [
        "PhD in Literature",
        "PhD in Linguistics",
        "PhD in Philosophy",
        "PhD in History",
        "PhD in Anthropology",
        "PhD in Cultural Studies"
      ]
    },
    careers: [
      "Teacher/Professor",
      "Translator/Interpreter",
      "Writer/Editor",
      "Cultural Officer",
      "Archivist",
      "Museum Curator",
      "Tourism Guide",
      "Language Instructor",
      "NGO Coordinator"
    ]
  },
  
  economic: {
    name: "Economic & Management Sciences",
    description: "Focus on economics, finance, business management and commerce",
    universities: [
      "ENCG (National Schools of Business & Management) - Network of 13 schools across Morocco",
      "ISCAE (Higher Institute of Commerce and Business Administration) - Casablanca & Rabat",
      "Hassan II University - Faculty of Economic Sciences (Casablanca)",
      "Mohammed V University - Faculty of Law, Economics and Social Sciences (Rabat)",
      "Cadi Ayyad University - Faculty of Legal, Economic and Social Sciences (Marrakech)",
      "Ibn Zohr University - Faculty of Legal, Economic and Social Sciences (Agadir)",
      "Ibn Tofail University - Faculty of Economics (Kenitra)",
      "Moulay Ismail University - Faculty of Legal, Economic and Social Sciences (Meknes)"
    ],
    specializedInstitutes: [
      "ISCAE - Higher Institute of Commerce and Business Administration",
      "ENCG - National School of Commerce and Management (multiple campuses)",
      "ISEM - Higher Institute of Management Studies (Casablanca)",
      "HEM Business School (Casablanca, Rabat, Tangier, Fez, Marrakech)",
      "ESCA School of Management (Casablanca)",
      "Morocco School of Business (MSB) (Rabat)"
    ],
    programs: {
      undergraduate: [
        "Bachelor in Economics",
        "Bachelor in Management",
        "Bachelor in Marketing",
        "Bachelor in Finance",
        "Bachelor in Accounting",
        "Bachelor in International Business",
        "Bachelor in Logistics and Supply Chain Management",
        "Bachelor in Human Resources Management"
      ],
      graduate: [
        "Master in Finance",
        "Master in Marketing",
        "Master in Business Administration (MBA)",
        "Master in International Trade",
        "Master in Accounting and Auditing",
        "Master in Economic Analysis",
        "Master in Business Intelligence",
        "Master in Project Management",
        "Master in Tourism Management",
        "Master in Logistics and Transport"
      ],
      doctoral: [
        "PhD in Economics",
        "PhD in Management Sciences",
        "PhD in Finance",
        "PhD in Marketing"
      ],
      professional: [
        "Professional License in Banking",
        "Professional License in Insurance",
        "Professional License in Digital Marketing",
        "Professional License in Entrepreneurship",
        "Executive MBA",
        "Professional Certificate in Financial Analysis"
      ]
    },
    certifications: [
      "Certified Public Accountant (CPA)",
      "Chartered Financial Analyst (CFA)",
      "Project Management Professional (PMP)",
      "Supply Chain Management Professional (SCMP)"
    ],
    careers: [
      "Financial Analyst",
      "Marketing Manager",
      "Accountant",
      "Business Consultant",
      "Human Resources Manager",
      "Entrepreneur",
      "Investment Banker",
      "Economic Researcher",
      "Supply Chain Manager"
    ]
  },
  
  health: {
    name: "Health Sciences",
    description: "Focus on medicine, pharmacy, dentistry, and healthcare professions",
    universities: [
      "Mohammed V University - Faculty of Medicine (Rabat)",
      "Hassan II University - Faculty of Medicine and Pharmacy (Casablanca)",
      "Sidi Mohammed Ben Abdellah University - Faculty of Medicine and Pharmacy (Fez)",
      "Cadi Ayyad University - Faculty of Medicine and Pharmacy (Marrakech)",
      "Mohammed VI University of Health Sciences (Casablanca)",
      "Mohammed I University - Faculty of Medicine (Oujda)",
      "Abdelmalek Essaâdi University - Faculty of Medicine and Pharmacy (Tangier)"
    ],
    specializedInstitutes: [
      "National Institute of Oncology (Rabat)",
      "Pasteur Institute of Morocco (Casablanca)",
      "Higher Institute of Nursing and Health Techniques (ISPITS) - 23 institutes nationwide",
      "Royal Institute of Health Military (Rabat)",
      "National School of Public Health (Rabat)",
      "International University of Rabat - Health Sciences Campus"
    ],
    programs: {
      undergraduate: [
        "Doctor of Medicine (MD) - 7 years",
        "Doctor of Dental Surgery (DDS) - 6 years",
        "Doctor of Pharmacy (PharmD) - 6 years",
        "Bachelor in Nursing Sciences - 3 years",
        "Bachelor in Laboratory Technology - 3 years",
        "Bachelor in Radiology Technology - 3 years",
        "Bachelor in Physiotherapy - 3 years",
        "Bachelor in Midwifery - 3 years"
      ],
      specialization: [
        "Cardiology",
        "Neurology",
        "Pediatrics",
        "Surgery",
        "Obstetrics and Gynecology",
        "Psychiatry",
        "Dermatology",
        "Ophthalmology",
        "Ear, Nose and Throat (ENT)",
        "Anesthesiology",
        "Oncology",
        "Emergency Medicine",
        "Family Medicine"
      ],
      graduate: [
        "Master in Public Health",
        "Master in Hospital Management",
        "Master in Biomedical Engineering",
        "Master in Clinical Pharmacy",
        "Master in Medical Biology",
        "Master in Nutrition",
        "Master in Epidemiology"
      ],
      doctoral: [
        "PhD in Medical Sciences",
        "PhD in Pharmaceutical Sciences",
        "PhD in Dental Sciences",
        "PhD in Biomedical Research"
      ]
    },
    vocationalHealth: [
      "Diploma in Nursing Care (2 years)",
      "Diploma in Emergency Medical Techniques (2 years)",
      "Diploma in Medical Secretary (2 years)",
      "Diploma in Dental Assistant (2 years)",
      "Diploma in Pharmacy Assistant (2 years)"
    ],
    careers: [
      "Physician",
      "Surgeon",
      "Dentist",
      "Pharmacist",
      "Nurse",
      "Midwife",
      "Laboratory Technician",
      "Radiologist",
      "Physiotherapist",
      "Hospital Administrator",
      "Public Health Official",
      "Medical Researcher"
    ]
  },
  
  engineering: {
    name: "Engineering & Technology",
    description: "Focus on various engineering fields, information technology, and technical sciences",
    universities: [
      "Mohammed V University - Mohammadia School of Engineers (EMI)",
      "Hassan II University - Faculty of Sciences and Techniques (Casablanca)",
      "National School of Applied Sciences (ENSA) - Multiple cities",
      "National School of Computer Science and Systems Analysis (ENSIAS) - Rabat",
      "National School of Mineral Industry (ENIM) - Rabat",
      "Hassania School of Public Works (EHTP) - Casablanca",
      "National Institute of Posts and Telecommunications (INPT) - Rabat",
      "National School of Architecture (ENA) - Multiple cities",
      "International University of Rabat - School of Engineering"
    ],
    specializedInstitutes: [
      "École Centrale Casablanca",
      "EMINES - School of Mining Engineers (Ben Guerir)",
      "National Institute of Statistics and Applied Economics (INSEA)",
      "OFPPT - Specialized Institutes of Applied Technology",
      "1337 School of Coding and Programming",
      "YouCode - Digital School (Youssoufia & Safi)"
    ],
    programs: {
      preparatoryCourses: [
        "CPGE - Classes Préparatoires aux Grandes Écoles (2 years preparation for engineering schools)"
      ],
      undergraduate: [
        "Engineering Diploma (5 years - including 2 years prep)",
        "Bachelor in Computer Science",
        "Bachelor in Information Systems",
        "Bachelor in Civil Engineering",
        "Bachelor in Electrical Engineering",
        "Bachelor in Mechanical Engineering",
        "Bachelor in Industrial Engineering",
        "Bachelor in Chemical Engineering",
        "Bachelor in Agricultural Engineering",
        "Bachelor in Aerospace Engineering"
      ],
      graduate: [
        "Master in Computer Science",
        "Master in Telecommunications",
        "Master in Renewable Energy",
        "Master in Robotics",
        "Master in Structural Engineering",
        "Master in Environmental Engineering",
        "Master in Industrial Systems",
        "Master in Computer Security",
        "Master in Artificial Intelligence",
        "Master in Smart Cities"
      ],
      doctoral: [
        "PhD in Engineering Sciences",
        "PhD in Computer Science",
        "PhD in Telecommunications",
        "PhD in Energy Engineering",
        "PhD in Mechanical Engineering",
        "PhD in Civil Engineering"
      ]
    },
    technicalDiplomas: [
      "Specialized Technician in Computer Networks",
      "Specialized Technician in Software Development",
      "Specialized Technician in Industrial Maintenance",
      "Specialized Technician in Automotive Technology",
      "Specialized Technician in Air Conditioning & Refrigeration",
      "Specialized Technician in Construction",
      "Specialized Technician in Electrical Installation"
    ],
    careers: [
      "Civil Engineer",
      "Software Engineer",
      "Mechanical Engineer",
      "Electrical Engineer",
      "Telecommunications Engineer",
      "IT Project Manager",
      "Data Scientist",
      "Systems Architect",
      "Network Administrator",
      "Quality Control Engineer",
      "Industrial Designer"
    ]
  },
  
  arts: {
    name: "Arts & Architecture",
    description: "Focus on fine arts, design, architecture and creative fields",
    universities: [
      "National School of Architecture (ENA) - Rabat, Tetouan, Fez, Marrakech",
      "Higher Institute of Arts and Professions (ISAP) - Casablanca",
      "National Institute of Fine Arts (INBA) - Tetouan",
      "School of Visual Arts (Casablanca)",
      "Higher School of Fine Arts (Casablanca)",
      "ESAV - School of Visual Arts (Marrakech)",
      "Cadi Ayyad University - Faculty of Arts (Marrakech)",
      "Mohammed V University - Faculty of Arts (Rabat)"
    ],
    specializedInstitutes: [
      "Conservatory of Music (Multiple cities)",
      "Higher Institute of Dramatic Art and Cultural Animation (Rabat)",
      "Casa Moda Academy (Casablanca)",
      "National Institute of Archaeology and Heritage (INSAP)",
      "Royal Institute of Amazigh Culture (IRCAM)",
      "Higher School of Visual Arts (Casablanca)",
      "SAR - School of Architecture in Rabat"
    ],
    programs: {
      undergraduate: [
        "Diploma of Architecture (6 years)",
        "Bachelor in Fine Arts",
        "Bachelor in Graphic Design",
        "Bachelor in Interior Design",
        "Bachelor in Fashion Design",
        "Bachelor in Audiovisual Production",
        "Bachelor in Performing Arts",
        "Bachelor in Music",
        "Bachelor in Cinema and Audiovisual",
        "Bachelor in Animation"
      ],
      graduate: [
        "Master in Architecture",
        "Master in Urban Planning",
        "Master in Landscape Design",
        "Master in Contemporary Art",
        "Master in Design and Innovation",
        "Master in Film Direction",
        "Master in Heritage Conservation",
        "Master in Textile Design",
        "Master in Cultural Management"
      ],
      doctoral: [
        "PhD in Architecture",
        "PhD in Art History",
        "PhD in Visual Arts",
        "PhD in Design",
        "PhD in Art and Heritage"
      ]
    },
    vocationalArts: [
      "Diploma in Photography",
      "Diploma in Ceramics",
      "Diploma in Traditional Crafts",
      "Diploma in Jewelry Design",
      "Diploma in Theatre Arts",
      "Diploma in Dance",
      "Diploma in Instrument Performance",
      "Diploma in Culinary Arts"
    ],
    careers: [
      "Architect",
      "Interior Designer",
      "Graphic Designer",
      "Fashion Designer",
      "Film Director",
      "Photographer",
      "Animator",
      "Artist",
      "Museum Curator",
      "Art Teacher",
      "Urban Planner",
      "Art Director"
    ]
  },
  
  law: {
    name: "Law & Political Science",
    description: "Focus on legal studies, political science and public administration",
    universities: [
      "Mohammed V University - Faculty of Law (Rabat-Agdal)",
      "Mohammed V University - Faculty of Law (Rabat-Souissi)",
      "Hassan II University - Faculty of Law (Casablanca-Aïn Chock)",
      "Hassan II University - Faculty of Law (Casablanca-Mohammedia)",
      "Cadi Ayyad University - Faculty of Law (Marrakech)",
      "Ibn Zohr University - Faculty of Law (Agadir)",
      "Abdelmalek Essaâdi University - Faculty of Law (Tangier)",
      "Sidi Mohammed Ben Abdellah University - Faculty of Law (Fez)",
      "Moulay Ismail University - Faculty of Law (Meknes)",
      "Mohammed I University - Faculty of Law (Oujda)"
    ],
    specializedInstitutes: [
      "National Institute of Judicial Studies (Rabat)",
      "ENA - National School of Administration (Rabat)",
      "IRES - Royal Institute for Strategic Studies",
      "IRAT - Royal Academy of Territorial Administration",
      "Higher Institute of Magistracy (ISM)"
    ],
    programs: {
      undergraduate: [
        "Bachelor in Private Law (French/Arabic)",
        "Bachelor in Public Law (French/Arabic)",
        "Bachelor in Business Law",
        "Bachelor in International Law",
        "Bachelor in Criminal Law",
        "Bachelor in Political Science",
        "Bachelor in Public Administration",
        "Bachelor in International Relations"
      ],
      graduate: [
        "Master in Business Law",
        "Master in International Law",
        "Master in Public Law",
        "Master in Criminal Justice",
        "Master in Constitutional Law",
        "Master in Banking and Financial Law",
        "Master in Sports Law",
        "Master in Intellectual Property",
        "Master in Political Science",
        "Master in Diplomatic Studies",
        "Master in Human Rights",
        "Master in Environmental Law"
      ],
      doctoral: [
        "PhD in Private Law",
        "PhD in Public Law",
        "PhD in Criminal Law",
        "PhD in Political Science",
        "PhD in Constitutional Studies",
        "PhD in International Relations"
      ]
    },
    professionalTraining: [
      "Professional Training for Lawyers (2 years)",
      "Professional Training for Judges (2 years)",
      "Professional Training for Notaries (1 year)",
      "Professional Training for Bailiffs (1 year)",
      "Professional Training for Court Clerks"
    ],
    careers: [
      "Lawyer (Avocat)",
      "Judge (Magistrat)",
      "Notary",
      "Legal Advisor",
      "Corporate Counsel",
      "Diplomat",
      "Political Analyst",
      "Public Administrator",
      "Compliance Officer",
      "Human Rights Advocate",
      "Court Bailiff",
      "Parliamentary Assistant"
    ]
  },
  
  education: {
    name: "Education & Teaching",
    description: "Focus on pedagogy, teaching methods and educational sciences",
    universities: [
      "Mohammed V University - Faculty of Education Sciences (Rabat)",
      "Hassan II University - Faculty of Education Sciences (Casablanca)",
      "CRMEF - Regional Centers for Education and Training (16 centers nationwide)",
      "ENS - Normal Superior Schools (Rabat, Casablanca, Tetouan, Marrakech, Fez, Meknes)",
      "Ibn Tofail University - Faculty of Education (Kenitra)",
      "AREF - Regional Academies for Education and Training (12 regional academies)"
    ],
    specializedInstitutes: [
      "Higher Normal School (ENS) - Multiple cities",
      "CRMEF - Regional Centers for Education and Training",
      "Center for Educational Research and Curriculum Development",
      "Institute for Lifelong Learning",
      "National Center for Educational Innovation"
    ],
    programs: {
      undergraduate: [
        "Bachelor in Education Sciences",
        "Bachelor in Teaching Arabic",
        "Bachelor in Teaching French",
        "Bachelor in Teaching English",
        "Bachelor in Teaching Mathematics",
        "Bachelor in Teaching Science",
        "Bachelor in Teaching History and Geography",
        "Bachelor in Teaching Islamic Studies",
        "Bachelor in Special Education",
        "Bachelor in Preschool Education"
      ],
      graduate: [
        "Master in Educational Psychology",
        "Master in Curriculum and Instruction",
        "Master in Educational Administration",
        "Master in Educational Technology",
        "Master in Teaching Methods",
        "Master in Evaluation and Assessment",
        "Master in Special Education",
        "Master in Adult Education",
        "Master in Educational Counseling"
      ],
      doctoral: [
        "PhD in Education Sciences",
        "PhD in Teaching and Learning",
        "PhD in Educational Administration",
        "PhD in Educational Psychology"
      ]
    },
    teacherTraining: [
      "Qualified Teacher Certificate - Primary Education",
      "Qualified Teacher Certificate - Lower Secondary Education",
      "Qualified Teacher Certificate - Upper Secondary Education",
      "Certificate in Educational Administration",
      "Certificate in Educational Supervision",
      "Certificate in Educational Guidance"
    ],
    careers: [
      "Primary School Teacher",
      "Secondary School Teacher",
      "University Professor",
      "School Principal",
      "Educational Inspector",
      "Educational Counselor",
      "Curriculum Developer",
      "Educational Psychologist",
      "Special Education Teacher",
      "Adult Educator",
      "Educational Policy Analyst",
      "Educational Materials Developer"
    ]
  },
  
  vocational: {
    name: "Vocational & Technical Training",
    description: "Focus on practical skills and professional qualifications",
    institutions: [
      "OFPPT - Office of Vocational Training and Work Promotion (almost 400 centers nationwide)",
      "Specialized Institutes of Applied Technology (ISTA)",
      "Qualifying Training Centers (CQP)",
      "Apprenticeship Training Centers (CFA)",
      "Agricultural Training Institutes",
      "Tourism and Hospitality Training Institutes",
      "Crafts Training Centers",
      "Maritime Fishing Institutes"
    ],
    sectors: [
      {
        name: "Industrial Trades",
        programs: [
          "Automotive Mechanics",
          "Industrial Maintenance",
          "Welding and Metal Fabrication",
          "Electronics",
          "Electricity",
          "HVAC & Refrigeration",
          "Textile Manufacturing",
          "CNC Programming and Operation",
          "Plastics Processing"
        ]
      },
      {
        name: "Construction & Building",
        programs: [
          "Plumbing",
          "Electricity Installation",
          "Construction Techniques",
          "Carpentry",
          "Painting and Coating",
          "Aluminum Fabrication",
          "Topography",
          "Masonry",
          "Real Estate Management"
        ]
      },
      {
        name: "Digital Technology",
        programs: [
          "Computer Networking",
          "Web Development",
          "Software Programming",
          "Computer Maintenance",
          "Multimedia Production",
          "Database Administration",
          "Digital Marketing",
          "IT Support",
          "Video Game Development"
        ]
      },
      {
        name: "Business & Administration",
        programs: [
          "Accounting & Management",
          "Office Administration",
          "Human Resources Assistant",
          "Commercial Sales",
          "Business Communication",
          "Banking Operations",
          "Insurance",
          "Logistics and Supply Chain",
          "Administrative Assistant"
        ]
      },
      {
        name: "Hospitality & Tourism",
        programs: [
          "Culinary Arts",
          "Hotel Reception",
          "Restaurant Service",
          "Tourism Guidance",
          "Travel Agency Operations",
          "Event Management",
          "Hotel Management",
          "Pastry & Bakery",
          "Tourism Marketing"
        ]
      },
      {
        name: "Healthcare & Social Support",
        programs: [
          "Nursing Assistant",
          "Dental Assistant",
          "Pharmacy Assistant",
          "Medical Secretary",
          "Childcare",
          "Elder Care",
          "Community Service",
          "Medical Equipment Maintenance"
        ]
      },
      {
        name: "Agriculture & Fishing",
        programs: [
          "Agricultural Technology",
          "Animal Husbandry",
          "Horticulture",
          "Irrigation Techniques",
          "Food Processing",
          "Forest Management",
          "Maritime Fishing",
          "Aquaculture",
          "Farm Management"
        ]
      },
      {
        name: "Arts & Crafts",
        programs: [
          "Traditional Crafts",
          "Leather Work",
          "Ceramics",
          "Jewelry Making",
          "Carpet Weaving",
          "Wood Carving",
          "Fashion Design",
          "Graphic Design",
          "Interior Decoration"
        ]
      }
    ],
    levels: [
      {
        name: "Specialization Certificate",
        duration: "6-12 months",
        entryRequirement: "No specific academic requirements"
      },
      {
        name: "Qualification Certificate",
        duration: "1-2 years",
        entryRequirement: "9th grade completion"
      },
      {
        name: "Technician Certificate",
        duration: "2 years",
        entryRequirement: "Baccalaureate completion or equivalent"
      },
      {
        name: "Specialized Technician Certificate",
        duration: "2 years",
        entryRequirement: "Baccalaureate completion"
      },
      {
        name: "Professional Bachelor (LP)",
        duration: "1 year after Technician",
        entryRequirement: "Technician Certificate + work experience"
      }
    ]
  }
};

export const highSchoolSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Arabic Literature",
  "French",
  "English",
  "History/Geography",
  "Philosophy",
  "Economics",
  "Management",
  "Computer Science",
  "Physical Education",
  "Art/Music"
];

export const careerFields = [
  "Healthcare & Medicine",
  "Engineering & Technology",
  "Business & Management",
  "Education & Teaching",
  "Law & Justice",
  "Arts & Creativity",
  "Public Administration",
  "Science & Research",
  "Communication & Media",
  "Agriculture & Environmental Sciences",
  "Tourism & Hospitality",
  "Social Services"
];

export const softSkills = [
  "Communication",
  "Teamwork",
  "Problem Solving",
  "Critical Thinking",
  "Creativity",
  "Leadership",
  "Time Management",
  "Adaptability",
  "Public Speaking"
];

// Additional Educational Data

export const nationalExams = {
  primary: [
    {
      name: "Primary School Certificate",
      grade: "6th grade",
      subjects: ["Arabic", "French", "Mathematics", "Science"]
    }
  ],
  secondary: [
    {
      name: "Lower Secondary Education Certificate (Brevet)",
      grade: "9th grade",
      subjects: [
        "Arabic", "French", "Mathematics", "Physics & Chemistry", 
        "Natural Sciences", "History & Geography", "Islamic Education"
      ]
    },
    {
      name: "Baccalaureate Regional Exam",
      grade: "11th grade (1ère année Bac)",
      subjects: "Varies by track"
    },
    {
      name: "Baccalaureate National Exam",
      grade: "12th grade (2ème année Bac)",
      subjects: "Varies by track",
      description: "Main graduation exam determining university admission"
    }
  ]
};

export const languageOfInstruction = {
  primary: "Arabic with French introduction",
  secondary: "Arabic with increased French for scientific subjects",
  tertiary: {
    scientific: "Primarily French",
    literary: "Arabic and French",
    economic: "Mix of Arabic and French",
    engineering: "Primarily French",
    medicine: "French",
    law: "Primarily Arabic with some French"
  },
  notes: "English is increasingly used in higher education, especially in private institutions and business/technical fields"
};

export const educationGovernance = {
  ministry: "Ministry of National Education, Preschool and Sports",
  higherEducationMinistry: "Ministry of Higher Education, Scientific Research and Innovation",
  vocationalTrainingBody: "OFPPT - Office for Vocational Training and Work Promotion",
  regionalBodies: "AREF - Regional Academies for Education and Training (12 regions)"
};
