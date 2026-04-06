export type PlanId = "free" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // per month
  description: string;
  limits: {
    properties: number; // -1 = unlimited
    units: number;
    activeTurnovers: number;
    teamMembers: number;
    photoUploads: boolean;
    taskTemplates: boolean;
    csvExport: boolean;
    analytics: boolean;
    prioritySupport: boolean;
  };
  features: string[];
  badge?: string;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    description: "Get started with the basics",
    limits: {
      properties: 1,
      units: 5,
      activeTurnovers: 3,
      teamMembers: 1,
      photoUploads: false,
      taskTemplates: false,
      csvExport: false,
      analytics: false,
      prioritySupport: false,
    },
    features: [
      "1 property",
      "Up to 5 units",
      "Up to 3 active turnovers",
      "Basic task management",
      "Activity log",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "Everything you need to scale",
    badge: "Most Popular",
    limits: {
      properties: 10,
      units: 100,
      activeTurnovers: -1,
      teamMembers: 5,
      photoUploads: true,
      taskTemplates: true,
      csvExport: true,
      analytics: false,
      prioritySupport: false,
    },
    features: [
      "Up to 10 properties",
      "Up to 100 units",
      "Unlimited turnovers",
      "Up to 5 team members",
      "Photo uploads",
      "Task templates",
      "CSV export",
      "Priority filters & views",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    price: 79,
    description: "For large property management teams",
    limits: {
      properties: -1,
      units: -1,
      activeTurnovers: -1,
      teamMembers: -1,
      photoUploads: true,
      taskTemplates: true,
      csvExport: true,
      analytics: true,
      prioritySupport: true,
    },
    features: [
      "Unlimited properties",
      "Unlimited units",
      "Unlimited turnovers",
      "Unlimited team members",
      "Photo uploads",
      "Task templates",
      "CSV export",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
  },
};

export function getPlan(planId: string): Plan {
  return PLANS[planId as PlanId] ?? PLANS.free;
}

export function isAtLimit(planId: string, resource: keyof Plan["limits"], current: number): boolean {
  const plan = getPlan(planId);
  const limit = plan.limits[resource];
  if (typeof limit === "boolean") return !limit;
  if (limit === -1) return false;
  return current >= limit;
}

export function hasFeature(planId: string, feature: keyof Plan["limits"]): boolean {
  const plan = getPlan(planId);
  const val = plan.limits[feature];
  if (typeof val === "boolean") return val;
  return val === -1 || val > 0;
}

export function getLimit(planId: string, resource: keyof Plan["limits"]): number | boolean {
  return getPlan(planId).limits[resource];
}
