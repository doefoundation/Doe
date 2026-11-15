import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

const team: Array<{ name: string; role: string; image: string; objectPosition?: string; bio: string[] }> = [
  {
    name: 'Davida Paul',
    role: 'Founder & Executive Director',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Davida%20Paul.JPG-8LbhajHCf5uFpGISlPzK2oJENtEEaD.jpeg',
    bio: [
      'Ranking in the top 4% of her Law School class, Davida combines top-tier legal credentials with global acclaim as a renowned debate instructor in over 15 countries. Spanning an 8 year long career, she made history as the first West African to be appointed to the Core Panel of the Worlds Universities Debating Championships in Vietnam, 2024. She was also appointed as the National Head Debate Coach for Morocco in 2025 where she led the national team to compete at the Worlds Schools Debate Championships in Kenya, 2026 amongst 75+ other nations.',
      'Davida has also bridged her policy experience as National Delegate at the Doha Youth Forum in Qatar 2023, combined with her recognition as one of the Top 100 Impact and Change Makers in Nigeria to execute over 15 projects at the DOE Foundation from inception till date.',
      'She is also a Global Youth Ambassador for Education at TheirWorld thus bringing exceptional expertise to her work.',
    ],
  },
  {
    name: 'Ameze Obaseki',
    role: 'Strategy Consultant',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ameze%20Obaseki-mUH0z4xjapYSDYU8tW5wUF12NgTN0u.jpg',
    objectPosition: 'center 35%',
    bio: [
      'Ameze Obaseki is the Founder of DVO Partners and a Strategy Consultant at the DOE Foundation. She brings extensive experience across strategy, consumer insights, business transformation, workplace culture and organisational development, combining these disciplines to help organisations navigate complexity, build effective systems and achieve sustainable growth.',
      'Her professional experience spans leading organisations, including EY, Heineken and Deloitte, where she has developed expertise in strategic thinking, organisational effectiveness and business transformation.',
    ],
  },
  {
    name: 'Sylvia John Adamu',
    role: 'Head Debate Coach',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sylvia%20Adamu%20John-28Z7hLy5SakXs5SbbOjxat8ViF11nR.jpg',
    objectPosition: 'center 24%',
    bio: [
      'Sylvia John Adamu is a legal practitioner, public speaking enthusiast, and youth development advocate. She holds an LL.B degree Honours from the University of Jos and has been called to the Nigerian Bar.',
      'She serves as a volunteer coach at Davida Omosomi Empowerment Foundation, where she trains young people in public speaking, advocacy, and debate. Through her work with the Foundation, she has trained over 200 students across five schools and has also served as an adjudicator at a debate tournament.',
      'Sylvia is passionate about youth empowerment, education, leadership development, and using knowledge as a tool for social transformation. She is committed to equipping young people with the confidence, critical thinking, and communication skills needed to become effective leaders and agents of positive change.',
    ],
  },
  {
    name: 'Emmanuel Majekodunmi',
    role: 'Head of Media',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Emmanuel%20Majekodunmi-kxxxIBm79JgBgQeBrxnMRBtnZv5Tah.jpg',
    bio: [
      "Emmanuel Majekodunmi is the Head of Media and Creative Team at DOE Foundation, where he leads creative media initiatives, oversees digital content development, and drives the foundation's visual storytelling and brand communication across its digital platforms.",
      'He coordinates the creative team in developing engaging multimedia content that communicates the foundation’s mission, projects, and impact. With experience in video editing and graphic design, he brings ideas to life through compelling visual content, creative direction, and impactful storytelling.',
    ],
  },
  {
    name: 'ThankGod Benjamin Odanwu',
    role: 'HR & Operations Lead',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ThankGod%20Odanwu-C7o7xNksTok9QP7wPWqULKxEkpQ7Yk.jpg',
    bio: [
      'With a combined experience of 5 years in the HR and Banking industry coupled with an MBA specialization in Human Resources; ThankGod manages HR & Operations at the Davida Omosomi Empowerment (DOE) Foundation. His work centres on HR and operational support: recruiting, coordinating and supporting volunteers, and keeping day-to-day activities running smoothly.',
      'He also provides operational support for the Foundation’s debate tournaments and scholarship program, and sometimes takes part in field activities alongside the wider team. ThankGod is committed to building a well-organised, people-focused team that helps DOE deliver on its mission for young people.',
    ],
  },
]

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/share/16YXz6DD8T5/', viewBox: '0 0 24 24', path: 'M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.4-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/thee-davida-omosomi-empowerment-foundation/', viewBox: '0 0 24 24', path: 'M5.2 8.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM3.7 9.7h3v10h-3zM9 9.7h2.9v1.4h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.5v5.7h-3v-5.1c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6v5.2H9z' },
  { name: 'Instagram', href: 'https://www.instagram.com/the_doe_foundation?obrf=MTQ3czczNmVtcGkyZA==', viewBox: '0 0 24 24', path: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8a2.7 2.7 0 0 0-2.7 2.7v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm4.5 2.4a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.1-3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z' },
  { name: 'WhatsApp', href: 'https://wa.link/sq0qzb', viewBox: '0 0 24 24', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.768.967-.941 1.166-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.71.306 1.264.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.439-9.886 9.893-9.884 2.64.001 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.002 5.45-4.439 9.886-9.892 9.884m8.406-18.292A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.893c-.001 2.096.547 4.142 1.588 5.946L.057 24l6.304-1.654a11.88 11.88 0 0 0 5.684 1.447h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.486-8.407Z' },
]

function SocialLinks({ name }: { name: string }) {
  return (
    <div className="mt-5 flex gap-2" aria-label={`${name} social links`}>
      {socialLinks.map((social) => (
        <a key={social.name} href={social.href} target="_blank" rel="noreferrer" aria-label={`${social.name} — DOE Foundation`} title={`${social.name} — DOE Foundation`} className="flex size-10 items-center justify-center rounded-full border border-[#1a1917]/12 text-[#1a1917]/70 transition-all hover:-translate-y-0.5 hover:border-[#d70063] hover:bg-[#f1c6d7]/40 hover:text-[#d70063] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063]">
          <svg viewBox={social.viewBox} className="size-[18px]" fill="currentColor" aria-hidden="true"><path d={social.path} /></svg>
        </a>
      ))}
    </div>
  )
}

export function TeamPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1a1917]">
      <SiteHeader />
      <section className="mx-auto max-w-[1360px] px-5 pb-12 pt-14 sm:px-8 sm:pb-20 sm:pt-24">
        <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d70063]"><span className="h-px w-8 bg-[#d70063]" />The people behind the purpose</p>
        <div className="border-b border-[#1a1917]/15 pb-10 sm:pb-14">
          <h1 className="max-w-3xl font-serif text-6xl leading-[.9] tracking-[-0.07em] sm:text-8xl">Our <em className="font-normal text-[#d70063]">team.</em></h1>
        </div>
        <div className="mt-9 flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1a1917]/50 sm:mt-12">
          <span>Leadership & people</span><span>01 — 05</span>
        </div>
        <div className="mt-5 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
          {team.map((member, index) => (
            <article key={member.name} className="group min-w-0">
              <div className="relative aspect-square overflow-hidden bg-[#e9e3d9]">
                <img src={member.image} alt={`Portrait of ${member.name}`} loading={index > 1 ? 'lazy' : 'eager'} style={{ objectPosition: member.objectPosition ?? 'center 50%' }} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-[#f8f5ef]/90 text-xs font-semibold text-[#d70063] backdrop-blur-sm">0{index + 1}</span>
              </div>
              <div className="pt-6">
                <div className="space-y-4 text-base leading-[1.85] text-[#1a1917]/85">
                  {member.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <h2 className="mt-6 font-serif text-3xl leading-tight tracking-[-0.04em] sm:text-4xl">{member.name}</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1a1917]/55">{member.role}</p>
                <SocialLinks name={member.name} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
