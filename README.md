# Family Expense Manager

![Expense Manager Example 1](https://github.com/user-attachments/assets/617692bc-5625-4c80-8b1d-a8f562431eea)
![Expense Manager Example 2](https://github.com/user-attachments/assets/53cb8cbe-b184-4e6d-bda0-5aa60e26f413)

A **Family Expense Manager** app built using **Microsoft SQL Server**, **ASP.NET Core**, and **React**. This application helps families efficiently manage and track their shared expenses while promoting transparency and accountability.

## Features

- **User Registration and Family Management**:  
  Users can register, invite family members, and create family groups.

- **Expense Tracking**:  
  Members can add expenses, visible to the entire family for easy tracking.

- **Approval System for Adults**:  
  Only adults in the family can approve expenses, ensuring financial control and responsibility.

- **Expense Summaries and Filters**:  
  Users can view the total expenses for specific periods and filter expenses by timeframes for detailed insights.

- **Secure Authentication with JWT**:  
  Authentication is handled using JSON Web Tokens (JWT) to ensure secure and stateless user sessions.

- **RESTful API**:  
  The backend implements a RESTful API, enabling Create, Read, Update, and Delete (CRUD) operations for managing users, expenses, and families.

## Tech Stack

- **Frontend**: React  
- **Backend**: ASP.NET Core  
- **Database**: Microsoft SQL Server
- **Authentication**: JWT Tokens
- **Containerization**: Docker

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/)  
- [.NET SDK](https://dotnet.microsoft.com/download)  
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server)
- [Docker](https://www.docker.com/) 

### Steps

#### Option 1: Run Locally

1. **Clone the Repository**
2. **Setup the Backend:**
   
   - Navigate to the backend folder.
   - Update the connection string in appsettings.json to point to your SQL Server.
   - Run database migrations: "dotnet ef database update"
   - Start the backend server: "dotnet run"
3. **Setup the Frontend**
   - Navigate to the frontend folder.
   - Install dependencies: "npm install"
   - Start the React development server: "npm start"
4. **Access the App: Open your browser and navigate to http://localhost:3000 to access the app.**

#### Option 2: Run with Docker

1. **Ensure Docker is installed and running on your machine.**
2. **In the root directory of the project (where the docker-compose.yml file is located), run: "docker-compose up --build"**

   This command will:
   - Build and start both the frontend and backend containers.
   - Expose the frontend on http://localhost:80 and the backend on http://localhost:8080 (if needed).
4. **Open your browser and navigate to http://localhost:80 to access the app.**

## Usage

1. **Register and Create Family Groups**
   - Register your account and invite family members to join your group.
2. **Add Expenses**
   - Add any expenses you make to the shared list.
3. **Approve Expenses**
   - Adult members can approve or reject expenses submitted by other family members.
4. **Track Expenses**
   - Use filters to view total expenses or narrow down to specific timeframes.

## Roadmap

- Add support for customizable spending caps.
- Add filters by date, time, price, etc.
- Introduce analytics for better financial insights.
- Implement a mobile-friendly design.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
