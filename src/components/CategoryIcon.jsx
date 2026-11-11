import { Camera, Cable, Headphones, Laptop, Smartphone, Tv, Watch } from "lucide-react";

const ICONS = {
  Mobiles: Smartphone,
  Laptops: Laptop,
  Headphones,
  "Smart TVs": Tv,
  Cameras: Camera,
  Smartwatches: Watch,
  Accessories: Cable,
};

export default function CategoryIcon({ name, ...props }) {
  const Icon = ICONS[name] ?? Smartphone;
  return <Icon {...props} />;
}
