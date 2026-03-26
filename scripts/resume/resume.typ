#import "@preview/fontawesome:0.5.0": *

#set document(title: "Nick Sullivan - Resume")
#set page(paper: "a4", margin: (x: 2cm, y: 2.2cm))
#set text(font: ("EB Garamond", "DejaVu Sans"), size: 10pt)
#set par(justify: true, leading: 0.5em, spacing: 0.55em)
#set list(spacing: 0.85em)

#let accent = rgb("#336699")

// Make all links visually distinct
#show link: it => text(fill: accent, it)

// Section heading with horizontal rule
#let section(title) = {
  v(0.9em, weak: true)
  smallcaps(text(size: 13pt, weight: "medium", title))
  v(0.25em, weak: true)
  line(length: 100%, stroke: 0.5pt)
  v(0.4em, weak: true)
}

// Two-column entry (years | content)
#let entry(years, body) = {
  grid(
    columns: (1.8cm, 1fr),
    column-gutter: 0.6em,
    align(right + top, smallcaps(years)),
    block(stroke: (left: 0.5pt), inset: (left: 0.5em, top: 0.2em, right: 0pt, bottom: 0pt), body),
  )
  v(1.2em, weak: true)
}

// Organisation name link + optional description
#let org(name, url, description: none) = {
  v(0.8em, weak: true)
  link(url)[#smallcaps(name)]
  if description != none {
    [ #sym.dash.en #emph(description)]
  }
  linebreak()
  v(0.3em)
}

// ─── Header ──────────────────────────────────────────────────────────────────

#align(center, text(size: 26pt, weight: "bold")[Nick Sullivan])
#v(0.5em)

#grid(
  columns: (1fr, 1fr),
  row-gutter: 0.4em,
  align: (left, right),
  [#fa-envelope() #link("mailto:nick.dave.sullivan@gmail.com")[nick.dave.sullivan\@gmail.com]],
  [#fa-github() #link("https://github.com/Nick-Sullivan")[github.com/Nick-Sullivan]],

  [#fa-globe() #link("https://nickdavesullivan.com")[nickdavesullivan.com]],
  [#fa-linkedin() #link("https://linkedin.com/in/nick-dave-sullivan")[linkedin.com/in/nick-dave-sullivan]],
)

// ─── About Me ────────────────────────────────────────────────────────────────

#section("About Me")

Senior Software Engineer (Ph.D.), specialising in scaling small companies through
fit-for-purpose solutions that balance long-term growth with immediate business
needs. Experienced in solution design, back-end development (Python/C\#), cloud
infrastructure (AWS), front-end technologies (React) and algorithm design.
Recognised for an open-minded, honest, and candid approach to problem solving.
Learn more about me on my #link("https://nickdavesullivan.com")[website].

// ─── Employment ──────────────────────────────────────────────────────────────

#section("Employment")

#entry("2025-now")[
  *Senior Software Engineer*\
  #org(
    "Skutopia",
    "https://skutopia.com",
    description: "A scaleup decarbonising and democratising logistics",
  )
  - Building software for robotic systems that automate fulfilment.
  - Just started, watch this space!
  - Typescript, event-sourcing, Pulumi, Google Cloud
]

#entry("2024-2025")[
  *Senior Software Engineer*\
  #org(
    "Bactobio",
    "https://bactobio.com",
    description: "A London BioTech startup discovering new chemical compounds to fight disease",
  )
  - Collaborated with bioinformaticians and scientists to discover requirements,
    design solutions, and enhance research using automation and data visualisation.
  - Developed web application pages for scientists to upload, view, and edit
    research data, with queue based autoscaling for on-demand research analysis
    (e.g., mass spectroscopy).
  - Modelled complex biological and chemical domains, ensuring support for both
    new and legacy data and processes.
  - Kubernetes, Python, Oracle, SQLAlchemy, React, Typescript, Playwright
]

#entry("2021-2024")[
  *Senior Software Engineer*\
  #org("Tiimely", "https://tiimely.com", description: "A FinTech scale-up automating responsible lending")
  - Mentored software and quality assurance engineers in clean code principles
    and best practices through code reviews, pair programming, and technical
    whitepapers.
  - Navigated immediate business needs while driving strategic migration from
    legacy software to scaleable, configurable APIs.
  - Architected technical solutions and led an engineering team throughout key
    projects, such as scaling loan servicing APIs to achieve 60% reduction in
    server costs, 40% reduction in cyclometric complexity, and 90% reduction in
    development time.
  - C\#, AWS, MSSQL, React, Typescript, Playwright, Terraform
]

