---
title: "Frontend infrastructure part 4: technologies"
date: 2025-02-16
description: ""
published: false
---

This is part 4 of posts about front-end infrastructure, [View the previous post in this series here.](/blog/29fe_pages)

There are an enormous number of options of technologies to use, and this will only scratch the surface.

## Languages

Javascript / Typescript is the most popular, but it's definitely not the only language. 

It's possible to write frontend technologies in a number of languages, like C# (e.g. with Blazor), Ruby (e.g. with Ruby on Rails), and Python (e.g. Brython). These are often part of approaches that encompass both the frontend and the backend.

## Technologies

There are a number of technologies built on top of Javascript to improve development, some are *libraries* (your code controls execution, *you* call *it*), some are *frameworks* (it contols execution, *it* calls *you*), and some are *compilers* (builds into javascript). Not every technology fits cleanly into each category, so discussions tends to call them all *technologies*, (or sometimes call them all frameworks).

I'll try to cover the most popular options according to the [2024 Stack Overflow Survey.](https://survey.stackoverflow.co/2024/technology/#most-popular-technologies),

### React

React (39.5% use it, 62% want to keep using it) is the most popular library for frontend development. It largely maintains this title through inertia: employers use React to find more potential employees, and engineers learn React to maximise their chances of employment. Plus, there are lots of UI libraries and packages that are integrate with React.

React is a library, so its common to use a framework on top of it to supply the boilerplate for common actions.
- Next.js (17.9% use it, 59.5% want to keep using it)
- React-Router (1.6%, 56.7% want to keep using it, previously known as Remix)

The biggest complaint about React is the ease with which you can shoot yourself in the foot. It's not very opinionated.

### Not react

There are a few competing technologies in this space, but they are difficult to compare because they have so many similarities. They all follow a declarative paradigm, have an application lifecycle where events trigger updates in state, which trigger re-rendering, and they all support partial DOM re-rendering and encapsulation with reusable components. 

- **Angular** (17.1% use it, 53.4% want to keep using it)

Maintained by Google. It is opinionated and designed for building large-scale applications.

- **Vue.js** (15.4% use it, 60.2% want to keep using it)

Designed to be incrementally adoptable, meaning you can use as much or as little of Vue as you need. Vue is known for its simplicity and ease of integration with other projects and libraries.

- **Svelte** (6.5% use it, 72.8% want to keep using it)

Svelte is a compiler that converts declarative components into imperative code. This results in faster runtime performance and smaller bundle sizes.

- **Astro** (3% use it, 72.2% want to keep using it)

Astro is designed for building fast, low-JavaScript websites. If you really need javascript, you can embed other technologies like React or Svelte into. 


## My opinion

There is no one-size-fits-all technology, but that doesn't mean using a completely different set of frontend technologies for every project.

For my purposes, I have two go-to options:

### Simple content site

Simple to implement, low cost, fast initial load.

Think personal blogs, company information sites.

For this I use [Astro](https://astro.build/), in a multi page architecture, heavily leaning on static pre-rendering.
I make sure to enable [prefetch](https://docs.astro.build/en/guides/prefetch/) for speed of page navigation, and can use [server side rendering](https://docs.astro.build/en/guides/on-demand-rendering/#enabling-on-demand-rendering) if necessary.

If not using server side rendering, I use [S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html) for control of edge caching with CloudFront, and to align with the rest of my AWS infrastructure. (For a simpler option, I'd recommend [GitHub Pages](https://pages.github.com/)).

If I need server side rendering, I'll run my own NodeJS server (such as on Kubernetes or ECS). I avoid the services that can provide this, such as Vercel, Netlify etc.
They are very expensive at scale, and don't offer a charge limit. Google horror stories about [surprise bills](https://serverlesshorrors.com/all/netlify-104k/) when a site recieves traffic from a bug, a DDOS attack, or goes viral.

I also avoid AWS Amplify because its abstractions are leaky and I found it painful to use.

### Highly response web app

Fast rerendering, customised user experience, lots of re-used UI components.

Think a google maps style interactivity to visualise and manipulate data.

For this I use [React Router](https://reactrouter.com/home), which uses client-side rendering by default, and I enable [server-side rendering](https://reactrouter.com/start/framework/rendering) if I need to combine data from multiple API endpoints, or speed up the initial load. I use [mantine](https://mantine.dev/) for UI components.

In React Router, nested routes can act like a single-page architecture, so going to path `/clothes/1` will also load the data for `/clothes`, but it will not load the data for `/about`.

For deployments, I use the same process as I described for the simple content site.

As a side note, I'm keen to use Svelte, but at the moment it doesn't have the benefits of the size that React does. React has so many more integrations, UI libraries, and most of my workplaces have used React.
