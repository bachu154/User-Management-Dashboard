# 📊 User Management Dashboard  

A responsive and fully functional **User Management Dashboard** built with **React + Vite + TypeScript**.  
This project allows users to **view, add, edit, delete, search, sort, and filter user details** while interacting with a mock API.  

---

## ✨ Features  
✔️ **User List Display** – View users in a clean table layout  
✔️ **CRUD Operations** – Add, Edit, Delete users  
✔️ **Search & Filters** – Find users by name, email, or department  
✔️ **Sorting** – Sort user list by columns (e.g., Last Name)  
✔️ **Pagination / Infinite Scroll** – Handle large datasets (10, 25, 50, 100 per page)  
✔️ **Form Validations** – Prevent empty or invalid input (e.g., email format)  
✔️ **Error Handling** – Gracefully handle API/network errors  
✔️ **Responsive Design** – Works across **desktop, tablet, and mobile**  

---

## 🛠️ Tech Stack  
- ⚛️ **React (Vite + TypeScript)** – Frontend framework  
- 🎨 **Tailwind CSS** – Styling & responsive layout  
- 🔗 **Fetch API / Axios** – API calls  
- 📦 **Node.js & npm** – Dependency management  
- ▲ **Vercel** – Deployment  

---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/bachu154/User-Management-Dashboard.git
cd User-Management-Dashboard/project

2️⃣ Install Dependencies
bash
npm install

3️⃣ Run Locally
bash
npm run dev

4️⃣ Build for Production
bash
npm run build

5️⃣ Preview Build
bash
npm run preview

🌐 Deployment
The project is deployed using Vercel.

🔗 Live Demo: User Management Dashboard

🔗 API Reference
This project uses JSONPlaceholder for simulating a backend.

Action	Method	Endpoint
View Users	GET	/users
Add User	POST	/users
Edit User	PUT	/users/:id
Delete User	DELETE	/users/:id

⚠️ Note: JSONPlaceholder simulates responses but does not persist data.

✅ Assignment Evaluation Checklist
 View Users
 Add User
 Edit User
 Delete User
 Search & Filter
 Sorting
 Pagination / Infinite Scrolling
 Responsive UI
 Error Handling
 Form Validations
 Deployment
 README Documentation


💡 Reflections

🔴 Challenges Faced
Handling state updates after CRUD since JSONPlaceholder does not persist changes.

Combining search, filter, and sort without performance lag.

Designing a fully responsive UI across all devices.

🟢 Improvements (Future Enhancements)
Replace mock API with a real backend (Node.js/Express + DB).

Add authentication & role-based access control (Admin/User).

Write unit tests (Jest, React Testing Library).

Enhance UI/UX with animations and design system.


📽️ Assignment Deliverables

💻 GitHub Repository: https://github.com/bachu154/User-Management-Dashboard.git

🌐 Deployed App: https://user-management-dashboard-xi-bice.vercel.app/
