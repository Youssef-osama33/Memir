import { Cpu, ShieldAlert, Atom, Zap, Server, Sigma, Scale, BookOpen, LucideIcon } from "lucide-react";
import { CategoryIconName } from "../lib/categories";

const iconMap: Record<CategoryIconName, LucideIcon> = {
  Cpu,
  ShieldAlert,
  Atom,
  Zap,
  Server,
  Sigma,
  Scale,
  BookOpen,
};

export default function CategoryIcon({ name, className }: { name: CategoryIconName; className?: string }) {
  const Icon = iconMap[name] || BookOpen;
  return <Icon className={className} />;
}
