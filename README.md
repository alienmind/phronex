# App
This is a demo project, for learning purposes, to teach me latest Next JS 15 and React 19.

## App name
The name is derived from the Greek word "Phronesis" (φρόνησις), which means practical wisdom or prudence—especially the kind used in decision-making, planning, and budgeting. The name Phronex captures the essence of thoughtful planning and managing resources, which fits perfectly for a project budgeting web application. Plus, it sounds modern and catchy.

<p align="center">
  <img src="doc/logo.jpg" alt="Phronex logo: derived from the Greek word 'Phronesis' (φρόνησις), which means practical wisdom or prudence—especially the kind used in decision-making, planning, and budgeting." style="width:350px; height:350px; border-radius:50%; float:right">
</p>

# Task

# High level idea

# Solution architecture

## Lab architecture

<p align="center">
  <img src="doc/labarchitecture.png" alt="Solution architecture (LAB)">
</p>

## Prod architecture

<p align="center">
  <img src="doc/prdarchitecture.png" alt="Solution architecture (PRD)">
</p>


# Prerrequisites
1. Linux (tested on Ubuntu v22.04 and Amazon Linux AMI)
2. Docker v27 or up
3. Node v20 / nvm / pnpm

## Install Node and pnpm

```bash
  nvm install v20.11.1
  npm install -g pnpm@latest
```

## Fist steps
1. Clone the project, 
2. Set up your .env based on .env.template
   cp -p .env.template .env # and edit values

## Run / build with docker
Build process somehow requires the database to be up as SSR will require temporarily connect.
It is necessary to bring up a partial docker-compose.yml with just the database up before building.

All steps are automated in build.sh, just run:
```bash
./build.sh
```

Make sure to keep .env.* files around necessary for the build.

Any subsequent run will just require the default docker-compose.yml file.
```bash
docker compose up -d
```

# Instructions (run locally)
1. Customize your own .env based on .env.localhost
2. Run
```bash
pnpm run dev
```

Or simply:
```bash
./rundev.sh
```

## Access:
1. PostgreSQL access: http://localhost:8080/
2. Web UI access:  http://localhost:3000/

## Seed test data (only first time)
1. Access http://localhost:3000/seed

# Instructions (AWS)
TBD

# TODO list (high level)
- [x] Set up project on Github
- [x] High level solution architecture and navigation design
- [x] Decide tech stack (with reasoned defaults)
- [x] Scaffold basic app with the final stack and solve all required dependencies
- [x] Containerized run
- [ ] V1 : local dev, login screen, basic prototype with static content
- [ ] V2 : feature complete in docker
- [ ] V3 : deployed with final serverless architecture
- [ ] V4 : Prepare analytics with quicksight
- [ ] Finalize and adjust final solution architecture documentation
- [ ] Project plan to production
- [ ] Prepare presentation slides as code with revealJS


# Detailed TODO
- [x] .. Scaffold with nextJS (used nextJS tutorial + dockerized local postgresql)
- [x] .. Integrate tailwindcss, shadcn/ui, state manager?
- [x] .. Dockerize the web app
- [ ] .. Refactor project - inc. security boundaries
- [ ] .. Visuals - basic screen layout inc. navbar and grid
- [ ] .. Landing page
- [ ] .. Login screen
- [ ] .. Data model (as JSON objects in lib/data.ts)
- [ ] .. Static projects dashboard
- [ ] .. Static project detail screen inc. metadata, scope, reporting
- [ ] .. Create the actual data model DDLs and apply locally to postgresql
- [ ] .. Populate info from the JSONs
- [ ] .. Implement update project details
- [ ] .. Implement delete project details with confirmation dialog
- [ ] .. Implement enroll in project button (and screen?)

# Extras
- [ ] .. Separate service (Python + FastAPI) that integrates with OpenAI for structured budget scaffolding based on scope text
- [ ] .. Try to generate cost items based in the model output
- [ ] .. Dark theme
- [ ] .. Registration screen

## Issues
- [ ] .. Create project form

# Appendix

Created from my Next JS demo project https://github.com/new?template_name=nextjs-postgresql-tutorial&template_owner=alienmind

... which was created with:
npx create-next-app@latest phronex --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm

## References used
- React Router 7 Tutorial - https://www.youtube.com/watch?v=pw8FAg07kdo
- NextJS Tutorial - https://nextjs.org/learn/dashboard-app/getting-started
- NextJS Tutorial with local PostgreSQL - https://medium.com/@dekadekadeka/next-js-tutorial-with-local-database-quick-start-guide-394d48a0aada
- ShadCN UI components - https://ui.shadcn.com/docs/components
- Lucide icons - https://lucide.dev/icons
- TailwindCSS cheat sheet - https://nerdcave.com/tailwind-cheat-sheet
- PostgreSQL locally with docker-compose https://medium.com/@agusmahari/docker-how-to-install-postgresql-using-docker-compose-d646c793f216
- PostgreSQL official docker image https://hub.docker.com/_/postgres
- Dockerize NextJS app https://nextjs.org/docs/app/building-your-application/deploying#docker-image

## Shadcn for premade UI components
I've been adding shadcn premade components to the project, together with tailwindcss theming.

Install https://ui.shadcn.com/docs/installation/vite
  npx shadcn@latest init

Successive UI components have been added under components/ui via:

```bash
  npx shadcn@latest add sidebar
  npx shadcn@latest add card
  npx shadcn@latest add alert-dialog
  npx shadcn@latest add dropdown-menu
  npx shadcn@latest add table
  npx shadcn@latest add scroll-area
  npx shadcn@latest add drawer
  npx shadcn@latest add dialog
  npx shadcn@latest add form
```

Make sure to set it up to use tailwindcss utility classes by setting tailwind.cssVariables = false in components.json 

## Dockerize it

To add support for Docker to an existing project, just copy the [`Dockerfile`](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile) into the root of the project and add the following to the `next.config.js` file:

```js
// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: "standalone",
};
```

This will build the project as a standalone app inside the Docker image.

How to use Docker with Next.js based on the [deployment documentation](https://nextjs.org/docs/deployment#docker-image).

Build the container: `docker build -t phronex-webapp .`.

Run the container: `docker run -p 3000:3000 phronex-webapp`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.


## Last minute things
[ ] Hero images
[ ] Favicon
[ ] Cleanup secrets?