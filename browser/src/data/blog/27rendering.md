---
title: Client/server side rendering
date: 2025-02-16
description: ""
published: false
---

import { Image } from "astro:assets";
import rendering01 from "../../assets/images/rendering01.png";
import rendering02 from "../../assets/images/rendering02.png";
import rendering03 from "../../assets/images/rendering03.png";

When I was learning about frontend rendering designs, I struggled to find an article that articulated the differences with advice on what to use and what technologies can assist.
So I'll write one instead. Note that this is distinct from [single page applications (SPA) and multi page applications (MPA).](/blog/28_single_page_applications)

The biggest differentiator between websites that are static, client-side rendered, and server-side rendered is deciding when to generate your HTML.

## Static Pre Rendering

<div class="image-gallery">
  <Image
    src={rendering01}
    alt="Diagram of static website flow."
    className="image"
    height="350"
  />
</div>

This is the simplest of the three options. When you build your code (some version of `npm run build`), it is converted into html, css, and javascript. When a user's browser requests to see your page, a server provides these files. It is considered *static* because the server provides the same content to every request. 
This doesn't mean that that page is not interactive, css and javascript can be used to create animations, forms, buttons. Static websites are extremely efficient to cache, making them very fast to load.
But static sites have limitations. If you had custom URL endpoints like `mywebsite.com/posts/$id` where `$id` is the ID of a blog post, a new post would only become available when the code is rebuilt. It's also difficult to customise pages based on the user, such as product carts in online shopping websites.

**Purpose**
Pages where it's acceptable for content to be only be available when the developer builds it. 
Great for personal blogs, small company home pages.
If a static website meets your needs, use it. It's the simplest, fastest, and cheapest option.

**Tools**
I like [Astro](https://astro.build/) as the framework. It's quite good at being very efficient for simple cases, with opt-in complexity if you want more control.
For deployments, I'd recommend [GitHub Pages](https://pages.github.com/) for simplicity, or [S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html) to have control of edge caching with CloudFront.

## Dynamic

To overcome the limitations of a static website, we can split the rendering into two steps: first we build a skeleton which dictates how to generate pages, then we combine it with data to render the page. This rendering can be done on the client side in the users browser, or the server side in a machine that we control.

## Client Side Rendering (CSR)

<div class="image-gallery">
  <Image
    src={rendering02}
    alt="Diagram of client side rendering flow."
    className="image"
    height="350"
  />
</div>

The users browser retrieves the skeleton which describes how to make a page, and retrieves the data, then combines the two to render the page. This overcomes the limitations of a static site, as the data will be up-to-date with the database. The main issue with this approach is latency of the initial load - it's using the users internet connection to get data and CPU to build. If the user has slow internet, or is viewing the page on a cheap device, this could cause a long wait until the user can see the fully rendered page. 
After the initial load, however, page updates can happen very quickly, as we can re-render subcomponents of the page as needed.
It is also relatively cheap, because the site is being built on a device that you aren't paying for.

**Purpose**
Pages with dynamic content, where fast responses to user input is more important than initial load time, such as Google Maps.

**Tools**
I like [React Router](https://reactrouter.com/home). I've been meaning to try Svelte.
For deployments, I'd recommend a similar method to pre-rendered sites, with [GitHub Pages](https://pages.github.com/) or [S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html). 

## Server Side Rendering (SSR)

Similarly to client side rendering, the server that retrieves the skeleton also retrieves the data, combining the two to generate the page. The main advantage of doing this on the server is that we can guarantee the build is on a high-powered machine with very fast internet. It also doesn't need to communicate as much information back to the users device, because the built page is usually much smaller than the skeleton & data.
However, this can be expensive for sites with a lot of traffic. It's also very complex. What I haven't talked about is optimisations like showing partial builds to the user so it feels like its loading quickly.

**Purpose**
Pages with dynamic content wanting fast initial load time, such as blogs and shopping sites.

**Tools**
I don't have much experience in different SSR frameworks, but [Astro](https://astro.build/) and [React Router](https://reactrouter.com/home) both support it.
Deployments are tricky to implement yourself, so I'd recommend picking a service with a free tier like netlify or cloudflare (I dislike AWS Amplify with a passion). Be very careful of how expensive it gets if your site becomes popular.

<div class="image-gallery">
  <Image
    src={rendering03}
    alt="Diagram of server side rendering flow."
    className="image"
    height="350"
  />
</div>
