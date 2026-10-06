import { Unit } from '@/types/course';

const UNIT_TOPICS = [
  {
    title: 'Business & Careers',
    description: 'Negotiate contracts, present ideas, and attend interviews',
    skills: [
      { id: 'biz_1', title: 'Interviews', icon: 'UserCheck', desc: 'Answer common job questions' },
      { id: 'biz_2', title: 'Emails', icon: 'MessageSquare', desc: 'Write professional emails' },
      { id: 'biz_3', title: 'Meetings', icon: 'Users', desc: 'Lead and participate in meetings' },
      { id: 'biz_4', title: 'Finance', icon: 'ShoppingBag', desc: 'Discuss budgets and sales' },
      { id: 'biz_5', title: 'Startups', icon: 'Compass', desc: 'Pitch innovative business ideas' },
      { id: 'biz_6', title: 'Networking', icon: 'Users', desc: 'Build professional connections' },
      { id: 'biz_7', title: 'Management', icon: 'Book', desc: 'Delegate tasks and lead teams' },
    ],
  },
  {
    title: 'Technology & Digital World',
    description: 'Discuss software, AI, social media, and modern tech',
    skills: [
      { id: 'tech_1', title: 'Social Media', icon: 'MessageSquare', desc: 'Share posts and comments' },
      { id: 'tech_2', title: 'Gadgets', icon: 'Compass', desc: 'Talk about smartphones and laptops' },
      { id: 'tech_3', title: 'Artificial Intelligence', icon: 'Smile', desc: 'Discuss future technology' },
      { id: 'tech_4', title: 'Cybersecurity', icon: 'UserCheck', desc: 'Online safety and passwords' },
      { id: 'tech_5', title: 'Gaming', icon: 'Smile', desc: 'Discuss video games and streaming' },
      { id: 'tech_6', title: 'Coding', icon: 'Book', desc: 'Talk about apps and algorithms' },
      { id: 'tech_7', title: 'Future Tech', icon: 'Compass', desc: 'Explore robotics and space tech' },
    ],
  },
  {
    title: 'Arts, Cinema & Storytelling',
    description: 'Analyze literature, movies, theatre, and creative writing',
    skills: [
      { id: 'art_1', title: 'Film Analysis', icon: 'Smile', desc: 'Review movies and directors' },
      { id: 'art_2', title: 'Painting & Design', icon: 'Compass', desc: 'Discuss gallery exhibits' },
      { id: 'art_3', title: 'Poetry', icon: 'Book', desc: 'Read and interpret poems' },
      { id: 'art_4', title: 'Theatre & Acting', icon: 'Users', desc: 'Stage plays and drama' },
      { id: 'art_5', title: 'Architecture', icon: 'Home', desc: 'Explore famous buildings' },
      { id: 'art_6', title: 'Photography', icon: 'Compass', desc: 'Composition and lighting' },
      { id: 'art_7', title: 'Storytelling', icon: 'MessageSquare', desc: 'Craft compelling narratives' },
    ],
  },
  {
    title: 'Science & Nature',
    description: 'Explore biology, astronomy, ecology, and climate',
    skills: [
      { id: 'sci_1', title: 'Ecology', icon: 'Compass', desc: 'Protect forests and oceans' },
      { id: 'sci_2', title: 'Astronomy', icon: 'Smile', desc: 'Planets, stars, and galaxies' },
      { id: 'sci_3', title: 'Human Body', icon: 'UserCheck', desc: 'Anatomy and wellness' },
      { id: 'sci_4', title: 'Chemistry', icon: 'Book', desc: 'Elements and experiments' },
      { id: 'sci_5', title: 'Weather Dynamics', icon: 'Smile', desc: 'Storms and climate patterns' },
      { id: 'sci_6', title: 'Wildlife Conservation', icon: 'Compass', desc: 'Save endangered species' },
      { id: 'sci_7', title: 'Innovation', icon: 'MessageSquare', desc: 'Scientific breakthroughs' },
    ],
  },
];

const SINE_OFFSETS = [0, 45, 80, 80, 45, 0, -45, -80, -45];
const THEME_COLORS = ['bg-[#58cc02]', 'bg-[#ff9600]', 'bg-[#1cb0f6]', 'bg-[#ce82ff]', 'bg-[#ff4b4b]'];

export function generateNextUnit(unitNumber: number): Unit {
  const topicIndex = (unitNumber - 6) % UNIT_TOPICS.length;
  const topic = UNIT_TOPICS[Math.abs(topicIndex)] || UNIT_TOPICS[0];
  const color = THEME_COLORS[(unitNumber - 1) % THEME_COLORS.length];

  const cycleCount = Math.floor((unitNumber - 1) / UNIT_TOPICS.length) + 1;
  const titleSuffix = cycleCount > 1 ? ` II` : '';

  return {
    id: unitNumber,
    number: unitNumber,
    title: `Unit ${unitNumber}: ${topic.title}${titleSuffix}`,
    description: topic.description,
    color,
    skills: topic.skills.map((s, idx) => ({
      id: `sk_gen_${unitNumber}_${idx}`,
      title: s.title,
      description: s.desc,
      icon: s.icon,
      status: 'LOCKED',
      totalLessons: 4,
      completedLessons: 0,
      crowns: 0,
      maxCrowns: 3,
      positionOffset: SINE_OFFSETS[idx % SINE_OFFSETS.length],
    })),
  };
}
