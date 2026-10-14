# EduGuide Prototype

A simple, beginner‑friendly React + Vite web app that brings college admissions, entrance exams, scholarships, deadlines, and transparent career guidance together in one place for high-school students.

- **Live URL:** [https://eduguide-demo.netlify.app](https://eduguide-demo.netlify.app)
- **GitHub Repository:** [https://github.com/AnirudTiwari/eduguide-prototype](https://github.com/AnirudTiwari/eduguide-prototype)

---

## Tech Stack
- **Vite**
- **React (JavaScript)**
- **React Router DOM** for client‑side routing
- Plain **CSS** with design tokens (see `src/styles/global.css`)
- No external UI libraries or backend services

---

## Scripts
```bash
npm install          # install dependencies
npm run dev          # start dev server (localhost:5173)
npm run build        # production build into dist/
```

---

## Deploying and Updating

The application is deployed on Netlify at [https://eduguide-demo.netlify.app](https://eduguide-demo.netlify.app).

Whenever you make changes to the code, push them to GitHub with these three commands:

```bash
git add .
git commit -m "Your update description"
git push origin main
```

If you ever need to manually trigger a deploy from your local terminal using the Netlify CLI without waiting:
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

---

## Project Structure
```
src/
  components/          # reusable UI components (Navbar, Layout, modals, etc.)
  context/             # React context for shared app state & localStorage
  data/                # mock data (colleges, exams, scholarships, career rules)
  hooks/               # custom hooks (useLocalStorage)
  pages/               # page components (Dashboard, Explore, Career Guidance, Feedback, NotFound)
  styles/              # global CSS and design tokens
  utils/               # helper functions (date handling)
App.jsx, main.jsx      # root components and router setup
public/_redirects      # Netlify SPA redirect rule
netlify.toml           # Netlify build configuration
```
