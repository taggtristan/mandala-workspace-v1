export const brand = {
  name: "Mandala Creative",
  tagline: "Art, design, and technology for cultural and social transformation.",
  colors: {
    charcoal:"#24241F",
    ink:"#1F2328",
    cream:"#F7F3ED",
    sand:"#E8DDCF",
    ocean:"#477F91",
    sage:"#7A9B76",
    clay:"#B75F3D",
    amber:"#D99B3D",
    plum:"#7B5C83"
  }
};

export const roles = [
  { id:"admin", name:"Admin", access:"Full workspace control", visibleInternal:true, visibleClient:false },
  { id:"pm", name:"Project Manager", access:"Project operations", visibleInternal:true, visibleClient:false },
  { id:"creative-lead", name:"Creative Lead", access:"Creative production", visibleInternal:true, visibleClient:false },
  { id:"member", name:"Member", access:"Assigned work", visibleInternal:true, visibleClient:false },
  { id:"client-viewer", name:"Client Viewer", access:"Approved external view", visibleInternal:false, visibleClient:true },
  { id:"vendor-viewer", name:"Vendor Viewer", access:"Limited logistics and requirements", visibleInternal:false, visibleClient:false }
];

export const projectTemplates = [
  {
    id:"public-art-mural",
    name:"Public Art / Mural",
    framework:"CPM",
    category:"Production",
    phases:["Discovery","Design","Approvals","Prep","Production","Installation","Closeout"],
    modules:["Dashboard","Tasks","Gantt","Dependencies","Procurement","Mural Estimate","Risks","Client Portal","Reports"]
  },
  {
    id:"event-activation",
    name:"Event / Activation",
    framework:"Hybrid",
    category:"Event Operations",
    phases:["Concept","Planning","Outreach","Vendor Confirmation","Production","Event Day","Wrap Report"],
    modules:["Dashboard","Tasks","Event Planner","Vendor Portal","Licensing","Run of Show","Reports"]
  },
  {
    id:"branding-campaign",
    name:"Branding / Campaign",
    framework:"Agile",
    category:"Creative",
    phases:["Discovery","Strategy","Concept","Design","Review","Launch","Reporting"],
    modules:["Dashboard","Tasks","Agile Board","Creative Review","Approvals","Reports"]
  },
  {
    id:"website-digital",
    name:"Website / Digital",
    framework:"Agile",
    category:"Digital",
    phases:["Discovery","UX","Content","Design","Development","QA","Launch"],
    modules:["Dashboard","Backlog","Sprint Board","QA","Launch Checklist","Reports"]
  },
  {
    id:"fabrication-installation",
    name:"Fabrication / Installation",
    framework:"CPM",
    category:"Build",
    phases:["Engineering","Materials","Fabrication","Finishing","Transport","Installation","Punch List"],
    modules:["Dashboard","Gantt","Dependencies","Procurement","Safety","Closeout","Reports"]
  },
  {
    id:"consulting-strategy",
    name:"Consulting / Strategy",
    framework:"Hybrid",
    category:"Professional Services",
    phases:["Kickoff","Discovery","Research","Strategy","Review","Delivery","Follow-Up"],
    modules:["Dashboard","Tasks","Meetings","Deliverables","Approvals","Reports"]
  },
  {
    id:"internal-operations",
    name:"Internal Operations",
    framework:"Agile",
    category:"Operations",
    phases:["Backlog","Planning","Execution","Review","Complete"],
    modules:["Dashboard","Agile Board","SOPs","Reports"]
  },
  {
    id:"multi-site-program",
    name:"Multi-Site Program",
    framework:"Hybrid",
    category:"Program Management",
    phases:["Program Setup","Site Discovery","Design","Approvals","Production","Installations","Program Closeout"],
    modules:["Executive Dashboard","Program Gantt","Site Tracker","Risks","Procurement","Reports"]
  }
];

export const projects = [
  {
    id:"patineta",
    name:"Patineta Project Plan",
    type:"Public Art / Mural",
    status:"At Risk",
    health:72,
    phase:"Prep & Prime",
    nextMilestone:"Surface Prep Complete",
    workbookUrl:"",
    members:["Marisa Crocker","Tristan Pittard","Isobel","Field Team","Creative Team"]
  }
];

export const tasks = [
  {id:"P-001",name:"Lift Delivery & Testing",owner:"Tristan",status:"Complete",complete:100,dependency:"None",critical:true,blocked:false,clientVisible:true},
  {id:"P-002",name:"Wall Prep & Surface Prep",owner:"Tristan",status:"In Progress",complete:32,dependency:"P-001",critical:true,blocked:false,clientVisible:true},
  {id:"P-003",name:"Utilities & Site Operations",owner:"Marisa",status:"In Progress",complete:65,dependency:"P-001",critical:false,blocked:false,clientVisible:false},
  {id:"P-004",name:"Background Paint & Color Blocking",owner:"Tristan",status:"Upcoming",complete:0,dependency:"P-002",critical:true,blocked:true,clientVisible:true},
  {id:"P-007",name:"Ribbon Cutting & Event Coordination",owner:"Marisa",status:"In Progress",complete:5,dependency:"P-003",critical:false,blocked:true,clientVisible:true}
];

export const estimateExample = {
  wallWidth: 60,
  wallHeight: 18,
  exclusions: [
    { id:"EX-001", type:"Window", width:4, height:5, quantity:3, notes:"Do not paint glass area" },
    { id:"EX-002", type:"Door", width:3, height:7, quantity:1, notes:"Door excluded from mural area" },
    { id:"EX-003", type:"Utility Box", width:2, height:3, quantity:2, notes:"Protected no-paint zone" }
  ],
  coats: 2,
  coveragePerGallon: 300,
  wasteFactor: 0.15,
  paintCostPerGallon: 68,
  laborRate: 85,
  laborHoursPer100Sf: 8
};

export const eventWorkstreams = [
  {subject:"Branding Info + Outreach",owner:"Mandala",status:"In Progress",readiness:35,clientVisible:true},
  {subject:"Merchandising",owner:"Creative Team",status:"Planning",readiness:25,clientVisible:false},
  {subject:"Food Vendors",owner:"Marisa",status:"In Progress",readiness:42,clientVisible:false},
  {subject:"Retail / Artists",owner:"Isobel",status:"In Progress",readiness:42,clientVisible:false},
  {subject:"Skate Setup + Licensing",owner:"Marisa",status:"At Risk",readiness:30,clientVisible:false}
];
