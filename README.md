# D3 Force Graph App

A web application that visualizes graph data using `d3-force`. Users can input JSON data to render nodes and edges with directional arrows.

## Development Setup

1.  **Prerequisites**: Ensure you have Node.js installed (v18+ recommended).
2.  **Navigate to the project directory**:
    ```bash
    cd d3-force-app
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## Building for Production

To build the application for production:

```bash
npm run build
```

The output will be in the `dist` directory.

## GitHub Configuration & Deployment

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

### 1. Push to GitHub
Push this repository to GitHub.

### 2. Configure GitHub Pages
1.  Go to your repository on GitHub.
2.  Navigate to **Settings** > **Pages**.
3.  Under **Build and deployment**, select **GitHub Actions** as the Source.

### 3. Automatic Deployment
The workflow file located at `.github/workflows/deploy.yml` will automatically build and deploy the application whenever you push to the `main` branch.

- The build artifact is created from `d3-force-app/dist`.
- The `vite.config.ts` is configured with `base: './'` to ensure assets load correctly on GitHub Pages.
