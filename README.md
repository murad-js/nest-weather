# Weather Subscription Service

A NestJS application that provides weather updates via email subscriptions. You can subscribe to receive weather updates for any city either hourly or daily.

## Features

- Get current weather for any city
- Subscribe to receive weather updates via email
- Choose between hourly or daily updates
- Easy subscription management

## Prerequisites

- Node.js (22.11)
- Docker and Docker Compose (for containerized setup)
- npm (10.9)

## Environment Setup

1. Copy the environment example file:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`.

3. For email credentials, please refer to [Google documentation](https://docs.google.com/document/d/your-doc-idhttps://support.google.com/accounts/answer/185833?hl=en#zippy=%2Cwhy-you-may-need-an-app-password).

## Running the Application

### Option 1: Using Docker Compose (Recommended)

1. Start all services:
```bash
docker-compose up
```

2. In a new terminal, find the container ID:
```bash
docker ps
```

3. Run migrations using the container ID:
```bash
docker exec <container_id> npm run prod-migration:run
```

To stop all services:
```bash
docker-compose down
```

### Option 2: Local Development

1. Install dependencies:
```bash
npm install
```

2. Run migrations:
```bash
npm run migration:run
```

3. Start the development server:
```bash
npm run start:dev
```

## How to Use

1. Subscribe to weather updates:
   - Choose your preferred city
   - Select update frequency (hourly/daily)
   - Provide your email address

2. The service will automatically:
   - Send weather updates at your chosen frequency
   - Include temperature, humidity, and weather description
   - Handle subscription management

3. You can manage your subscriptions:
   - Unsubscribe at any time
