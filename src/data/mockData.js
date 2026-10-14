// Names are real; dates, fees and eligibility are ILLUSTRATIVE and NOT verified. Always check official sources.

/**
 * EduGuide Prototype Dataset
 * Institution, exam, and scholarship names correspond to real Indian entities.
 * All application dates, fee indicators, highlights, and eligibility summaries
 * are illustrative mock structures for student prototype demonstration only.
 */

// Student profile information
export const student = {
  name: 'Anirud',
  classStream: '12th, PCM',
  city: 'Chandigarh',
  interests: ['Electronics', 'Coding', 'Entrepreneurship'],
  target: 'B.Tech ECE',
};

// 6 Real Indian colleges and universities (col-1 to col-6)
export const colleges = [
  {
    id: 'col-1',
    name: 'Punjab Engineering College (PEC), Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh (UT)',
    course: 'Engineering',
    level: 'UG',
    fees: 'See official website',
    blurb: 'A public technical institute situated in Sector 12, Chandigarh.',
    highlights: [
      'Located in Chandigarh',
      'Offers undergraduate engineering programmes',
      'Check official site for current courses and admission criteria',
    ],
  },
  {
    id: 'col-2',
    name: 'Thapar Institute of Engineering and Technology, Patiala',
    city: 'Patiala',
    state: 'Punjab',
    course: 'Engineering',
    level: 'UG',
    fees: 'See official website',
    blurb: 'A private deemed-to-be university located in Patiala, Punjab.',
    highlights: [
      'Located in Patiala',
      'Offers undergraduate engineering programmes',
      'Check official site for current courses and admission criteria',
    ],
  },
  {
    id: 'col-3',
    name: 'NIT Jalandhar',
    city: 'Jalandhar',
    state: 'Punjab',
    course: 'Engineering',
    level: 'UG',
    fees: 'See official website',
    blurb: 'A public National Institute of Technology located in Jalandhar, Punjab.',
    highlights: [
      'Located in Jalandhar',
      'Offers undergraduate engineering programmes',
      'Check official site for current courses and admission criteria',
    ],
  },
  {
    id: 'col-4',
    name: 'IIT Ropar',
    city: 'Rupnagar',
    state: 'Punjab',
    course: 'Engineering',
    level: 'UG',
    fees: 'See official website',
    blurb: 'An Institute of National Importance located along the banks of the Satluj river in Rupnagar, Punjab.',
    highlights: [
      'Located in Rupnagar',
      'Offers undergraduate engineering programmes',
      'Check official site for current courses and admission criteria',
    ],
  },
  {
    id: 'col-5',
    name: 'IIIT Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    course: 'Engineering',
    level: 'UG',
    fees: 'See official website',
    blurb: 'An autonomous state university focused on information technology located in New Delhi.',
    highlights: [
      'Located in New Delhi',
      'Offers undergraduate engineering programmes',
      'Check official site for current courses and admission criteria',
    ],
  },
  {
    id: 'col-6',
    name: 'Panjab University, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh (UT)',
    course: 'Science',
    level: 'UG',
    fees: 'See official website',
    blurb: 'A historic public central-and-state funded collegiate university located in Chandigarh.',
    highlights: [
      'Located in Chandigarh',
      'Offers undergraduate science and interdisciplinary programmes',
      'Check official site for current courses and admission criteria',
    ],
  },
];

// 5 Real Indian entrance exams (exam-1 to exam-5)
export const exams = [
  {
    id: 'exam-1',
    name: 'JEE Main',
    level: 'UG',
    deadlineOffsetDays: 3,
    blurb: 'National-level entrance examination commonly used for engineering and architecture admissions.',
  },
  {
    id: 'exam-2',
    name: 'JEE Advanced',
    level: 'UG',
    deadlineOffsetDays: 7,
    blurb: 'National-level entrance exam conducted for admissions to Indian Institutes of Technology (IITs).',
  },
  {
    id: 'exam-3',
    name: 'BITSAT',
    level: 'UG',
    deadlineOffsetDays: 14,
    blurb: 'Computer-based entrance exam conducted for admissions to integrated first-degree programmes at BITS campuses.',
  },
  {
    id: 'exam-4',
    name: 'CUET (UG)',
    level: 'UG',
    deadlineOffsetDays: 28,
    blurb: 'Common University Entrance Test conducted for admissions to undergraduate programmes in central and participating universities.',
  },
  {
    id: 'exam-5',
    name: 'NEET (UG)',
    level: 'UG',
    deadlineOffsetDays: 45,
    blurb: 'National-level eligibility and entrance examination conducted for undergraduate medical and allied courses.',
  },
];

// 5 Real Indian scholarship schemes (sch-1 to sch-5)
export const scholarships = [
  {
    id: 'sch-1',
    name: 'National Means-cum-Merit Scholarship (NMMSS)',
    level: 'UG',
    eligibility: 'Merit and/or need-based criteria apply. Check the official notification.',
    deadlineOffsetDays: 2,
    amount: 'See official notification',
    blurb: 'Centrally sponsored scholarship scheme implemented by the Ministry of Education to support meritorious students.',
  },
  {
    id: 'sch-2',
    name: 'INSPIRE Scholarship (SHE)',
    level: 'UG',
    eligibility: 'Merit and/or need-based criteria apply. Check the official notification.',
    deadlineOffsetDays: 6,
    amount: 'See official notification',
    blurb: 'Scholarship for Higher Education offered by the Department of Science and Technology for natural and basic sciences.',
  },
  {
    id: 'sch-3',
    name: 'Reliance Foundation Undergraduate Scholarships',
    level: 'UG',
    eligibility: 'Merit and/or need-based criteria apply. Check the official notification.',
    deadlineOffsetDays: 16,
    amount: 'See official notification',
    blurb: 'Merit-cum-means scholarship programme supporting undergraduate students across disciplines.',
  },
  {
    id: 'sch-4',
    name: 'Post Matric Scholarship (via National Scholarship Portal)',
    level: 'UG',
    eligibility: 'Merit and/or need-based criteria apply. Check the official notification.',
    deadlineOffsetDays: 32,
    amount: 'See official notification',
    blurb: 'Government financial assistance scheme administered via the National Scholarship Portal.',
  },
  {
    id: 'sch-5',
    name: 'Central Sector Scholarship Scheme (CSSS)',
    level: 'UG',
    eligibility: 'Merit and/or need-based criteria apply. Check the official notification.',
    deadlineOffsetDays: 48,
    amount: 'See official notification',
    blurb: 'Department of Higher Education scholarship scheme for meritorious students pursuing regular university courses.',
  },
];

// 4 Starter tasks
export const tasks = [
  {
    id: 'task-1',
    title: 'Check JEE Main registration dates',
    relatedTo: 'JEE Main',
    dueOffsetDays: 2,
    done: false,
  },
  {
    id: 'task-2',
    title: 'Review eligibility for NMMSS scholarship',
    relatedTo: 'National Means-cum-Merit Scholarship (NMMSS)',
    dueOffsetDays: 3,
    done: false,
  },
  {
    id: 'task-3',
    title: 'Explore undergraduate programmes at PEC Chandigarh',
    relatedTo: 'Punjab Engineering College (PEC), Chandigarh',
    dueOffsetDays: 6,
    done: false,
  },
  {
    id: 'task-4',
    title: 'Check official syllabus guidelines for BITSAT',
    relatedTo: 'BITSAT',
    dueOffsetDays: 10,
    done: true,
  },
];
