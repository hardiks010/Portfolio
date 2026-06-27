export type Social = {
  id: "github" | "linkedin" | "design";
  label: string;
  description: string;
  url: string;
  position: {
    x: number;
    y: number;
  };
};

export const SOCIALS: Social[] = [
  {
    id: "github",
    label: "GitHub",
    description: "Building things.",
    url: "https://github.com/hardiks010",
    position: { x: -320, y: 250 },
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Let's connect.",
    url: "https://in.linkedin.com/in/hardik-sati",
    position: { x: 0, y: 190 },
  },
  {
    id: "design",
    label: "Design",
    description: "Life beyond code.",
    url: "https://www.fiverr.com/users/kyubiworks/portfolio/#",
    position: { x: 320, y: 250 },
  },
];
