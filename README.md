<img src="public/assets/echoSphereLogo.webp" width="300" height="300">

# Echosphere

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub issues](https://img.shields.io/github/issues/Edd-wordd/Echosphere)
![GitHub stars](https://img.shields.io/github/stars/Edd-wordd/Echosphere?style=social)
![GitHub forks](https://img.shields.io/github/forks/Edd-wordd/Echosphere?style=social)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Edd-wordd/Echosphere/CI_NAME)

Echosphere aims to simplify your digital life by providing a customizable platform where you can add widgets or sections based on your daily needs or personal preferences. Create a space that feels personal and responsive to you.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **To-Do List**: Keep track of your daily tasks with ease.
- **Weather Section**: Stay updated with the latest weather forecasts.
- **Customizable Widgets**: Tailor your digital space to fit your needs with a variety of widgets.
- More features coming soon!

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- npm

```sh
npm install npm@latest -g
```

### Installation

1. Clone the repo

```sh
git clone https://github.com/Edd-wordd/Echosphere.git
```

2. Install NPM packages

```sh
npm install
```

3. Set up your Firebase configuration in `firebase-config.js` with your credentials.
4. Run the application

```sh
npm start
```

---

## Docker Setup

Echosphere can also be run using Docker, which simplifies the setup process and ensures consistency across different environments. This guide assumes you have Docker and Docker Compose installed on your system.

### Building and Running with Docker Compose

1. **Build the Docker Image**:

   Navigate to the root of the project directory where the `docker-compose.yml` file is located and run:

   ```sh
   docker-compose build
   ```

   This command builds the Docker image for Echosphere, installing all required dependencies in the process.

2. **Start the Application**:

   Once the build is complete, you can start the application using:

   ```sh
   docker-compose up
   ```

   This command starts the application and makes it accessible at `http://localhost:3000`.

3. **Stopping the Application**:

   To stop the application, you can use the following command in the terminal:

   ```sh
   docker-compose down
   ```

   This will stop and remove the containers created by `docker-compose up`.

### Docker Commands Breakdown

- `docker-compose build`: Builds or rebuilds services specified in the `docker-compose.yml` file.
- `docker-compose up`: Builds, (re)creates, starts, and attaches to containers for a service. If the application code has been changed, you may need to rebuild the image using `docker-compose build`.
- `docker-compose down`: Stops and removes the containers and network, ensuring a clean state.

### Notes

- The first time you run the application using Docker, it may take a few minutes to build the image.
- Make sure no other services are running on port 3000 on your machine to avoid port conflicts.
- Hot reloading is enabled for development purposes, allowing you to see changes in real-time without restarting the Docker container.

---

## Usage

Use Echosphere to make your digital life more organized and personalized. Add or remove widgets as you see fit, and enjoy a custom digital space that truly belongs to you.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Modern-edd - [@modern_edd](https://twitter.com/modern_edd)

Project Link: [https://github.com/Edd-wordd/Echosphere](https://github.com/Edd-wordd/Echosphere)

```

```
