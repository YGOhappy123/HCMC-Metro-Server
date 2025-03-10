# HCMC Metro - Server

This is the Server (Api) portion of our final project of the E-Commerce System Development course. Built with Express JS, Typescript, MySQL and Sequelize.

## Table of Contents

-   [Technologies Used](#technologies-used)
-   [Required Dependencies](#required-dependencies)
-   [Installation](#installation)
-   [Before You Run](#before-you-run)
-   [Development](#development)
-   [Connect other devices to this server](#connect-other-devices-to-this-server)
-   [Features](#features)
-   [Suggested VS Code Extensions](#suggested-vs-code-extensions)
-   [Contributors](#contributors)

## Technologies Used

-   [React](https://reactjs.org/)
-   [Express JS](https://expressjs.com/)
-   [MySQL](https://www.mysql.com/)
-   [Sequelize](https://sequelize.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Axios](https://axios-http.com/)
-   [Day JS](https://day.js.org/)

## Required Dependencies

-   `Node.js` v20.17 or later: [Download Node.js](https://nodejs.org/en)
-   `MySQL`
-   `TypeScript`

Make sure to have these installed before proceeding with the project setup.

**Note:** If you encounter any issues installing the `MySQL`, consider running it through `XAMPP` or `Docker`.

## Installation

Follow these steps to set up and run the application locally.

1. Clone the repository:

    ```bash
    git clone https://github.com/YGOhappy123/HCMC-Metro-Server.git
    ```

2. Navigate to the project directory:

    ```bash
    cd HCMC-Metro-Server
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

# Before You Run

Before running the project, make sure to set up the environment variables:

1. Create a `.env` file:

    In the root directory of your project (at the same level as `.env.example`), create a `.env` file.

2. Populate the environment variables:

    Copy the variables from `.env.example` into `.env` and replace the placeholder values with your actual configuration.

3. For collaborators:

    If you are a collaborator on this project, please contact the project owner to obtain the values for the environment variables.

4. Apply the migrations to create the necessary database tables. Use the following command in the terminal:

    ```bash
    npm run migrations
    ```

    This command will apply the existing migrations to the specified database, ensuring that the required tables are created.

    **Note:** You have to have the database created on your MySQL server before making any connections or migrations with sequelize.

## Development

To start the development server, use:

```bash
npm run dev
```

**Note:** You must have your MySQL server running before starting the development server. As the app will try to connect to MySQL server upon running.

This will start the Express development server.

You can access the app by visiting `http://localhost:5000/api/v1` in your browser.

You can also replace `localhost` with your device's `IPv4 Address`, which can be found by entering the following command in the `terminal` and look for `Wireless LAN adapter Wi-Fi` > `IPv4 Address`:

```bash
ipconfig
```

## Connect Other Devices To This Server

**Requirement:** All devices must be connected to the same network.

Follow these steps to ensure that your firewall allows incoming connections on port 5000.

1. Open `Windows Defender Firewall`.
2. Click on `Advanced settings`.
3. Select `Inbound Rules` and then `New Rule`.
4. Choose `Port`, click `Next`.
5. Select `TCP` and enter `5000` in the specific local ports box.
6. Allow the connection and complete the wizard.

Now you can access the app using other devices by visiting `http://<IPv4 Adddess>:5000/api/v1`

## Features

-   **RESTful API** 🛠 Exposes endpoints following REST principles for ease of use and scalability.
-   **Database Integration** 💾 Uses MySQL with Sequelize for data persistence.
-   **Authentication and Authorization** 🔑 Secure your API with JWT-based authentication.
-   **Cross-Platform** 🌐 Runs on any operating system that supports Javascript
-   **Migrations** 🔄 Easily handle database schema changes using Sequelize migrations.

## Suggested VS Code Extensions

| Extension                     | Publisher            | Required? | Supported features                                                |
| :---------------------------- | :------------------- | :-------: | :---------------------------------------------------------------- |
| Prettier - Code formatter     | Prettier             |    Yes    | Code formatting                                                   |
| Code Spell Checker            | Street Side Software |    No     | Spelling checker for source code                                  |
| Multiple cursor case preserve | Cardinal90           |    No     | Preserves case when editing with multiple cursors                 |
| TPretty TypeScript Errors     | yoavbls              |    No     | Make TypeScript errors prettier and more human-readable in VSCode |

## Contributors

Thanks to the following people for contributing to this project ✨:

<table>
    <tr>
        <td align="center">
            <a href="https://github.com/YGOhappy123">
                <img 
                    src="https://avatars.githubusercontent.com/u/90592072?v=4"
                    alt="YGOhappy123" width="100px;" height="100px;" 
                    style="border-radius: 4px; background: #fff;"
                /><br />
                <sub><b>YGOhappy123</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/KQii">
                <img 
                    src="https://avatars.githubusercontent.com/u/127427121?v=4"
                    alt="KQii" width="100px;" height="100px;" 
                    style="border-radius: 4px; background: #fff;"
                /><br />
                <sub><b>KQii</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/NgocYenDg">
                <img 
                    src="https://avatars.githubusercontent.com/u/163749076?v=4"
                    alt="NgocYenDg" width="100px;" height="100px;" 
                    style="border-radius: 4px; background: #fff;"
                /><br />
                <sub><b>NgocYenDg</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/tienanh443">
                <img 
                    src="https://avatars.githubusercontent.com/u/125814106?v=4"
                    alt="tienanh443" width="100px;" height="100px;" 
                    style="border-radius: 4px; background: #fff;"
                /><br />
                <sub><b>tienanh443</b></sub>
            </a>
        </td>
    </tr>
</table>
