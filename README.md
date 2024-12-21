# Family Expense Manager

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

## Tech Stack

- **Frontend**: React  
- **Backend**: ASP.NET Core  
- **Database**: Microsoft SQL Server
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
4. **Access the App: Open your browser and navigate to http://localhost:3000.**

#### Option 2: Run with Docker

1. **Ensure Docker is installed and running on your machine.**
2. **Build and start the Docker containers (backend and frontend) using: "docker-compose up --build"**
3. **Open your browser and navigate to http://localhost:80.**

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
