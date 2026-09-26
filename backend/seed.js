import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Company from './models/Company.js';
import Job from './models/Job.js';
import Application from './models/Application.js';

dotenv.config();

export const seedData = async (shouldExit = true) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobportal');
    }
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await Application.deleteMany({});
    await Job.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({});

    console.log('🧹 Existing data wiped.');

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@fresherjobs.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+91 9876543210',
      bio: 'Master administrator of FresherJob Portal'
    });

    // 2. Create Recruiters
    const recruiter1 = await User.create({
      name: 'Ananya Deshmukh',
      email: 'recruiter@techcorp.com',
      password: 'recruiterpassword123',
      role: 'recruiter',
      phone: '+91 9123456780',
      bio: 'Lead University Talent Acquisition at TechCorp India',
      recruiterProfile: {
        companyName: 'TechCorp Solutions',
        designation: 'Senior Campus Recruiter'
      }
    });

    const recruiter2 = await User.create({
      name: 'Kavita Menon',
      email: 'hiring@innovatehub.io',
      password: 'recruiterpassword123',
      role: 'recruiter',
      phone: '+91 9822334455',
      bio: 'Tech Recruiter specializing in early talent and fresh grads',
      recruiterProfile: {
        companyName: 'InnovateHub Technologies',
        designation: 'HR Talent Lead'
      }
    });

    const recruiter3 = await User.create({
      name: 'Vikram Singhania',
      email: 'talent@fintechplus.com',
      password: 'recruiterpassword123',
      role: 'recruiter',
      phone: '+91 9988776655',
      bio: 'Hiring upcoming engineering graduates for high-scale FinTech',
      recruiterProfile: {
        companyName: 'FinTech Plus',
        designation: 'Director of Talent'
      }
    });

    // 3. Create Companies
    const company1 = await Company.create({
      name: 'TechCorp Solutions',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      website: 'https://techcorpsolutions.example.com',
      description: 'TechCorp is a leading enterprise software provider building cloud-native SaaS applications for global customers.',
      industry: 'Software & Technology',
      location: 'Bengaluru, Karnataka',
      companySize: '201-500',
      foundedYear: 2018,
      verified: true,
      createdBy: recruiter1._id
    });

    const company2 = await Company.create({
      name: 'InnovateHub Technologies',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
      website: 'https://innovatehub.example.com',
      description: 'InnovateHub builds AI-driven products for modern teams, empowering early-career engineers to create impact quickly.',
      industry: 'Artificial Intelligence & SaaS',
      location: 'Hyderabad, Telangana',
      companySize: '51-200',
      foundedYear: 2021,
      verified: true,
      createdBy: recruiter2._id
    });

    const company3 = await Company.create({
      name: 'FinTech Plus',
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
      website: 'https://fintechplus.example.com',
      description: 'FinTech Plus powers seamless digital payments and wealth tech across Southeast Asia and India.',
      industry: 'Financial Technology',
      location: 'Pune, Maharashtra',
      companySize: '500+',
      foundedYear: 2016,
      verified: true,
      createdBy: recruiter3._id
    });

    // Link companies back to recruiters
    recruiter1.recruiterProfile.company = company1._id;
    await recruiter1.save();
    recruiter2.recruiterProfile.company = company2._id;
    await recruiter2.save();
    recruiter3.recruiterProfile.company = company3._id;
    await recruiter3.save();

    // 4. Create Job Seekers (Freshers)
    const seeker1 = await User.create({
      name: 'Rahul Sharma',
      email: 'fresher@example.com',
      password: 'seekerpassword123',
      role: 'seeker',
      phone: '+91 9765432109',
      bio: 'Enthusiastic 2025 Computer Science graduate passionate about Full Stack Development with React, Node.js, and MongoDB.',
      seekerProfile: {
        headline: 'Aspiring Full Stack Web Developer | 2025 CS Graduate',
        graduationBatch: '2025',
        experienceLevel: 'Fresher',
        skills: ['React.js', 'Node.js', 'JavaScript', 'Tailwind CSS', 'MongoDB', 'Git', 'REST APIs'],
        education: [
          {
            degree: 'B.Tech in Computer Science and Engineering',
            fieldOfStudy: 'Computer Science',
            institution: 'National Institute of Technology',
            graduationYear: '2025',
            cgpaPercentage: '8.7 CGPA'
          },
          {
            degree: 'Higher Secondary Certificate (12th)',
            fieldOfStudy: 'Science (PCM)',
            institution: 'Delhi Public School',
            graduationYear: '2021',
            cgpaPercentage: '92%'
          }
        ],
        resume: {
          filename: 'Rahul_Sharma_Resume.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          originalName: 'Rahul_Sharma_Resume.pdf',
          uploadedAt: new Date()
        },
        githubUrl: 'https://github.com',
        linkedinUrl: 'https://linkedin.com',
        portfolioUrl: 'https://rahulsharma.dev',
        preferredJobType: ['Full-time', 'Internship', 'Remote'],
        expectedSalary: '₹5,00,000 - ₹8,00,000 LPA'
      }
    });

    const seeker2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      password: 'seekerpassword123',
      role: 'seeker',
      phone: '+91 9898989898',
      bio: 'Frontend-focused 2024 graduate crafting delightful user interfaces and responsive web applications.',
      seekerProfile: {
        headline: 'Frontend Engineer Trainee | React & UI/UX Enthusiast',
        graduationBatch: '2024',
        experienceLevel: 'Fresher',
        skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Figma', 'TypeScript'],
        education: [
          {
            degree: 'B.E. in Information Technology',
            fieldOfStudy: 'Information Technology',
            institution: 'Pune Institute of Computer Technology',
            graduationYear: '2024',
            cgpaPercentage: '8.9 CGPA'
          }
        ],
        resume: {
          filename: 'Priya_Patel_Resume.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          originalName: 'Priya_Patel_Resume.pdf',
          uploadedAt: new Date()
        },
        githubUrl: 'https://github.com',
        linkedinUrl: 'https://linkedin.com',
        preferredJobType: ['Full-time', 'Remote']
      }
    });

    // 5. Create Freshers Jobs
    const jobs = await Job.create([
      {
        title: 'Junior Frontend Developer (React.js)',
        company: company1._id,
        companyName: company1.name,
        companyLogo: company1.logo,
        postedBy: recruiter1._id,
        description: 'We are looking for passionate 2024/2025 graduates to join our frontend engineering team! You will build responsive web applications using React, Tailwind CSS, and modern web standards. Mentorship from senior architects provided.',
        requirements: [
          'Strong understanding of HTML5, CSS3, JavaScript (ES6+)',
          'Hands-on experience or academic projects with React.js',
          'Familiarity with responsive UI using Tailwind CSS or CSS Modules',
          'Good knowledge of Git and version control',
          'Graduation batch: 2024, 2025, or 2026'
        ],
        responsibilities: [
          'Develop reusable React UI components following clean code practices',
          'Integrate RESTful backend APIs with proper error handling',
          'Collaborate with UI/UX designers and product managers',
          'Participate in agile sprints and code reviews'
        ],
        skills: ['React.js', 'JavaScript', 'Tailwind CSS', 'HTML5', 'Git', 'REST APIs'],
        jobType: 'Full-time',
        workplaceType: 'Remote',
        experienceLevel: 'Fresher (0-1 yrs)',
        eligibleBatches: ['2024', '2025', '2026'],
        location: 'Bengaluru (Remote Available)',
        salary: { min: 450000, max: 700000, currency: 'INR', period: 'per year', isDisclosed: true },
        openings: 5,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'active',
        isFeatured: true,
        applicationsCount: 1
      },
      {
        title: 'Full Stack Developer Intern (MERN)',
        company: company2._id,
        companyName: company2.name,
        companyLogo: company2.logo,
        postedBy: recruiter2._id,
        description: '6-month paid internship for college students and recent graduates. High opportunity for PPO (Pre-Placement Offer) based on internship performance. Build modern microservices and web portals.',
        requirements: [
          'Pre-final or Final year students (2025 / 2026 batch)',
          'Understanding of React, Node.js, Express, and MongoDB',
          'Eagerness to learn cloud deployments (Docker, AWS basics)',
          'Strong problem-solving and algorithmic thinking'
        ],
        responsibilities: [
          'Design and maintain backend endpoints and database schemas',
          'Assist in developing internal tooling and client dashboards',
          'Write unit tests and documentation'
        ],
        skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
        jobType: 'Internship',
        workplaceType: 'Remote',
        experienceLevel: 'Internship',
        eligibleBatches: ['2025', '2026'],
        location: 'Remote, India',
        salary: { min: 25000, max: 40000, currency: 'INR', period: 'per month', isDisclosed: true },
        openings: 3,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        isFeatured: true,
        applicationsCount: 1
      },
      {
        title: 'Graduate Trainee Software Engineer',
        company: company3._id,
        companyName: company3.name,
        companyLogo: company3.logo,
        postedBy: recruiter3._id,
        description: 'FinTech Plus is hiring enthusiastic engineers for our FastTrack Graduate Program. You will rotate across Backend, DevOps, and Security teams while receiving structured training from industry veterans.',
        requirements: [
          'B.E. / B.Tech / MCA in Computer Science, IT, or related fields',
          'Solid foundation in Data Structures, Algorithms, and OOP concepts',
          'Knowledge of Java, Python, or JavaScript',
          'Minimum 60% or 6.5 CGPA throughout academics'
        ],
        responsibilities: [
          'Participate in high-volume payment transaction engine optimization',
          'Write clean, maintainable, and test-driven code',
          'Diagnose and troubleshoot technical incidents'
        ],
        skills: ['Java', 'Python', 'SQL', 'Data Structures', 'OOP'],
        jobType: 'Full-time',
        workplaceType: 'Hybrid',
        experienceLevel: 'Fresher (0-1 yrs)',
        eligibleBatches: ['2024', '2025'],
        location: 'Pune, Maharashtra',
        salary: { min: 600000, max: 950000, currency: 'INR', period: 'per year', isDisclosed: true },
        openings: 8,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'active',
        isFeatured: true,
        applicationsCount: 0
      },
      {
        title: 'Associate QA & Automation Tester (Fresher)',
        company: company1._id,
        companyName: company1.name,
        companyLogo: company1.logo,
        postedBy: recruiter1._id,
        description: 'Start your tech career in quality engineering. Learn modern test automation frameworks including Cypress, Selenium, and Postman API automation with our dedicated QA leads.',
        requirements: [
          'Basic understanding of Software Testing Life Cycle (STLC)',
          'Familiarity with JavaScript or Python for automation scripting',
          'Sharp eye for detail and keen analytical mindset',
          'Strong communication skills'
        ],
        responsibilities: [
          'Execute manual and automated test suites for web features',
          'Document bugs clearly in Jira with reproduction steps',
          'Verify bug fixes and perform regression testing'
        ],
        skills: ['Software Testing', 'JavaScript', 'Selenium', 'Postman', 'Manual Testing'],
        jobType: 'Full-time',
        workplaceType: 'On-site',
        experienceLevel: 'Fresher (0-1 yrs)',
        eligibleBatches: ['2023', '2024', '2025'],
        location: 'Bengaluru, Karnataka',
        salary: { min: 380000, max: 550000, currency: 'INR', period: 'per year', isDisclosed: true },
        openings: 4,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        status: 'active',
        isFeatured: false,
        applicationsCount: 0
      },
      {
        title: 'Junior Data Analyst (Fresher)',
        company: company2._id,
        companyName: company2.name,
        companyLogo: company2.logo,
        postedBy: recruiter2._id,
        description: 'Exciting opportunity for numbers-driven freshers! Transform raw metrics into actionable business intelligence using SQL, Python, and PowerBI dashboards.',
        requirements: [
          'Degree in Statistics, Mathematics, Computer Science, or Engineering',
          'Proficiency with SQL queries and joins',
          'Hands-on experience with Python (Pandas, NumPy) or Excel models',
          'Basic familiarity with PowerBI or Tableau is a plus'
        ],
        responsibilities: [
          'Build interactive dashboards for product performance metrics',
          'Perform exploratory data analysis and generate insights',
          'Cleanse and validate incoming telemetry data sets'
        ],
        skills: ['SQL', 'Python', 'PowerBI', 'Excel', 'Data Analysis'],
        jobType: 'Full-time',
        workplaceType: 'Hybrid',
        experienceLevel: 'Fresher (0-1 yrs)',
        eligibleBatches: ['2024', '2025'],
        location: 'Hyderabad, Telangana',
        salary: { min: 420000, max: 650000, currency: 'INR', period: 'per year', isDisclosed: true },
        openings: 2,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
        isFeatured: false,
        applicationsCount: 0
      },
      {
        title: 'UI/UX Design Intern (Fresh Graduate)',
        company: company3._id,
        companyName: company3.name,
        companyLogo: company3.logo,
        postedBy: recruiter3._id,
        description: 'Join our design studio to craft modern mobile and web financial interfaces. Work with Figma design systems and user research.',
        requirements: [
          'Portfolio or case studies demonstrating UI/UX concepts',
          'Proficiency in Figma or Adobe XD',
          'Understanding of typography, color theory, and responsive layouts',
          'Strong passion for user-centered design'
        ],
        responsibilities: [
          'Create high-fidelity wireframes and interactive prototypes',
          'Collaborate with frontend developers on design handoffs',
          'Assist in conducting usability tests'
        ],
        skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems'],
        jobType: 'Internship',
        workplaceType: 'Remote',
        experienceLevel: 'Internship',
        eligibleBatches: ['2024', '2025', '2026'],
        location: 'Remote, India',
        salary: { min: 20000, max: 35000, currency: 'INR', period: 'per month', isDisclosed: true },
        openings: 2,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        status: 'active',
        isFeatured: true,
        applicationsCount: 0
      }
    ]);

    // 6. Create Seed Applications
    await Application.create([
      {
        job: jobs[0]._id,
        applicant: seeker1._id,
        recruiter: recruiter1._id,
        resume: seeker1.seekerProfile.resume,
        coverNote: 'Hello! As a 2025 Computer Science graduate with hands-on projects in React and Tailwind CSS, I am very excited about this role and eager to contribute.',
        status: 'Shortlisted',
        statusHistory: [
          { status: 'Applied', note: 'Application submitted', updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { status: 'Under Review', note: 'Profile reviewed by hiring manager', updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { status: 'Shortlisted', note: 'Strong project portfolio in React', updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
        ],
        recruiterNotes: 'Impressive GitHub portfolio with clean React component hierarchy.'
      },
      {
        job: jobs[1]._id,
        applicant: seeker1._id,
        recruiter: recruiter2._id,
        resume: seeker1.seekerProfile.resume,
        coverNote: 'I would love to be part of the MERN stack internship program at InnovateHub Technologies.',
        status: 'Interview Scheduled',
        statusHistory: [
          { status: 'Applied', note: 'Application submitted', updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
          { status: 'Shortlisted', note: 'Selected for technical round', updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { status: 'Interview Scheduled', note: 'Technical Round 1 scheduled', updatedAt: new Date() }
        ],
        interviewDetails: {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          mode: 'Google Meet',
          linkOrVenue: 'https://meet.google.com/abc-defg-hij',
          notes: 'Prepare to discuss your MERN projects and basic JavaScript algorithms.'
        },
        recruiterNotes: 'Shortlisted for technical interview.'
      }
    ]);

    console.log('✅ Database successfully seeded with:');
    console.log('   - 1 Admin: admin@fresherjobs.com / adminpassword123');
    console.log('   - 3 Recruiters (e.g. recruiter@techcorp.com / recruiterpassword123)');
    console.log('   - 2 Freshers (e.g. fresher@example.com / seekerpassword123)');
    console.log('   - 3 Companies (TechCorp, InnovateHub, FinTech Plus)');
    console.log('   - 6 Fresher Job Listings (Full-time & Internships)');
    console.log('   - 2 Applications with status tracking');

    if (shouldExit) {
      process.exit(0);
    }
    return { success: true, message: 'Database successfully seeded' };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (shouldExit) {
      process.exit(1);
    }
    throw error;
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedData(true);
}

export default seedData;
