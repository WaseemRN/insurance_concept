// Onboarding questions data with illustrations and verification badges
import smokeImage from '../assets/images/smokeImage.png';
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import image3 from '../assets/images/image3.png';
import image4 from '../assets/images/image4.png';

export const onboardingQuestions = [
  {
    id: 1,
    question: 'Do you currently use any nicotine products (cigarettes, vaping, patches)?',
    verificationText: 'This may be verified later via standard medical testing.',
    illustration: smokeImage,
    illustrationBgColor: '#E0F4F8',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    id: 2,
    question: 'Have you been hospitalized in the last 24 months?',
    verificationText: 'This may be verified later via standard medical testing.',
    illustration: image1,
    illustrationBgColor: '#E8EFF8',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    id: 3,
    question: 'Are you currently on daily medication for blood pressure or diabetes?',
    verificationText: 'This may be verified later via standard medical testing.',
    illustration: image2,
    illustrationBgColor: '#F0F8FF',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    id: 4,
    question: 'Has a doctor ever recommended surgery that you have not yet had?',
    verificationText: 'This may be verified later via standard medical testing.',
    illustration: image3,
    illustrationBgColor: '#E8F4FA',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    id: 5,
    question: 'Do you engage in high-risk sports such as racing or skydiving?',
    verificationText: 'This may be verified later via standard medical testing.',
    illustration: image4,
    illustrationBgColor: '#E0F0FF',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
];

// Total number of questions for progress tracking
export const TOTAL_QUESTIONS = onboardingQuestions.length;
