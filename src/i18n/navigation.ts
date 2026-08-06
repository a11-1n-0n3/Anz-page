import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Import Link from here, never next/link — otherwise /en loses its prefix
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
