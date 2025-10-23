// Mock community data for testing purposes

export const mockCommunities = [
  {
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
  },
  {
    id: 'digital-artists',
    name: 'Digital Artists Collective',
    logo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=100&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=800&auto=format&fit=crop',
    usersList: Array(972).fill({ userId: 'user-id' }),
    description: 'A community for digital artists to share their work and collaborate',
    mantra: 'Creating the future of digital art together',
    tags: [
      'Digital Art',
      '3D Modeling',
      'Animation',
      'Concept Art',
      'VR/AR',
      'NFTs'
    ],
    location: 'Global',
    privacy: 'public',
    createdAt: { _seconds: 1672531200, _nanoseconds: 0 }, // January 1, 2023
    communityType: 'community',
    status: 'publish'
  },
  {
    id: 'music-producers',
    name: 'Music Producers Hub',
    logo: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=100&auto=format&fit=crop',
    usersList: Array(1245).fill({ userId: 'user-id' }),
    description: 'Connect with music producers worldwide',
    tags: [
      'Music Production',
      'Sound Design',
      'Electronic Music',
      'Hip Hop',
      'Ambient',
      'Experimental'
    ],
    privacy: 'private',
    createdAt: { _seconds: 1680323200, _nanoseconds: 0 }, // April 1, 2023
    status: 'publish'
  },
  {
    id: 'photography-club',
    name: 'Photography Club',
    logo: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=100&auto=format&fit=crop',
    usersList: Array(543).fill({ userId: 'user-id' }),
    description: 'For photography enthusiasts of all levels',
    privacy: 'public',
    createdAt: { _seconds: 1685577600, _nanoseconds: 0 }, // June 1, 2023
    status: 'publish'
  },
  {
    id: 'fitness-enthusiasts',
    name: 'Fitness Enthusiasts',
    usersList: Array(876).fill({ userId: 'user-id' }),
    description: 'Stay fit and motivated with our community',
    privacy: 'public',
    createdAt: { _seconds: 1688256000, _nanoseconds: 0 }, // July 2, 2023
    status: 'publish'
  }
];
