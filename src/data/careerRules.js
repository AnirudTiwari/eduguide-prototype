/**
 * Career Rules and Scoring Engine for EduGuide Demo.
 * 
 * TRANSPARENT RULE-BASED SCORING:
 * - No black-box AI model or external API is used.
 * - Each question option maps to specific points for 8 career pathways.
 * - Points are summed up to rank pathways transparently.
 * - Every path receives human-readable explanations based directly on the user's answers.
 */

// 1. QUESTIONNAIRE DEFINITION (6 Questions)
export const questions = [
  {
    id: 'subjects',
    title: 'Which subjects do you enjoy the most?',
    subtitle: 'Pick up to 3 subjects that interest you.',
    type: 'multi',
    max: 3,
    options: [
      'Physics',
      'Chemistry',
      'Maths',
      'Biology',
      'Computer Science',
      'Economics/Business',
      'Languages/Arts',
    ],
    whyWeAsk: 'Different degree streams require specific foundational subject strengths.',
  },
  {
    id: 'activities',
    title: 'What kinds of activities do you genuinely enjoy?',
    subtitle: 'Pick up to 3 activities that describe what you like doing.',
    type: 'multi',
    max: 3,
    options: [
      'Building circuits or gadgets',
      'Writing code',
      'Solving maths puzzles',
      'Experiments and research',
      'Helping or caring for people',
      'Starting or running projects',
      'Designing or drawing',
    ],
    whyWeAsk: 'Hands-on interests point to natural work styles and technical affinities.',
  },
  {
    id: 'performance',
    title: 'What is your recent approximate academic performance?',
    subtitle: 'Select your current score range.',
    type: 'single',
    options: ['Above 85%', '70-85%', '60-70%', 'Below 60%'],
    whyWeAsk: 'Helps us provide honest guidance on competitive entry standards without blocking any pathway.',
  },
  {
    id: 'goalStyle',
    title: 'What kind of career environment or goal appeals to you?',
    subtitle: 'Choose the work atmosphere you envision for yourself.',
    type: 'single',
    options: [
      'Secure and stable job',
      'High-growth tech career',
      'Research and higher studies',
      'Own business or startup',
      'Not sure yet',
    ],
    whyWeAsk: 'Aligns study pathways with the day-to-day lifestyle and industry pace you want.',
  },
  {
    id: 'location',
    title: 'What is your location preference for college?',
    subtitle: 'Select where you would prefer to study.',
    type: 'single',
    options: [
      'Chandigarh / Punjab region',
      'Anywhere in India',
      'Open to abroad later',
    ],
    whyWeAsk: 'Helps prioritize regional colleges near your home state.',
  },
  {
    id: 'educationLevel',
    title: 'What level of education are you targeting right now?',
    subtitle: 'Confirm your current admission milestone.',
    type: 'single',
    options: ['UG (undergraduate)'],
    whyWeAsk: 'Ensures recommended entrance exams and college courses match undergraduate admissions.',
  },
];

// 2. THE 8 CAREER PATHWAYS
export const careerPaths = [
  {
    id: 'path-software',
    title: 'Software and Computer Science',
    description: 'Focuses on designing software systems, applications, algorithmic logic, and web platforms.',
    competitive: true,
    courseCategory: 'Engineering',
    relatedExamIds: ['exam-1', 'exam-3', 'exam-2'], // JEE Main, BITSAT, JEE Advanced
  },
  {
    id: 'path-ece',
    title: 'Electronics and Communication Engineering',
    description: 'Deals with semiconductors, circuits, signal processing, IoT hardware, and telecommunications.',
    competitive: true,
    courseCategory: 'Engineering',
    relatedExamIds: ['exam-1', 'exam-3', 'exam-2'],
  },
  {
    id: 'path-core-eng',
    title: 'Core Engineering (Mechanical/Civil/Electrical)',
    description: 'Applies physics principles to physical machinery, electrical grids, infrastructure, and heavy industry.',
    competitive: true,
    courseCategory: 'Engineering',
    relatedExamIds: ['exam-1', 'exam-3', 'exam-2'],
  },
  {
    id: 'path-data-ai',
    title: 'Data Science and AI',
    description: 'Combines statistics, mathematical modeling, and computing to analyze data and train machine learning models.',
    competitive: true,
    courseCategory: 'Engineering',
    relatedExamIds: ['exam-1', 'exam-3', 'exam-2'],
  },
  {
    id: 'path-medicine',
    title: 'Medicine and Healthcare',
    description: 'Dedicated to clinical health, life sciences, diagnosis, patient treatment, and bio-medical research.',
    competitive: true,
    courseCategory: null,
    relatedExamIds: ['exam-5'], // NEET (UG)
  },
  {
    id: 'path-pure-sciences',
    title: 'Pure Sciences and Research',
    description: 'Pursues fundamental scientific inquiry, laboratory investigation, and academia across physical or natural sciences.',
    competitive: false,
    courseCategory: 'Science',
    relatedExamIds: ['exam-4'], // CUET (UG)
  },
  {
    id: 'path-business',
    title: 'Business and Entrepreneurship',
    description: 'Focuses on commercial operations, startup ventures, economic markets, leadership, and product strategy.',
    competitive: false,
    courseCategory: null,
    relatedExamIds: ['exam-4'], // CUET (UG)
  },
  {
    id: 'path-design',
    title: 'Design and Creative Tech',
    description: 'Bridges aesthetic design, human-computer interaction, visual storytelling, and digital product styling.',
    competitive: false,
    courseCategory: null,
    relatedExamIds: [],
  },
];

