// Mock data for testing purposes

type Community = {
  id: string;
  name: string;
  logo?: string;
};

export const mockCommunities: Community[] = [
  {
    id: 'community-1',
    name: 'Design Collective',
    logo: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: 'community-2',
    name: 'Tech Innovators',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: 'community-3',
    name: 'Music Producers',
    logo: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: 'community-4',
    name: 'Photography Club',
    logo: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: 'community-5',
    name: 'Fitness Enthusiasts'
    // logo is undefined
  }
];