#entry("2019-2021")[
  *Software Engineer / Team Lead*\
  #org(
    "MaxMine",
    "https://maxmine.com",
    description: "A MiningTech scale-up reducing greenhouse gas emissions with automated analysis",
  )
  - Promoted to Technical lead after two years, recruiting, managing and
    mentoring a team of five engineers.
  - Designed and implemented an Analytics Data Store that reduced ad-hoc
    analysis time from hours to seconds, enabling faster decision making.
  - Developed algorithms for haul route optimisation, operator performance
    gamification, and material tracking, leading to client improvements such as
    75% decrease in tyre spend, 16% reduction in truck queuing, and compliance
    with safe driving practices.
  - Reverse engineered communication protocols used by Komatsu and Hitachi to
    discover new data sources, unlocking load unit orientation capabilities and
    improving material tracking quality.
  - Introduced data testing frameworks, processes, and dashboards, significantly
    improving data quality and client confidence.
  - Python, AWS, Terraform, Matlab, dbt, Snowflake, pandas
]

#pagebreak()
#section("Employment (continued)")

#entry("2016-2019")[
  *Software Engineer*\
  #org("The University of Adelaide", "https://adelaide.edu.au")
  - Enhanced the Australian Olympic track cycling team's pacing through an
    automated laser guided pacing system.
  - Developed autonomous capabilities of small sensor-laden vehicles used in
    defence research.
  - Tutored fourth year engineering courses: Advanced PID Control and Advanced
    Digital Control.
  - Python, C++, ROS, Matlab
]

// ─── Education ───────────────────────────────────────────────────────────────

#section("Education")

#entry("2016-2019")[
  *Ph.D. in Robotics*\
  #org("The University of Adelaide", "https://adelaide.edu.au")
  Researched novel methods for task allocation and collaborative localisation in
  ground vehicles, designing algorithms to optimise objective completion while
  maintaining line-of-sight constraints.
  - Presented research at ACRA 2017, ACRA 2018, and ICARCV 2018, as well as to
    Australia's Minister for Defence Industry and Chief Defence Scientist.
  - Published four journal papers to top quartile journals.
]

#entry("2010-2015")[
  *B.Eng. in Mechatronics and Comp Sci (Hons)*\
  #org("The University of Adelaide", "https://adelaide.edu.au")
  - 6.5/7 GPA.
]

// ─── Certifications ──────────────────────────────────────────────────────────

#section("Certifications")

#entry("2021")[
  *AWS Certified Solutions Architect - Associate*
]

// ─── Publications ────────────────────────────────────────────────────────────

#section("Publications")

#[
  #set par(spacing: 1.2em)

  N. Sullivan, *Task Allocation and Collaborative Localisation in Multi-Robot Systems*, _Ph.D Thesis_, 2019

  N. Sullivan, S. Grainger, B. Cazzolato, *Analysis of cooperative localisation performance under varying sensor qualities and communication rates*, _Journal of Robotics and Autonomous Systems_, 2018

  N. Sullivan, S. Grainger, B. Cazzolato, *Sequential Single-Item Auction Improvements for Heterogeneous Multi-Robot Routing*, _Journal of Robotics and Autonomous Systems_, 2019

  N. Sullivan, S. Grainger, B. Cazzolato, *A dual genetic algorithm for multi-robot routing with network connectivity and energy efficiency*, _International Conference on Control, Automation, Robotics and Vision (ICARCV 2018)_

  N. Sullivan, S. Grainger, B. Cazzolato, *Algorithms for Multi-Robot Routing with Adaptive Heterogeneity*, _Journal of Heuristics_, 2018

  N. Sullivan, S. Grainger, B. Cazzolato, *Formation-based multi-robot routing with inter-robot distance constraints*, _European Journal of Operational Research_, 2018

  N. Sullivan, G. Pearce, S. Grainger, B. Cazzolato, *An outdoor multi-vehicle platform for collaborative localisation research*, _Australasian Conference on Robotics and Automation (ACRA 2018)_

  N. Sullivan, S. Grainger, B. Cazzolato, *Robot heterogeneous multi-robot routing for low-intelligence agents*, _Australasian Conference on Robotics and Automation (ACRA 2017)_

]

// ─── Hobbies ─────────────────────────────────────────────────────────────────

#section("Hobbies")

Basketball, travelling, wine tasting, and coding recreationally. Some notable
projects include a smartphone app that overlays QR codes on GIFs, a realtime
multiplayer dice game, and an autonomous ground vehicle. See my
#link("https://nickdavesullivan.com")[website] for more information.\
Hobbyist-level technical skills: Flutter, Rust, AstroJS, Godot, Raspberry Pi, Web scraping
