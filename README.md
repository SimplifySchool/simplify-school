# Simplify School

A tool that simplifies students' school life.

## System Architecture

This project is a monorepo structured as follows:

- **/backend**: Go REST API
- **/frontend**: React application

## Tech Stack

- **Backend:** Go 1.21+, Fiber Framework, PostgreSQL.
- **Frontend:** React, TypeScript, Tailwind CSS.
- **Tooling:** Docker, GitHub Actions.

## Local Development

### Requirements

- Node.js (v. 18 or higher)
- Docker
- NPM/Yarn/PnPm
- Golang

1. Backend Setup

```bash
cd backend
go mod download
# Create your local env file
cp .env.example .env
# Start the server (using Air for hot-reload if you have it)
go run main.go
```

2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Workflow

- Always go mod tidy before pushing backend changes to ensure go.sum is up to date.
- **Naming Convention:** Use feature/, fix/, or refactor/ prefixes for branches.
- **Code Reviews:** At least one other person must approve a Pull Request before merging to `main`.
