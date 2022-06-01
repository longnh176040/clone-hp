export interface Filter {
  category?: { slug: string; title: string };
  cpu?: { slug: string; title: string };
  ram?: { slug: string; title: string };
  hard_drive?: { slug: string; title: string };
  vga?: { slug: string; title: string };
  screen_size?: { slug: string; title: string };
  screen_resolution?: { slug: string; title: string };
  os?: { slug: string; title: string };
  price_range? : {slug: string, title: string}
}
