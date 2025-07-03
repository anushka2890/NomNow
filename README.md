# 🍽️ NomNow – Full Stack Restaurant App (WIP)

**NomNow** is a full-stack restaurant management and food ordering application. It allows users to browse restaurants, view menus, place orders, and manage their profiles — while admins can manage restaurant data, menu items, and orders.

> 🚧 This project is currently under active development. Core backend APIs are implemented, frontend components are functional, and integration is complete.

---

## 🔧 Tech Stack

| Layer     | Tech Stack |
|-----------|------------|
| **Frontend**  | Angular, TypeScript, HTML, CSS |
| **Backend**   | Java, Spring Boot, Spring Data JPA, Spring Security |
| **Authentication** | JWT |
| **Database**  | PostgreSQL |
| **Tools**     | Maven, Angular CLI, Git, Postman |

---

## ✨ Features

### 👥 Users
- Register and login
- JWT-based authentication
- Browse restaurants and menus
- Add items to cart and place orders
- View order history

### 🧾 Admins
- Role-based access control
- Add/update restaurants and dishes
- Manage orders and track status
- Admin dashboard

---

## 🚀 Getting Started

### 🔁 Prerequisites

- Node.js & npm  
- Angular CLI (`npm install -g @angular/cli`)  
- Java 17+  
- PostgreSQL  

### 📦 Backend Setup

1. Navigate to the root directory:
```bash
cd NomNow
```
2. Create a PostgreSQL database (e.g. `nomnowdb`) and configure credentials in `application.properties`
3. Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```
The API should be available at `http://localhost:8080`

### 🌐 Frontend Setup (`nomnow-ui`)

1. Navigate to the frontend directory:
```bash
cd nomnow-ui
```
2. Install dependencies:
```bash
npm install
```
3. Start the Angular development server:
```bash
ng serve
```
The app should be available at `http://localhost:4200`


> ⭐ Stay tuned — development is active and ongoing!
