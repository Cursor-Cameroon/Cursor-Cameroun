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
    kind: "active",
    events: 2,
    members: 180,
  },
  {
    id: "douala",
    name: "Douala",
    region: "Littoral",
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "buea",
    name: "Buea",
    region: "Sud-Ouest",
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "bamenda",
    name: "Bamenda",
    region: "Nord-Ouest",
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "bafoussam",
    name: "Bafoussam",
    region: "Ouest",
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "garoua",
    name: "Garoua",
    region: "Nord",
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "maroua",
    name: "Maroua",
    region: "Extrême-Nord",
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "ngaoundere",
    name: "Ngaoundéré",
    region: "Adamaoua",
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "bertoua",
    name: "Bertoua",
    region: "Est",
    kind: "target",
    events: 0,
    members: 0,
  },
  {
    id: "ebolowa",
    name: "Ebolowa",
    region: "Sud",
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
