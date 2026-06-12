#  Binary Teacher

An interactive, premium, single-page educational application built to teach decimal-to-binary conversion using the powers of 2 subtraction method.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

##  UI/UX Features

- **Modern Theme**: Deep space dark mode background with glassmorphic cards and glowing status animations.
- **Bi-directional Sync**:
  - Input a decimal integer $\rightarrow$ Watch the interactive bit board toggle itself and construct a subtraction timeline.
  - Click on the individual bit cards $\rightarrow$ Watch the decimal sum and binary representation update instantly.
- **Dynamic Bits Resolution**: Automatically switches between an **8-bit layout** (values $\le 255$) and a **16-bit layout** (values $\ge 256$) to fit the context.
- **Teacher Explanations**: A friendly teacher box with animated states providing contextual instruction based on the number input (e.g., standard numbers, perfect powers of 2, or zero).

---

## Gamified Quiz Mode

- **Target Challenges**: Generates a random decimal target.
- **Interactive Toggles**: Users toggle bits to reach the exact target sum.
- **Live Feedback**: Real-time warnings (e.g., if you exceed the target) and hints showing exactly how much value is left to add.
- **Streak Tracker**: Tracks score and streaks (`Streak: X 🔥`) for consecutive correct solutions.

---

## Project Structure

```bash
binary-teacher/
├── index.html     # Semantic HTML5 layout
├── style.css      # Custom dark-theme glassmorphism styles & animations
├── app.js         # Interactive application logic & state engine
└── README.md      # Project documentation
```

---

##  Getting Started

### 1. Clone this repository
```bash
git clone <your-github-repo-url>
cd binary-teacher
```

### 2. Run Locally
You can open `index.html` directly in your browser, or start a local HTTP server:

**Using Python:**
```bash
python3 -m http.server 8080
```
Then visit: `http://localhost:8080`

**Using Node.js (http-server):**
```bash
npx http-server -p 8080
```
Then visit: `http://localhost:8080`

**Also hosted here:**

