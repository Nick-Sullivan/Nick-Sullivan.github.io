---
title: Serverless
layout: default
parent: Blog
nav_order: 13
published: true
date: 2024-12-16
---

<!-- Serverless architecture is not distinct from traditional architecture -->

## {{ page.date }} {{ page.title }}

I like serverless components, but I don't like the tooling around it.

I really like the invention of serverless architecture. It lowered the barrier to entry for creating experimental work. I have a number of small projects that I use to familiarise myself with new technologies and patterns, and the running cost of all of them is around $5 AUD per month[^1]. Since I don't market these projects or make them profitable, keeping costs low is essential.

Were I to deploy them on traditional architectures, the cost would be approximately $100 AUD per month (the smallest EC2 server costs $4 AUD per month). 

However, if I were to turn a project into a product, I would migrate from serverless to servers once it reached a certain scale. At scale, servers become more cost-effective, and predictable cloud costs make financial planning easier. Additionally, it avoids the ever-present risk of infinite recursion[^2], which keeps me awake at night.

For these reasons, I prefer to build my services in a way that allows them to be deployed to different architectures[^3]. 

What I've noticed, however, is that a lot of serverless tooling takes an opposite perspective, with serverless-specific [infrastructure as code](https://aws.amazon.com/serverless/sam/), and [unique deployment](https://www.cargo-lambda.info/).
I can see why this could be desireable, cloud architecture is difficult and cloud services want to provide a way to abstract it away, with the bonus that clients will find it difficult to change providers if they scale.

My preference is when building small, build for flexibility.


### Example: Web Services

Take web services as an example. I like to build them so that they perform their own routing, which means they can be run locally as a web API, be deployed to API Gateway to run by lambdas (with all endpoints pointing to the same lambda), or be deployed to a server to act as its own router. This approach comes with additional overhead and a more complex entrypoint, but I appreciate the consistency in local development and flexibility to change deployment targets.

Recently, I've been building with Rust, and the `axum` web framework allows the use of consistent routing logic with a different way of serving. 
I use this as a template for my web services. The source code is [here](https://github.com/Nick-Sullivan/rust-web-template/tree/main). 

```rust
#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .json()
        .with_max_level(tracing::Level::INFO)
        .with_span_events(FmtSpan::NONE)
        .init();
    let trace_layer =
        TraceLayer::new_for_http().on_request(|request: &Request<Body>, _: &tracing::Span| {
            tracing::info!(
                method = %request.method(),
                uri = %request.uri(),
                headers = ?request.headers(),
                message = "begin request!"
            )
        });
    let app = Router::new()
        .route("/", get(handle_root))
        .route("/from_api", get(handle_from_api))
        .layer(trace_layer);
    #[cfg(feature = "api_gateway_trigger")]
    {
        let app = tower::ServiceBuilder::new()
            .layer(axum_aws_lambda::LambdaLayer::default())
            .service(app);
        lambda_http::run(app).await
    }
    #[cfg(feature = "local_trigger")]
    {
        let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 3000));
        let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
        axum::serve(listener, app).await
    }
}
```

---

[^1]: The biggest costs are the domain names, ECR registries, and SQS. Annoyingly, lambdas will poll SQS queues even if they are empty 99% of the time. I would love it if the polling would turn off due to inactivity, and turn back on based on internal queue events.
[^2]: I wish cloud services had a project-scoped kill-switch. If my project costs exceed a threshold, kill all compute.
[^3]: This enables other cool things, like lambdas to quickly respond to increased demand while your system scales up more servers.
