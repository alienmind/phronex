import { Category, Cost, Person, Project, ProjectCostPeriod, ProjectPersonRole, Role } from "@/app/lib/definitions";

export const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'jaime.lopez@gmail.com',
    password: '123456',
  },
];

// Fake data for demo purposes
export const projects : Project[] = [
  {
    project_id: '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d',
    project_name: "Phoenix",
    project_scope: "Legacy system modernization and cloud migration",
    project_start_date: new Date("2024-01-01"),
    project_end_date: new Date("2024-06-30")
  },
  {
    project_id: '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e',
    project_name: "Stellar Gateway",
    project_scope: "Enterprise API gateway implementation",
    project_start_date: new Date("2024-04-01"),
    project_end_date: new Date("2024-09-30")
  },
  {
    project_id: '5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
    project_name: "Super Lab PRO",
    project_scope: "Advanced laboratory management system",
    project_start_date: new Date("2024-07-01"),
    project_end_date: new Date("2024-12-31")
  },
  {
    project_id: '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a',
    project_name: "Fancy Data Factory",
    project_scope: "Data processing and analytics platform",
    project_start_date: new Date("2024-10-01"),
    project_end_date: new Date("2025-03-31")
  },
  {
    project_id: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b',
    project_name: "Super Portal",
    project_scope: "Customer self-service portal redesign",
    project_start_date: new Date("2025-01-01"),
    project_end_date: new Date("2025-06-30")
  },
  {
    project_id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c',
    project_name: "Quantum",
    project_scope: "High-performance computing infrastructure",
    project_start_date: new Date("2024-03-01"),
    project_end_date: new Date("2024-08-31")
  },
  {
    project_id: '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d',
    project_name: "Super Cockpit",
    project_scope: "Executive dashboard and analytics suite",
    project_start_date: new Date("2024-06-01"),
    project_end_date: new Date("2024-11-30")
  },
  {
    project_id: 'a0b1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d',
    project_name: "Megamapper",
    project_scope: "Global infrastructure mapping system",
    project_start_date: new Date("2024-09-01"),
    project_end_date: new Date("2025-02-28")
  },
  {
    project_id: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e',
    project_name: "Elysium",
    project_scope: "Next-gen cloud platform deployment",
    project_start_date: new Date("2024-12-01"),
    project_end_date: new Date("2025-05-31")
  },
  {
    project_id: 'c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
    project_name: "Titan",
    project_scope: "Enterprise resource planning system",
    project_start_date: new Date("2025-03-01"),
    project_end_date: new Date("2025-08-31")
  }
]


export const persons : Person[] = [
  {
    person_id: '8f3d8f90-e98b-4b3c-8d55-43c5d5e6f7a8',
    person_name: 'John',
    person_surname: 'Doe'
  },
  {
    person_id: '7a6b9c12-3d4e-5f6a-7b8c-9d0e1f2a3b4c',
    person_name: 'Jane',
    person_surname: 'Doe'
  },
  {
    person_id: '2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
    person_name: 'Robert',
    person_surname: 'Smith'
  },
  {
    person_id: '9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f',
    person_name: 'LeChuck',
    person_surname: 'The Skullmaster'
  },
  {
    person_id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    person_name: 'Aragorn',
    person_surname: 'Arathorn'
  },
  {
    person_id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    person_name: 'Legolas',
    person_surname: 'Greenleaf'
  },
  {
    person_id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    person_name: 'Herman',
    person_surname: 'Toothrot'
  },
  {
    person_id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    person_name: 'Gubrush',
    person_surname: 'Threepwood'
  },
  {
    person_id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    person_name: 'Gimli',
    person_surname: 'Gloin'
  },
  {
    person_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
    person_name: 'Samwise',
    person_surname: 'Gamgee'
  }
];

export const roles : Role[] = [
  {
    role_id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    role_name: 'Project Manager'
  },
  {
    role_id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    role_name: 'Developer'
  },
  {
    role_id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    role_name: 'Designer'
  },
  {
    role_id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    role_name: 'Business Analyst'
  }
];

export const categories : Category[] = [
  {
    category_id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    category_name: 'Enabling services'
  },
  {
    category_id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
    category_name: 'Indirect costs'
  },
  {
    category_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
    category_name: 'Human resources'
  },
];

export const costs : Cost[] = [
  {
    cost_id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
    cost_name: 'Cloud consumption',
    category_id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'
  },
  {
    cost_id: '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a',
    cost_name: 'Software Licenses',
    category_id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c'
  },
  {
    cost_id: '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b',
    cost_name: 'HR Internal IT',
    category_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'
  },
  {
    cost_id: '2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c',
    cost_name: 'HR External IT',
    category_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'
  }
];

export const projectCostPeriods : ProjectCostPeriod[] = [
  {
    project_id: '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', // Project 1
    cost_id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', // Cloud consumption
    estimate: 5000.00,
    real: 4800.00,
    period_start: new Date('2024-01-01'),
    period_end: new Date('2024-01-31')
  },
  {
    project_id: '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', // Project 1
    cost_id: '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', // Software Licenses
    estimate: 10000.00,
    real: 9500.00,
    period_start: new Date('2024-01-01'),
    period_end: new Date('2024-01-31')
  },
  {
    project_id: '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', // Project 2
    cost_id: '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', // HR Internal IT
    estimate: 7500.00,
    real: 7000.00,
    period_start: new Date('2024-02-01'),
    period_end: new Date('2024-02-28')
  },
  {
    project_id: '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d9e', // Project 2
    cost_id: '2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', // HR External IT
    estimate: 3000.00,
    real: 3200.00,
    period_start: new Date('2024-02-01'),
    period_end: new Date('2024-02-28')
  }
];


// We assign every project a project manager
export const projectPersonRoles : ProjectPersonRole[] = [
  {
    project_id: projects[0].project_id,
    person_id: persons[0].person_id,
    role_id: roles[0].role_id
  },
  {
    project_id: projects[1].project_id,
    person_id: persons[1].person_id,
    role_id: roles[0].role_id
  },
  {
    project_id: projects[2].project_id,
    person_id: persons[2].person_id,
    role_id: roles[0].role_id
  },
  {
    project_id: projects[3].project_id,
    person_id: persons[3].person_id,
    role_id: roles[0].role_id
  },
  {
    project_id: projects[4].project_id,
    person_id: persons[4].person_id,
    role_id: roles[0].role_id
  },
  {
    project_id: projects[5].project_id,
    person_id: persons[5].person_id,
    role_id: roles[0].role_id
  },
  {
    project_id: projects[6].project_id,
    person_id: persons[6].person_id,
    role_id: roles[0].role_id
  },
  {
    project_id: projects[7].project_id,
    person_id: persons[7].person_id,
    role_id: roles[0].role_id
  },
  {
    project_id: projects[8].project_id,
    person_id: persons[8].person_id,
    role_id: roles[0].role_id
  },
  {
    project_id: projects[9].project_id,
    person_id: persons[9].person_id,
    role_id: roles[0].role_id
  }
];
