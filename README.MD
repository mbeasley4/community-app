# **Fit30 Community Platform** *(Fictional Brand / Demo Project)*

A modern community platform built with **Laravel 12**, **Vite**, and
**React**.\
This application powers a **fictional wellness community brand called
Fit30**, featuring community posts, recipe sharing, video content, and
online courses.

Designed for performance, scalability, and an excellent member
experience.\
**Fit30 is a fictional brand created for demonstration and development
purposes.**

------------------------------------------------------------------------

## ✨ Features

-   User authentication and profiles\
-   Community posts and discussions\
-   Recipe creation, tagging, and sharing\
-   Video library with streaming-ready storage\
-   Online courses with progress tracking\
-   Categories and content discovery\
-   Social sharing\
-   Admin content management\
-   RESTful JSON API\
-   Responsive React UI powered by Vite

------------------------------------------------------------------------

## 🧱 Tech Stack

### Backend

-   Laravel 12\
-   PHP 8.3+\
-   MySQL or PostgreSQL\
-   Redis (optional caching & queues)

### Frontend

-   React 18\
-   Vite\
-   Tailwind CSS

### Media

-   Local or S3-compatible object storage\
-   CDN-friendly asset delivery

### DevOps

-   Queue workers\
-   Task scheduler\
-   Docker-ready environment

------------------------------------------------------------------------

## 📦 Requirements

-   PHP \>= 8.3\
-   Composer\
-   Node.js \>= 20\
-   NPM or Yarn\
-   MySQL or PostgreSQL\
-   Redis (optional)

------------------------------------------------------------------------

## 🚀 Installation

Clone the repository:

``` bash
git clone https://github.com/your-org/fit30-community.git
cd fit30-community
```

Install backend dependencies:

``` bash
composer install
```

Install frontend dependencies:

``` bash
npm install
```

Create environment file:

``` bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your database credentials.

Run migrations:

``` bash
php artisan migrate
```

Build frontend assets:

``` bash
npm run build
```

Start development servers:

``` bash
php artisan serve
npm run dev
```

Application will be available at:

    http://localhost:8000

------------------------------------------------------------------------

## ⚙️ Environment Variables

Example `.env` values:

    APP_NAME="Fit30 Community"
    APP_ENV=local
    APP_DEBUG=true
    APP_URL=http://localhost:8000

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=fit30
    DB_USERNAME=root
    DB_PASSWORD=

    FILESYSTEM_DISK=public

    # Optional S3 Media Storage
    MEDIA_DISK=s3
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_DEFAULT_REGION=us-east-1
    AWS_BUCKET=

------------------------------------------------------------------------

## 🧪 Testing

Run backend tests:

``` bash
php artisan test
```

------------------------------------------------------------------------

## 📚 API Overview

The platform exposes RESTful JSON endpoints for:

-   Authentication\
-   Users & Profiles\
-   Posts & Comments\
-   Recipes\
-   Videos\
-   Courses & Lessons\
-   Progress Tracking

API routes are located in:

    routes/api.php

------------------------------------------------------------------------

## 🗂️ Project Structure

    app/                # Laravel application logic  
    database/           # Migrations & seeders  
    routes/             # Web & API routes  
    resources/
      js/               # React frontend  
      views/            # Blade root layout  
    storage/            # Media uploads  
    public/             # Compiled assets  

Frontend entry point:

    resources/js/main.jsx

Vite configuration:

    vite.config.js

------------------------------------------------------------------------

## 🎥 Media Handling

By default, uploaded media is stored locally:

    storage/app/public

To enable cloud storage, set:

    FILESYSTEM_DISK=s3

Then configure AWS credentials in `.env`.

A CDN is recommended for production video delivery.

------------------------------------------------------------------------

## 🔐 Authentication

Authentication uses Laravel's session-based auth for web and API token
support for frontend requests.

Extendable for:

-   Social login\
-   SSO providers\
-   Mobile clients

------------------------------------------------------------------------

## 🧭 Production Deployment

``` bash
composer install --no-dev --optimize-autoloader
npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:work
```

Scheduler cron:

``` bash
* * * * * php /path-to-project/artisan schedule:run >> /dev/null 2>&1
```

------------------------------------------------------------------------

## 🤝 Contributing

Contribution access is restricted.\
No external contributions are permitted without written authorization
from the project owners.

------------------------------------------------------------------------

## 📄 License

**STRICTLY PROPRIETARY --- ALL RIGHTS RESERVED**

This software, its source code, architecture, and associated assets are
the exclusive intellectual property of **Mike Beasley** and **Black Lab
Development**.

No part of this repository may be copied, reproduced, modified,
published, distributed, sublicensed, shared, or made publicly accessible
in any form without explicit written permission from the copyright
holders.

Unauthorized access, use, or distribution of this software is strictly
prohibited and may result in legal action.

------------------------------------------------------------------------

## 👤 Project Ownership

Created and maintained by:

**Mike Beasley**\
**Black Lab Development**\
https://www.blacklabdev.com

------------------------------------------------------------------------

## 📬 Contact

For authorized access requests, support, or partnership inquiries,
please contact Black Lab Development directly.
