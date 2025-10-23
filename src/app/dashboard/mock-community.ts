// Mock community data for testing purposes

export const mockCommunity = {
  id: 'secret-theatre',
  name: 'Secret Theatre',
  logo: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=100&auto=format&fit=crop',
  heroImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=800&auto=format&fit=crop',
  usersList: Array(1808).fill({ userId: 'user-id' }),
  description: 'A community for immersive theatre experiences',
  mantra: 'Secret Theatre travel: the world with unique, immersive site specific dramatic productions.',
  lore: 'Immerse yourself in specific character roles, discovering a world of possibilities (and rewards for those who surprise us)',
  tags: [
    'Immersive Art',
    'Fashion Design',
    'Futurism',
    'Experimental Theatre',
    'Immersive Theatre',
    'Improvisation',
    'Multimedia',
    'Theatre of the Absurd'
  ],
  location: 'Hong Kong',
  privacy: 'private',
  createdAt: { _seconds: 1677649200, _nanoseconds: 0 }, // March 1, 2023
  updatedAt: { _seconds: 1698649200, _nanoseconds: 0 }, // October 30, 2023
  communityType: 'community',
  owner: 'info@secrettheatre@gmail.com',
  admins: [
    'admin@kyozo.com',
    'team@kyozo.com'
  ],
  moderators: [
    'will@kyozo.com',
    'richard@secrettheatre@gmail.com',
    'sarah@gmail.com',
    'matthew@curator123@gmail.com'
  ],
  permissions: [
    'Overview of communities stats',
    'List of communities',
    'List of ALL USERS',
    'Integrate with 3rd parties',
    'Billing payment related feature',
    'View permission',
    'Edit permission',
    'Add/Edit user\'s roles',
    'Add members',
    'Delete members',
    'Approve/Decline',
    'Broadcast and narrowcast',
    'Chat to users',
    'Community - Analytics'
  ],
  status: 'publish',
  supportedProducts: ['whatsapp'],
  tagline: 'Perfecting the technology behind the Kyozo platform'
};
