@import "tailwindcss";

@layer base {
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #0c0a09;
    color: #f5f5f4;
  }

  h1, h2, h3, .font-serif, .editorial-serif {
    font-family: 'Playfair Display', Georgia, serif;
  }
}

.border-paper {
  border-color: rgba(245, 242, 237, 0.15);
}

.bg-fire-radial {
  background: radial-gradient(circle at 70% 30%, #ea580c 0%, transparent 70%);
  opacity: 0.15;
}

.badge-editorial {
  padding: 4px 12px;
  border: 1px solid #ea580c;
  color: #ea580c;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: 700;
  display: inline-block;
}

.nav-link-editorial {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.75;
  transition: opacity 0.2s, color 0.2s;
}

.nav-link-editorial:hover {
  opacity: 1;
  color: #f97316;
}

