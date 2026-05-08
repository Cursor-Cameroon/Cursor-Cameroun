import type { CityPoint } from "@/components/CameroonMap";

export type RoadmapGoal = {
  label: string;
  current: number;
  target: number;
};

export const CITY_POINTS: CityPoint[] = [
  {
    id: "yaounde",
    name: "Yaoundé",
    region: "Centre",
    x: 52,
    y: 78,
    kind: "active",
    events: 2,
    members: 180,
  },
  {
    id: "douala",
    name: "Douala",
    region: "Littoral",
    x: 42,
    y: 92,
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "buea",
    name: "Buea",
    region: "Sud-Ouest",
    x: 31,
    y: 107,
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "bamenda",
    name: "Bamenda",
    region: "Nord-Ouest",
    x: 40,
    y: 70,
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "bafoussam",
    name: "Bafoussam",
    region: "Ouest",
    x: 44,
    y: 82,
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "garoua",
    name: "Garoua",
    region: "Nord",
    x: 62,
    y: 35,
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "maroua",
    name: "Maroua",
    region: "Extrême-Nord",
    x: 74,
    y: 18,
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "ngaoundere",
    name: "Ngaoundéré",
    region: "Adamaoua",
    x: 63,
    y: 55,
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "bertoua",
    name: "Bertoua",
    region: "Est",
    x: 70,
    y: 78,
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "ebolowa",
    name: "Ebolowa",
    region: "Sud",
    x: 56,
    y: 110,
    kind: "target",
    events: 0,
    members: 0,
  },
];

export const GOALS_2026: RoadmapGoal[] = [
  { label: "Villes couvertes", current: 1, target: 6 },
  { label: "Événements organisés", current: 3, target: 18 },
  { label: "Membres", current: 180, target: 1000 },
];