// 3. TRANSPARENT LOOKUP TABLE: POINT BOOSTS PER ANSWER
// (+2 strong positive affinity, +1 secondary positive affinity)
export const scoringRules = {
  subjects: {
    Physics: {
      'path-core-eng': 2,
      'path-ece': 2,
      'path-pure-sciences': 2,
      'path-software': 1,
    },
    Chemistry: {
      'path-pure-sciences': 2,
      'path-medicine': 2,
      'path-core-eng': 1,
    },
    Maths: {
      'path-software': 2,
      'path-data-ai': 2,
      'path-core-eng': 2,
      'path-ece': 1,
      'path-pure-sciences': 1,
    },
    Biology: {
      'path-medicine': 3,
      'path-pure-sciences': 1,
    },
    'Computer Science': {
      'path-software': 3,
      'path-data-ai': 2,
      'path-design': 1,
    },
    'Economics/Business': {
      'path-business': 3,
      'path-data-ai': 1,
    },
    'Languages/Arts': {
      'path-design': 2,
      'path-business': 1,
    },
  },
  activities: {
    'Building circuits or gadgets': {
      'path-ece': 3,
      'path-core-eng': 2,
      'path-design': 1,
    },
    'Writing code': {
      'path-software': 3,
      'path-data-ai': 2,
    },
    'Solving maths puzzles': {
      'path-data-ai': 2,
      'path-software': 2,
      'path-pure-sciences': 2,
    },
    'Experiments and research': {
      'path-pure-sciences': 3,
      'path-medicine': 2,
      'path-data-ai': 1,
    },
    'Helping or caring for people': {
      'path-medicine': 3,
      'path-business': 1,
    },
    'Starting or running projects': {
      'path-business': 3,
      'path-software': 1,
      'path-design': 1,
    },
    'Designing or drawing': {
      'path-design': 3,
      'path-business': 1,
    },
  },
  goalStyle: {
    'High-growth tech career': {
      'path-software': 2,
      'path-data-ai': 2,
      'path-ece': 2,
    },
    'Research and higher studies': {
      'path-pure-sciences': 3,
      'path-data-ai': 1,
    },
    'Own business or startup': {
      'path-business': 3,
      'path-software': 1,
      'path-design': 1,
    },
    'Secure and stable job': {
      'path-core-eng': 2,
      'path-ece': 1,
      'path-software': 1,
    },
    'Not sure yet': {
      'path-software': 1,
      'path-ece': 1,
      'path-pure-sciences': 1,
      'path-business': 1,
    },
  },
};

/**
 * Calculates rule-based recommendations given the user's questionnaire answers.
 * Returns all 8 paths sorted descending by score, with match levels and plain-English reasons.
 *
 * @param {Object} answers - User answers object { subjects, activities, performance, goalStyle, location, educationLevel }
 * @returns {Array} Ranked recommendations list
 */
export function getRecommendations(answers) {
  if (!answers) return [];

  const selectedSubjects = Array.isArray(answers.subjects) ? answers.subjects : [];
  const selectedActivities = Array.isArray(answers.activities) ? answers.activities : [];
  const userPerformance = answers.performance || '';
  const userGoalStyle = answers.goalStyle || '';

  return careerPaths
    .map((path) => {
      let score = 0;
      const reasons = [];

      // 1. Tally points from subjects
      const contributingSubjects = [];
      selectedSubjects.forEach((subject) => {
        const points = scoringRules.subjects[subject]?.[path.id] || 0;
        if (points > 0) {
          score += points;
          contributingSubjects.push(subject);
        }
      });
      if (contributingSubjects.length > 0) {
        reasons.push(`You chose ${contributingSubjects.join(' and ')} as favourite subject(s).`);
      }

      // 2. Tally points from activities
      const contributingActivities = [];
      selectedActivities.forEach((act) => {
        const points = scoringRules.activities[act]?.[path.id] || 0;
        if (points > 0) {
          score += points;
          contributingActivities.push(act.toLowerCase());
        }
      });
      if (contributingActivities.length > 0) {
        reasons.push(`You enjoy ${contributingActivities.join(' and ')}.`);
      }

      // 3. Tally points from career goal style
      const goalPoints = scoringRules.goalStyle[userGoalStyle]?.[path.id] || 0;
      if (goalPoints > 0) {
        score += goalPoints;
        if (userGoalStyle !== 'Not sure yet') {
          reasons.push(`Your career goal of "${userGoalStyle}" aligns with this sector.`);
        }
      }

      // 4. Performance evaluation (never hides or blocks, attaches honest note if applicable)
      let competitiveNote = null;
      if (userPerformance === 'Below 60%' && path.competitive) {
        score = Math.max(0, score - 1);
        competitiveNote = 'This path usually has a highly competitive entrance process. Consider keeping a backup route.';
      }

      // Ensure every path shows at least one real reason
      if (reasons.length === 0) {
        if (path.courseCategory === 'Engineering') {
          reasons.push('Provides a versatile technical foundation aligned with undergraduate engineering options.');
        } else if (path.courseCategory === 'Science') {
          reasons.push('Offers research-focused academic pathways for science and technology aspirants.');
        } else {
          reasons.push('Presents broad career avenues open to undergraduate students.');
        }
      }

      // Determine transparent match level based on score thresholds
      let matchLevel = 'Possible';
      if (score >= 6) {
        matchLevel = 'Strong';
      } else if (score >= 3) {
        matchLevel = 'Good';
      }

      return {
        path,
        score,
        matchLevel,
        reasons,
        competitiveNote,
      };
    })
    .sort((a, b) => b.score - a.score);
}
