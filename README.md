# EduGuide Prototype

A simple, beginner‑friendly React + Vite web app that demonstrates a student‑focused platform for:
- Viewing upcoming deadlines (exam, scholarship, tasks)
- Exploring colleges, exams and scholarships
- A transparent, rule‑based career‑guidance questionnaire
- Profile editing, feedback collection and local‑storage persistence

## Tech Stack
- **Vite**
- **React (JavaScript)**
- **React Router DOM** for client‑side routing
- Plain **CSS** with design tokens (see `src/styles/global.css`)
- No external UI libraries or backend services

## Scripts
```bash
npm install          # install dependencies
npm run dev          # start dev server (localhost:5173)
npm run build        # production build
```

## Project Structure
```
src/
  components/          # reusable UI components (Navbar, Layout, modals, etc.)
  context/             # React context for shared app state & localStorage
  data/                # mock data (colleges, exams, scholarships, career rules)
  hooks/               # custom hooks (useLocalStorage)
  pages/               # page components (Dashboard, Explore, Career Guidance, Feedback)
  styles/              # global CSS and design tokens
  utils/               # helper functions (date handling)
App.jsx, main.jsx       # root components and router setup
```

## Next Steps
1. Create a GitHub repository (e.g., `your-username/eduguide-prototype`).
2. Add the remote:
   ```bash
   git remote add origin https://github.com/your-username/eduguide-prototype.git
   ```
3. Push the initial commit:
   ```bash
   git push -u origin master
   ```

Feel free to customize the README, add a license, or adjust any part of the app.
