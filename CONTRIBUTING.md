# Contributing to the Gemini Image Editing Next.js Quickstart

We are excited to accept your patches and contributions to the Gemini Image Editing Next.js Quickstart. This repository provides a quickstart guide to generating and editing images using Gemini 2.0 Flash, with Next.js for creating responsive UIs and leveraging Google's Generative AI API.

This guide will help you get started with contributing to the project.

## Table of Contents
- [Before You Send Anything](#before-you-send-anything)
- [Code of Conduct](#code-of-conduct)
- [About](#about)
- [Resources](#resources)
- [Style Guides](#style-guides)
- [Technologies Used](#technologies-used)
- [CLA (Contributor License Agreement)](#cla-contributor-license-agreement)
- [License](#license)
- [How to Contribute](#how-to-contribute)
- [Footer](#footer)

## Before You Send Anything

### Sign Our Contributor Agreement

All contributions to this project must be accompanied by a Contributor License Agreement (CLA). This agreement ensures that you (or your employer) retain the copyright to your contribution while giving us permission to use and redistribute your work as part of the project.

If you or your current employer have already signed the Google CLA (even for a different project), you probably don't need to sign it again.

Visit [Google CLA](https://cla.developers.google.com/) to view your current agreements or to sign a new one.


## Code of Conduct

By participating in this project, you agree to follow the Code of Conduct to ensure a welcoming and respectful environment.

## About

Get started with native image generation and editing using Gemini 2.0 and Next.js.

For more information, visit [ai.google.dev/gemini-api/docs/image-generation](https://ai.google.dev/gemini-api/docs/image-generation).

---

## Resources

- [Readme](README.md)
- [License](LICENSE)
- [Security Policy](SECURITY.md)


## Style Guides

Before you start writing, please familiarize yourself with the technical writing style guide. You don't need to read it all, but do go through the highlights to avoid common feedback.

Additionally, please review the relevant style guide for the language you will be using. These apply strictly to raw code files (e.g., `*.ts`, `*.js`, `*.css`), but code snippets in documentation tend to favor readability over strict adherence.


## Technologies Used

- **Next.js** - React framework for the web application
- **Google Gemini 2.0 Flash** - AI model for image generation and editing
- **shadcn/ui** - Re-usable components built using Radix UI and Tailwind CSS

---
## License

By contributing to this repository, you agree that your contributions will be licensed under the project's open-source license, which can be found in the LICENSE file.


## How to Contribute

### 1. Set Up the Project
First, you need to clone or download the repository.

```sh
git clone https://github.com/google-gemini/gemini-image-editing-nextjs-quickstart.git
cd gemini-image-editing-nextjs-quickstart
```

### 2. Set Up Environment Variables
Create a `.env` file from the `.env.example` template:

```sh
cp .env.example .env
```

Then, open the `.env` file and add your Gemini API key:

```sh
GEMINI_API_KEY=your_google_api_key
```

You can get your API key from the [Google AI Studio](https://ai.google.dev/gemini-api/docs/image-generation).

### 3. Install Dependencies
Install the necessary dependencies for the project:

```sh
npm install
```

### 4. Run the Development Server
Start the development server:

```sh
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Docker Deployment
If you prefer deploying using Docker, follow these steps:

#### a. Build the Docker Image
Run the following command to build the Docker image:

```sh
docker build -t nextjs-gemini-image-editing .
```

#### b. Run the Docker Container
Run the container with your Gemini API key:

```sh
docker run -p 3000:3000 -e GEMINI_API_KEY=your_google_api_key nextjs-gemini-image-editing
```

Or, if you want to use an environment file:

```sh
docker run -p 3000:3000 --env-file .env nextjs-gemini-image-editing
```

Now, open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Footer

© 2025 GitHub, Inc.

---

By contributing to this project, you agree to abide by its terms and conditions. Thank you for your interest in contributing to the Gemini Image Editing Next.js Quickstart!
