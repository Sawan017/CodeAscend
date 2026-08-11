# Strict 82-Skill Curriculum Audit

## 1. Skill Audit Table

| Skill ID | Skill Name | Current Primary | Proposed Primary | Current Secondary | Proposed Secondary | Justification |
|---|---|---|---|---|---|---|
| `git` | Git | `devops-cloud` | `devops-cloud` | `[]` | `[]` | Version control is fundamentally taught as part of DevOps/Cloud pipelines and versioning methodologies. |
| `svn` | SVN | `devops-cloud` | `devops-cloud` | `[]` | `[]` | Legacy version control, taught in DevOps. |
| `python` | Python | `programming-languages` | `programming-languages` | `ai-ml, data-science` | `ai-ml, data-science` | General purpose language. Natively taught as the foundational core in AI/ML and Data Science curriculums. |
| `javascript` | JavaScript | `programming-languages` | `programming-languages` | `frontend` | `frontend` | General purpose language. Natively taught as the foundational core of frontend curriculum. |
| `typescript` | TypeScript | `programming-languages` | `programming-languages` | `frontend` | `frontend` | Superset of JS, natively taught in modern frontend curriculum. |
| `java` | Java | `programming-languages` | `programming-languages` | `backend` | `[]` | General purpose language. |
| `cpp` | C++ | `programming-languages` | `programming-languages` | `computer-science, game-development, embedded-iot` | `computer-science, game-development, embedded-iot` | General purpose. Taught natively in CS for memory management, and is the core language taught in Game Dev and Embedded. |
| `c` | C | `computer-science` | `computer-science` | `programming-languages, embedded-iot` | `programming-languages, embedded-iot` | Foundational CS language for OS/memory. Also the core of Embedded curriculum. |
| `csharp` | C# | `programming-languages` | `programming-languages` | `backend, game-development` | `game-development` | General purpose. Taught natively as the scripting language in Unity/Game Dev. |
| `go` | Go | `programming-languages` | `programming-languages` | `devops-cloud` | `[]` | General purpose language. |
| `rust` | Rust | `programming-languages` | `programming-languages` | `computer-science` | `computer-science` | Systems programming language, fundamentally taught in modern CS memory safety. |
| `ruby` | Ruby | `programming-languages` | `programming-languages` | `backend` | `[]` | General purpose language. |
| `php` | PHP | `programming-languages` | `programming-languages` | `backend` | `[]` | General purpose language. |
| `swift` | Swift | `mobile-development` | `mobile-development` | `[]` | `[]` | Natively taught as the core iOS mobile language. |
| `kotlin` | Kotlin | `mobile-development` | `mobile-development` | `backend` | `[]` | Natively taught as the core Android mobile language. |
| `html` | HTML | `frontend` | `frontend` | `[]` | `[]` | Core frontend markup. |
| `css` | CSS | `frontend` | `frontend` | `[]` | `[]` | Core frontend styling. |
| `react` | React | `frontend` | `frontend` | `[]` | `[]` | Core frontend library. |
| `angular` | Angular | `frontend` | `frontend` | `[]` | `[]` | Core frontend framework. |
| `vue-js` | Vue.js | `frontend` | `frontend` | `[]` | `[]` | Core frontend framework. |
| `svelte` | Svelte | `frontend` | `frontend` | `[]` | `[]` | Core frontend compiler. |
| `tailwind-css` | Tailwind CSS | `frontend` | `frontend` | `[]` | `[]` | Core frontend utility. |
| `figma` | Figma | `ui-ux-design` | `ui-ux-design` | `frontend` | `[]` | Core UI/UX design tool. Not part of coding curriculum. |
| `node-js` | Node.js | `backend` | `backend` | `api-development` | `[]` | Core backend JS runtime. |
| `express-js` | Express.js | `backend` | `backend` | `api-development` | `[]` | Core backend framework. |
| `nestjs` | NestJS | `backend` | `backend` | `api-development` | `[]` | Core backend framework. |
| `django` | Django | `backend` | `backend` | `api-development` | `[]` | Core backend framework. |
| `flask` | Flask | `backend` | `backend` | `api-development` | `[]` | Core backend framework. |
| `spring-boot` | Spring Boot | `backend` | `backend` | `api-development` | `[]` | Core backend framework. |
| `graphql` | GraphQL | `api-development` | `api-development` | `frontend, backend` | `[]` | Fundamentally an API specification and querying language. |
| `rest-api` | REST API | `api-development` | `api-development` | `backend` | `[]` | Fundamentally an API architecture methodology. |
| `grpc` | gRPC | `api-development` | `api-development` | `backend` | `[]` | Fundamentally an RPC API framework. |
| `sql` | SQL | `databases` | `databases` | `backend, data-engineering, data-science` | `data-engineering, data-science` | Universal database language. Deeply taught in Data Eng and Data Sci curriculums for data manipulation. |
| `postgresql` | PostgreSQL | `databases` | `databases` | `backend, data-engineering` | `[]` | Relational database implementation. |
| `mysql` | MySQL | `databases` | `databases` | `backend` | `[]` | Relational database implementation. |
| `mongodb` | MongoDB | `databases` | `databases` | `backend` | `[]` | NoSQL database implementation. |
| `redis` | Redis | `databases` | `databases` | `backend` | `[]` | In-memory database implementation. |
| `elasticsearch` | Elasticsearch | `databases` | `databases` | `backend` | `[]` | Search database implementation. |
| `cassandra` | Cassandra | `databases` | `databases` | `data-engineering` | `data-engineering` | Wide-column store natively taught in big data engineering curriculums. |
| `apache-kafka` | Apache Kafka | `data-engineering` | `data-engineering` | `backend` | `[]` | Event streaming infrastructure. |
| `apache-spark` | Apache Spark | `data-engineering` | `data-engineering` | `data-science` | `data-science` | Big data processing, heavily taught in advanced Data Science. |
| `airflow` | Airflow | `data-engineering` | `data-engineering` | `[]` | `[]` | Data pipeline orchestration. |
| `docker` | Docker | `devops-cloud` | `devops-cloud` | `backend` | `[]` | Core DevOps containerization. |
| `kubernetes` | Kubernetes | `devops-cloud` | `devops-cloud` | `[]` | `[]` | Core DevOps orchestration. |
| `aws` | AWS | `devops-cloud` | `devops-cloud` | `[]` | `[]` | Cloud provider. |
| `google-cloud-platform` | Google Cloud Platform | `devops-cloud` | `devops-cloud` | `[]` | `[]` | Cloud provider. |
| `microsoft-azure` | Microsoft Azure | `devops-cloud` | `devops-cloud` | `[]` | `[]` | Cloud provider. |
| `terraform` | Terraform | `devops-cloud` | `devops-cloud` | `[]` | `[]` | Infrastructure as Code. |
| `ci-cd` | CI/CD | `devops-cloud` | `devops-cloud` | `[]` | `[]` | Core DevOps methodology. |
| `linux` | Linux | `computer-science` | `computer-science` | `devops-cloud` | `devops-cloud` | Core CS OS foundation. Also explicitly taught in DevOps curriculum. |
| `nginx` | Nginx | `devops-cloud` | `networking` | `networking` | `devops-cloud` | Web server/proxy taught in networking. Often taught in DevOps deployment. |
| `data-structures` | Data Structures | `dsa` | `dsa` | `computer-science` | `computer-science` | Core DSA. Taught as standard CS foundation. |
| `algorithms` | Algorithms | `dsa` | `dsa` | `computer-science` | `computer-science` | Core DSA. Taught as standard CS foundation. |
| `system-design` | System Design | `system-design` | `system-design` | `backend` | `[]` | System architecture discipline. |
| `design-patterns` | Design Patterns | `system-design` | `system-design` | `[]` | `[]` | Software architecture discipline. |
| `networking-fundamentals` | Networking Fundamentals | `networking` | `networking` | `computer-science` | `computer-science` | Networking discipline. Taught as standard CS foundation. |
| `operating-systems-fundamentals` | Operating Systems Fundamentals | `computer-science` | `computer-science` | `[]` | `[]` | Core CS foundation. |
| `cybersecurity-fundamentals` | Cybersecurity Fundamentals | `cybersecurity` | `cybersecurity` | `[]` | `[]` | Core cybersecurity foundation. |
| `owasp-top-10` | OWASP Top 10 | `cybersecurity` | `cybersecurity` | `frontend, backend` | `[]` | Cybersecurity standard. |
| `penetration-testing` | Penetration Testing | `cybersecurity` | `cybersecurity` | `[]` | `[]` | Cybersecurity discipline. |
| `machine-learning` | Machine Learning | `ai-ml` | `ai-ml` | `data-science` | `data-science` | AI discipline. Taught natively in Data Science curriculums. |
| `deep-learning` | Deep Learning | `ai-ml` | `ai-ml` | `[]` | `[]` | AI discipline. |
| `generative-ai` | Generative AI | `ai-ml` | `ai-ml` | `[]` | `[]` | AI discipline. |
| `tensorflow` | TensorFlow | `ai-ml` | `ai-ml` | `[]` | `[]` | AI library. |
| `pytorch` | PyTorch | `ai-ml` | `ai-ml` | `[]` | `[]` | AI library. |
| `pandas` | Pandas | `data-science` | `data-science` | `[]` | `[]` | Data science library. |
| `numpy` | NumPy | `data-science` | `data-science` | `ai-ml` | `ai-ml` | Data science math library, fundamentally taught in AI/ML curriculums for matrix ops. |
| `react-native` | React Native | `mobile-development` | `mobile-development` | `frontend` | `[]` | Mobile framework. |
| `flutter` | Flutter | `mobile-development` | `mobile-development` | `[]` | `[]` | Mobile framework. |
| `android-development` | Android Development | `mobile-development` | `mobile-development` | `[]` | `[]` | Mobile discipline. |
| `ios-development` | iOS Development | `mobile-development` | `mobile-development` | `[]` | `[]` | Mobile discipline. |
| `testing-fundamentals` | Testing Fundamentals | `testing-qa` | `testing-qa` | `frontend, backend` | `[]` | QA methodology. |
| `jest` | Jest | `testing-qa` | `testing-qa` | `frontend` | `[]` | QA testing framework. |
| `cypress` | Cypress | `testing-qa` | `testing-qa` | `frontend` | `[]` | QA testing framework. |
| `selenium` | Selenium | `testing-qa` | `testing-qa` | `backend` | `[]` | QA testing framework. |
| `blockchain-fundamentals` | Blockchain Fundamentals | `blockchain-web3` | `blockchain-web3` | `[]` | `[]` | Blockchain discipline. |
| `solidity` | Solidity | `blockchain-web3` | `blockchain-web3` | `[]` | `[]` | Blockchain language. |
| `game-development-fundamentals` | Game Development Fundamentals | `game-development` | `game-development` | `[]` | `[]` | Game dev discipline. |
| `unity` | Unity | `game-development` | `game-development` | `[]` | `[]` | Game engine. |
| `unreal-engine` | Unreal Engine | `game-development` | `game-development` | `[]` | `[]` | Game engine. |
| `embedded-systems-fundamentals` | Embedded Systems Fundamentals | `embedded-iot` | `embedded-iot` | `[]` | `[]` | Embedded discipline. |
| `arduino` | Arduino | `embedded-iot` | `embedded-iot` | `[]` | `[]` | Embedded platform. |
| `raspberry-pi` | Raspberry Pi | `embedded-iot` | `embedded-iot` | `[]` | `[]` | Embedded platform. |

