# Gemini 2.0 Flash Image Generation and Editing

Nextjs quickstart for to generating and editing images with Google Gemini 2.0 Flash. It allows users to generate images from text prompts or edit existing images through natural language instructions, maintaining conversation context for iterative refinements. Try out the hosted demo at [Hugging Face Spaces](https://huggingface.co/spaces/philschmid/image-generation-editing).

https://github.com/user-attachments/assets/8ffa5ee3-1b06-46a9-8b5e-761edb0e00c3

Get your `GEMINI_API_KEY` key [here](https://ai.google.dev/gemini-api/docs/api-key) and start building.

**How It Works:**

1. **Create Images**: Generate images from text prompts using Gemini 2.0 Flash
2. **Edit Images**: Upload an image and provide instructions to modify it
3. **Conversation History**: Maintain context through a conversation with the AI for iterative refinements
4. **Download Results**: Save your generated or edited images

## Basic request

For developers who want to call the Gemini API directly, you can use the Google Generative AI JavaScript SDK:

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage() {
  const contents =
    "Hi, can you create a 3d rendered image of a pig " +
    "with wings and a top hat flying over a happy " +
    "futuristic scifi city with lots of greenery?";

  // Set responseModalities to include "Image" so the model can generate
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseModalities: ["Text", "Image"]
    }
  });

  try {
    const response = await model.generateContent(contents);
    for (const part of response.response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync("gemini-native-image.png", buffer);
        console.log("Image saved as gemini-native-image.png");
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
```

## Features

- 🎨 Text-to-image generation with Gemini 2.0 Flash
- 🖌️ Image editing through natural language instructions
- 💬 Conversation history for context-aware image refinements
- 📱 Responsive UI built with Next.js and shadcn/ui
- 🔄 Seamless workflow between creation and editing modes
- ⚡ Uses Gemini 2.0 Flash Javascript SDK

## Getting Started

### Local Development

First, set up your environment variables:

```bash
cp .env.example .env
```

Add your Google AI Studio API key to the `.env` file:

_Get your `GEMINI_API_KEY` key [here](https://ai.google.dev/gemini-api/docs/api-key)._

```
GEMINI_API_KEY=your_google_api_key
```

Then, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgoogle-gemini%2Fgemini-image-editing-nextjs-quickstart&env=GEMINI_API_KEY&envDescription=Create%20an%20account%20and%20generate%20an%20API%20key&envLink=https%3A%2F%2Faistudio.google.com%2Fapp%2Fu%2F0%2Fapikey&demo-url=https%3A%2F%2Fhuggingface.co%2Fspaces%2Fphilschmid%2Fimage-generation-editing)

### Docker

1. Build the Docker image:

```bash
docker build -t nextjs-gemini-image-editing .
```

2. Run the container with your Google API key:

```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_google_api_key nextjs-gemini-image-editing
```

Or using an environment file:

```bash
# Run container with env file
docker run -p 3000:3000 --env-file .env nextjs-gemini-image-editing
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### GitHub Actions Automated Build

This project is configured with GitHub Actions workflow to automatically build Docker images and publish them to GitHub Container Registry (GHCR).

#### Triggers

The workflow is triggered by:
- Push to the `main` branch
- Manual workflow dispatch

#### Features

1. Checkout repository code
2. Set up Docker Buildx
3. Log in to GitHub Container Registry
4. Extract Docker image metadata (tags, labels)
5. Build and push Docker image to GitHub Container Registry

#### Image Tags

Automatically generated tags include:
- `latest` (only for default branch)
- Short SHA commit hash
- Branch name
- Tag name (if any)

#### Permissions

The workflow requires the following permissions:
- `contents: read` - Read repository contents
- `packages: write` - Write to GitHub Packages (for publishing Docker images)

#### Usage

1. Ensure GitHub Actions is enabled for your repository
2. Ensure GitHub Packages is enabled for your repository
3. Push code to the `main` branch or manually trigger the workflow
4. After the build completes, view the published Docker image on the GitHub Packages page

#### Pull Image

```bash
docker pull ghcr.io/[username]/[repository]:latest
```

#### Run Container

```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_google_api_key ghcr.io/[username]/[repository]:latest
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for the web application
- [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/) - AI model for image generation and editing
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.
