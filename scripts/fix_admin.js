const fs = require('fs');

const dashboardPath = '../frontend/app/admin/dashboard/page.tsx';
let dashboard = fs.readFileSync(dashboardPath, 'utf8');

// Frieren Dark Theme Fixes for Dashboard
dashboard = dashboard.replace(/bg-dark-wood-light/g, 'bg-parchment-light/30 backdrop-blur-sm');
dashboard = dashboard.replace(/bg-dark-wood/g, 'bg-parchment-texture');
dashboard = dashboard.replace(/bg-parchment-light/g, 'bg-aged-paper/50');
dashboard = dashboard.replace(/bg-parchment/g, 'bg-aged-paper/30');

// Fix text colors which inverted in the dark theme (parchment text on dark wood background inverted to dark blue text on white background)
dashboard = dashboard.replace(/text-parchment\/60/g, 'text-iron-light');
dashboard = dashboard.replace(/text-parchment\/40/g, 'text-iron-light/60');
dashboard = dashboard.replace(/text-parchment\/30/g, 'text-iron-light/40');
dashboard = dashboard.replace(/text-parchment/g, 'text-dark-wood');
dashboard = dashboard.replace(/hover:text-parchment/g, 'hover:text-dark-wood');
dashboard = dashboard.replace(/hover:bg-white\/5/g, 'hover:bg-gold-light/5');

// Update UI components
dashboard = dashboard.replace(/scroll-card/g, 'scroll-card glass-card');

fs.writeFileSync(dashboardPath, dashboard);

const loginPath = '../frontend/app/admin/page.tsx';
let login = fs.readFileSync(loginPath, 'utf8');

login = login.replace(/bg-dark-wood/g, 'bg-parchment-texture');
login = login.replace(/text-parchment\/60/g, 'text-iron-light');
login = login.replace(/scroll-card/g, 'scroll-card glass-card');
login = login.replace(/bg-parchment-light/g, 'bg-aged-paper/80');

fs.writeFileSync(loginPath, login);
console.log('Admin pages successfully themed.');
