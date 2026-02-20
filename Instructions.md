# Portfolio Development Specification: Chathushka Sanjaya (2026 Edition)

## 1. Project Overview
[cite_start]Create a high-performance, aesthetically pleasing "Bento-style" portfolio to showcase the professional journey of A.H. Chathushka Sanjaya Kumara[cite: 1]. The design focuses on 2026 trends: minimalist typography, glassmorphism, and local-first data handling.

## 2. Technical Stack
* **Framework:** HTML5, Tailwind CSS (Styling), Vanilla JavaScript (Logic).
* **Database:** Dexie.js (For local storage of user preferences and contact form drafts).
* **Icons/Fonts:** Lucide Icons / Google Fonts (Inter or Geist).

## 3. Core Requirements & Architecture

### A. Folder Structure
- `/index.html` (Main entry point)
- `/css/style.css` (Tailwind & custom animations)
- `/js/db.js` (Dexie.js configuration)
- `/js/main.js` (UI logic)
- `/assets/` (Images & PDF CV)

### B. Functional Sections (Mapping CV Data)
1.  [cite_start]**Hero Section:** - Name: Chathushka Sanjaya[cite: 5].
    - [cite_start]Role: Postgraduate Student in IT & Strategic Innovation[cite: 2, 23].
    - Visual: Graduation photo or abstract tech background.
2.  [cite_start]**About Me:** - Content: Passionate, goal-oriented IT professional with a strong academic foundation[cite: 18, 19].
    - [cite_start]Key Traits: Dependable, organized, and focused on excellence[cite: 20, 21].
3.  [cite_start]**Bento Grid Skills:** - Tech: Python, HTML, Java, C#, JavaScript, ASP.NET, Laravel, Bootstrap[cite: 17].
    - [cite_start]Soft Skills: Management, Creativity, Negotiation, Leadership[cite: 8, 9, 13, 15].
    - [cite_start]Specialty: QA & Testing (Black Box, White Box, Test Case Design)[cite: 24, 25, 26, 27].
4.  **Project Gallery:**
    - [cite_start]**Lanka TravelMate:** Smart Travel Assistant Chatbot (Python, Flask)[cite: 36, 37].
    - [cite_start]**DreamDay:** Wedding Planner Web App (ASP.NET MVC, C#)[cite: 42, 43].
    - [cite_start]**GasByGas:** Online Gas Distribution (Laravel, MySQL, Agile/Scrum)[cite: 44].
    - [cite_start]**Pearl Heritage:** Real-time booking website[cite: 38].
5.  **Research & Academic:**
    - [cite_start]Big Data ethics/legal analysis (Grade: Merit)[cite: 50, 51].
    - [cite_start]Financial industry operational efficiency research at Commercial Bank[cite: 52].
6.  [cite_start]**Education Timeline:** - MSc at Kingston University[cite: 23].
    - [cite_start]BEng at London Metropolitan University (Second Upper Class)[cite: 23].
    - [cite_start]Pearson BTEC HND (Merit)[cite: 23].

## 4. Technical Implementation Instructions

### Step 1: Dexie.js Setup (`js/db.js`)
Initialize a local database to store visitor interactions:
```javascript
const db = new Dexie("PortfolioDB");
db.version(1).stores({
    settings: "id, theme, lastVisit",
    drafts: "++id, name, email, message"
});