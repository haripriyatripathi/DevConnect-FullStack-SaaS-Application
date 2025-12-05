export type DeveloperRole = 'Frontend' | 'Backend' | 'Full-Stack';

export interface Developer {
  id: string;
  name: string;
  role: DeveloperRole;
  techStack: string[];
  experience: number;
  description?: string;
  joiningDate: string;
  avatar?: string;
  email?: string;
}

export const mockDevelopers: Developer[] = [
  {
    id: '1',
    name: 'Haripriya Tripathi',
    role: 'Frontend',
    techStack: ['React'],
    experience: 2,
    description: 'Frontend developer specializing in React and modern JavaScript frameworks.',
    joiningDate: '2025-12-01',
    email: 'haripriya@example.com',
  },
  {
    id: '2',
    name: 'Krishna Pratap Singh',
    role: 'Frontend',
    techStack: ['AI Engineer'],
    experience: 9,
    description: 'Experienced developer with expertise in AI and frontend technologies.',
    joiningDate: '2025-12-01',
    email: 'krishna@example.com',
  },
];