## 2. Removed Secondary Relationships

- **`java`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `programming-languages`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`csharp`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `programming-languages`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`go`** removed from **`devops-cloud`**. Reason: Violates curriculum rule. The skill is fundamentally part of `programming-languages`. It is merely used by, consumed by, or associated with `devops-cloud`, but not taught as a core part of its curriculum.
- **`ruby`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `programming-languages`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`php`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `programming-languages`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`kotlin`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `mobile-development`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`figma`** removed from **`frontend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `ui-ux-design`. It is merely used by, consumed by, or associated with `frontend`, but not taught as a core part of its curriculum.
- **`node-js`** removed from **`api-development`**. Reason: Violates curriculum rule. The skill is fundamentally part of `backend`. It is merely used by, consumed by, or associated with `api-development`, but not taught as a core part of its curriculum.
- **`express-js`** removed from **`api-development`**. Reason: Violates curriculum rule. The skill is fundamentally part of `backend`. It is merely used by, consumed by, or associated with `api-development`, but not taught as a core part of its curriculum.
- **`nestjs`** removed from **`api-development`**. Reason: Violates curriculum rule. The skill is fundamentally part of `backend`. It is merely used by, consumed by, or associated with `api-development`, but not taught as a core part of its curriculum.
- **`django`** removed from **`api-development`**. Reason: Violates curriculum rule. The skill is fundamentally part of `backend`. It is merely used by, consumed by, or associated with `api-development`, but not taught as a core part of its curriculum.
- **`flask`** removed from **`api-development`**. Reason: Violates curriculum rule. The skill is fundamentally part of `backend`. It is merely used by, consumed by, or associated with `api-development`, but not taught as a core part of its curriculum.
- **`spring-boot`** removed from **`api-development`**. Reason: Violates curriculum rule. The skill is fundamentally part of `backend`. It is merely used by, consumed by, or associated with `api-development`, but not taught as a core part of its curriculum.
- **`graphql`** removed from **`frontend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `api-development`. It is merely used by, consumed by, or associated with `frontend`, but not taught as a core part of its curriculum.
- **`graphql`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `api-development`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`rest-api`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `api-development`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`grpc`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `api-development`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`sql`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `databases`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`postgresql`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `databases`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`postgresql`** removed from **`data-engineering`**. Reason: Violates curriculum rule. The skill is fundamentally part of `databases`. It is merely used by, consumed by, or associated with `data-engineering`, but not taught as a core part of its curriculum.
- **`mysql`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `databases`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`mongodb`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `databases`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`redis`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `databases`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`elasticsearch`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `databases`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`apache-kafka`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `data-engineering`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`docker`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `devops-cloud`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`nginx`** removed from **`networking`**. Reason: Violates curriculum rule. The skill is fundamentally part of `devops-cloud`. It is merely used by, consumed by, or associated with `networking`, but not taught as a core part of its curriculum.
- **`system-design`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `system-design`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`owasp-top-10`** removed from **`frontend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `cybersecurity`. It is merely used by, consumed by, or associated with `frontend`, but not taught as a core part of its curriculum.
- **`owasp-top-10`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `cybersecurity`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`react-native`** removed from **`frontend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `mobile-development`. It is merely used by, consumed by, or associated with `frontend`, but not taught as a core part of its curriculum.
- **`testing-fundamentals`** removed from **`frontend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `testing-qa`. It is merely used by, consumed by, or associated with `frontend`, but not taught as a core part of its curriculum.
- **`testing-fundamentals`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `testing-qa`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.
- **`jest`** removed from **`frontend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `testing-qa`. It is merely used by, consumed by, or associated with `frontend`, but not taught as a core part of its curriculum.
- **`cypress`** removed from **`frontend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `testing-qa`. It is merely used by, consumed by, or associated with `frontend`, but not taught as a core part of its curriculum.
- **`selenium`** removed from **`backend`**. Reason: Violates curriculum rule. The skill is fundamentally part of `testing-qa`. It is merely used by, consumed by, or associated with `backend`, but not taught as a core part of its curriculum.

## 3. Domain Summary Table

| Domain ID | Domain Name | Primary Skills | Secondary Skills | Total Associated Skills |
|---|---|---|---|---|
| `frontend` | Frontend Development | html, css, react, angular, vue-js, svelte, tailwind-css | javascript, typescript | 9 |
| `backend` | Backend Development | node-js, express-js, nestjs, django, flask, spring-boot | None | 6 |
| `devops-cloud` | DevOps / Cloud | git, svn, docker, kubernetes, aws, google-cloud-platform, microsoft-azure, terraform, ci-cd | linux, nginx | 11 |
| `cybersecurity` | Cybersecurity | cybersecurity-fundamentals, owasp-top-10, penetration-testing | None | 3 |
| `databases` | Databases | sql, postgresql, mysql, mongodb, redis, elasticsearch, cassandra | None | 7 |
| `computer-science` | Computer Science | c, linux, operating-systems-fundamentals | cpp, rust, data-structures, algorithms, networking-fundamentals | 8 |
| `dsa` | Data Structures & Algorithms | data-structures, algorithms | None | 2 |
| `ai-ml` | AI / Machine Learning | machine-learning, deep-learning, generative-ai, tensorflow, pytorch | python, numpy | 7 |
| `programming-languages` | Programming Languages | python, javascript, typescript, java, cpp, csharp, go, rust, ruby, php | c | 11 |
