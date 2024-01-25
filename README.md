# Nick Sullivan

A [personal website]. Also available on [GitHub], using [GitHub Pages].

The website contents are in the `docs` folder, using [Just the Docs] as a template.
The website domain is managed using AWS CloudFront. the `terraform` folder contains

- `foundation`: resources that are difficult/slow to change, such as name servers
- `infrastructure`: resources that are disposable, but not deployed by CICD
- `upload`: CICD builds the website contents and runs this to upload the build to S3

---

[personal website]: https://nickdavesullivan.com/
[Just the Docs]: https://just-the-docs.github.io/just-the-docs/
[GitHub]: https://nick-sullivan.github.io/
[GitHub Pages]: https://docs.github.com/en/pages
