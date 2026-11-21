import { programs } from '@/lib/programs'

export type SiteSearchItem = {
  title: string
  description: string
  href: string
  keywords: string[]
  popular?: boolean
}

const mainPages: SiteSearchItem[] = [
  { title: 'Home', description: 'The Davida Omosomi Empowerment Foundation advances education, advocacy, and opportunity for young people.', href: '/#top', keywords: ['DOE Foundation', 'Davida Omosomi Empowerment Foundation', 'children', 'youth', 'education', 'future'], popular: true },
  { title: 'Who we are', description: 'Our vision, mission, and community-centered work.', href: '/#who-we-are', keywords: ['vision', 'mission', 'nonprofit', 'purposeful leaders'] },
  { title: 'Our impact', description: 'Schools, students, scholarships, and debate competitions.', href: '/#our-impact', keywords: ['1200 students', '76 schools', '150 scholarships', '7 competitions', 'impact'] },
  { title: 'Our programs', description: 'Leadership, debate and literacy, outreach, and scholarships.', href: '/programs', keywords: ['programs', 'clubs', 'learning', 'students'], popular: true },
  { title: 'Testimonials', description: 'Stories of impact from students, volunteers, and educators.', href: '/#testimonials', keywords: ['stories', 'voices', 'community', 'beneficiaries', 'change'], popular: true },
  { title: 'Our partners', description: 'Organizations working alongside DOE Foundation.', href: '/#our-partners', keywords: ['partners', 'AREAi', 'Oasis Haven', 'Debate Champs', 'T K E Ethics'] },
  { title: 'News & updates', description: 'The latest stories, events, and announcements from DOE Foundation.', href: '/news', keywords: ['news', 'updates', 'stories', 'events', 'press', 'blog', 'articles'], popular: true },
  { title: 'Newsletter', description: 'Get DOE Foundation news, stories, and program updates.', href: '/#newsletter-heading', keywords: ['updates', 'email', 'subscribe', 'newsletter'] },
  { title: 'Contact us', description: 'Reach DOE Foundation in Abuja, Nigeria.', href: 'mailto:thee.doe.foundation@gmail.com', keywords: ['phone', '+234 906 655 5162', 'email', 'thee.doe.foundation@gmail.com', 'address', 'Abuja', 'Nigeria', 'contact'] },
  { title: 'Donate: Sponsor a debate club', description: 'Sponsor one student or a lasting school debate club.', href: '/donate', keywords: ['donate', 'donation', 'give', 'sponsor', '₦150,000', '₦1,000,000', 'UBA', '1029860127', 'debate club'], popular: true },
  { title: 'Volunteer', description: 'Join DOE Foundation in supporting young leaders.', href: 'mailto:hello@doefoundation.org?subject=Volunteering%20with%20DOE%20Foundation', keywords: ['volunteer', 'get involved', 'help'] },
  { title: 'Privacy policy', description: 'Information about privacy and contact details.', href: '/privacy-policy', keywords: ['privacy', 'data'] },
  { title: 'Cookie policy', description: 'Information about cookies and this website.', href: '/cookie-policy', keywords: ['cookies', 'website'] },
]

const teamPages: SiteSearchItem[] = [
  { title: 'Davida Paul', description: 'Founder and Executive Director; debate educator and Global Youth Ambassador for Education.', href: '/our-team', keywords: ['founder', 'executive director', 'lawyer', 'debate coach', 'TheirWorld', 'Doha Youth Forum'] },
  { title: 'Ameze Obaseki', description: 'Strategy Consultant with experience in business transformation and organizational development.', href: '/our-team', keywords: ['strategy', 'DVO Partners', 'EY', 'Heineken', 'Deloitte'] },
  { title: 'Sylvia John Adamu', description: 'Head Debate Coach, legal practitioner, and youth development advocate.', href: '/our-team', keywords: ['lawyer', 'public speaking', 'advocacy', 'coach'] },
  { title: 'Emmanuel Majekodunmi', description: 'Head of Media leading creative storytelling and digital content.', href: '/our-team', keywords: ['media', 'creative', 'video editing', 'graphic design'] },
  { title: 'ThankGod Benjamin Odanwu', description: 'HR and Operations Lead supporting volunteers, tournaments, and scholarships.', href: '/our-team', keywords: ['HR', 'operations', 'volunteers', 'banking', 'scholarships'] },
]

const programPages: SiteSearchItem[] = programs.map((program) => ({
  title: program.name,
  description: program.shortDescription,
  href: '/programs#programs',
  keywords: [...program.outcomes, program.description],
}))

const testimonialPages: SiteSearchItem[] = [
  { title: 'Sylvia Adamu', description: 'Volunteer debate coach sharing the impact of advocacy and debating.', href: '/#testimonials', keywords: ['200 students', '5 schools', 'confidence', 'volunteer'] },
  { title: 'Okeoghene Umukoru', description: 'Teacher sharing how students learned to trust their voice.', href: '/#testimonials', keywords: ['teacher', 'student voice', 'opinions'] },
  { title: 'Adesanya Zara', description: 'Student beneficiary sharing her learning experience.', href: '/#testimonials', keywords: ['student', 'ethics', 'philosophy', 'decisions'] },
  { title: 'Shekinah Sanwoolu', description: 'Student beneficiary growing in confidence through debate.', href: '/#testimonials', keywords: ['student', 'research', 'laptop', 'speaker'] },
  { title: 'Abraham Ogooluwa Ayomiposi', description: 'Student beneficiary learning to listen, research, and debate.', href: '/#testimonials', keywords: ['student', 'laptop', 'research', 'international debater'] },
  { title: 'Rhoda Adegoke', description: 'Student beneficiary gaining confidence and debate skills.', href: '/#testimonials', keywords: ['student', 'laptop', 'confidence'] },
  { title: 'Anjola Oladapo', description: 'Student beneficiary learning ethical reasoning and research.', href: '/#testimonials', keywords: ['student', 'ethics', 'facts', 'laptop'] },
]

export const siteSearchItems = [...mainPages, ...programPages, ...teamPages, ...testimonialPages]
