// Mock communities data based on the Firestore structure

export const mockCommunities = [
  {
    id: 'kyozo-demo-community',
    name: 'Kyozo Demo Community',
    communityProfileImage: 'https://firebasestorage.googleapis.com/v0/b/kyozo-dev.appspot.com/o/communities%2Fkyozo-demo-community%2Fprofile.jpg?alt=media',
    communityPrivacy: 'private',
    communityType: 'community',
    description: 'Join the Kyozo Announcements Community for updates on new communities and features on Kyozo.',
    tagline: 'Perfecting the technology behind the Kyozo platform',
    supportedProducts: ['whatsapp'],
    tags: ['Digital Heritage', 'Digital Collections', 'Museums', 'App Design', 'Fast Fashion']
  },
  {
    id: 'secret-theatre',
    name: 'Secret Theatre',
    communityProfileImage: 'https://firebasestorage.googleapis.com/v0/b/kyozo-dev.appspot.com/o/communities%2Fsecret-theatre%2Fprofile.jpg?alt=media',
    communityPrivacy: 'private',
    communityType: 'community',
    description: 'Secret Theatre travel: the world with unique, immersive site specific dramatic productions.',
    tagline: 'Immerse yourself in specific character roles, discovering a world of possibilities',
    supportedProducts: ['whatsapp'],
    tags: ['Immersive Art', 'Fashion Design', 'Futurism', 'Experimental Theatre']
  },
  {
    id: 'digital-heritage',
    name: 'Digital Heritage',
    communityProfileImage: 'https://firebasestorage.googleapis.com/v0/b/kyozo-dev.appspot.com/o/communities%2Fdigital-heritage%2Fprofile.jpg?alt=media',
    communityPrivacy: 'public',
    communityType: 'community',
    description: 'Exploring the intersection of technology and cultural heritage',
    supportedProducts: ['whatsapp'],
    tags: ['Digital Heritage', 'Museums', 'Cultural Preservation']
  },
  {
    id: 'design-collective',
    name: 'Design Collective',
    // No profile image to test fallback
    communityPrivacy: 'public',
    communityType: 'community',
    description: 'A community for designers to share ideas and collaborate',
    supportedProducts: ['whatsapp'],
    tags: ['Design', 'UX/UI', 'Product Design']
  }
];
