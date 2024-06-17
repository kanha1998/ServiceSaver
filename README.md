# ServiceSaver Health Monitoring System

### Overview

ServiceSaver is a health monitoring system designed to keep track of the status of various microservices. It performs regular health checks, sends alerts when services are down, and allows stakeholders to acknowledge issues via email. The system also generates periodic health reports.

### Features

- **Health Checks**: Regularly checks the health of registered microservices.
- **Alerts**: Sends email alerts to stakeholders when a service is down.
- **Email Acknowledgement**: Allows stakeholders to acknowledge alerts by replying to emails.
- **Health Reports**: Sends periodic health reports via email.
- **Email Polling**: Polls for email replies to update the status of alerts.

### Prerequisites

- Node.js
- MySQL Database
- Gmail account for sending emails

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/debasish.mahana/ServiceSaver.git
    cd ServiceSaver
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the `.env` file in the root directory with the following variables:
    ```env
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-email-password
    DB_HOST=localhost
    DB_USER=your-db-user
    DB_PASS=your-db-password
    DB_NAME=ServiceSaverDB
    ```

4. Create the MySQL database and tables:

    ```sql
    CREATE DATABASE ServiceSaverDB;

    USE ServiceSaverDB;

    CREATE TABLE services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      url VARCHAR(255) NOT NULL,
      lastAlert DATETIME DEFAULT NULL,
      alertCount INT DEFAULT 0,
      isAcknowledged BOOLEAN DEFAULT FALSE,
      assignedTo VARCHAR(255) DEFAULT NULL,
      stakeholders TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (name)
    );

    CREATE TABLE alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      serviceId INT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      status ENUM('triggered', 'acknowledged') DEFAULT 'triggered',
      acknowledgedBy VARCHAR(255),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (serviceId) REFERENCES services(id),
      INDEX (serviceId)
    );
    ```

5. Insert some dummy data into the `services` table:
    ```sql
    INSERT INTO services (name, url, stakeholders) VALUES
    ('Service 1', 'http://service1.example.com/health', '["stakeholder1@example.com", "stakeholder2@example.com"]'),
    ('Service 2', 'http://service2.example.com/health', '["stakeholder3@example.com", "stakeholder4@example.com"]');
    ```

### Usage

1. Start the application:
    ```sh
    npm start
    ```

2. The application will:
    - Perform health checks on the registered services every 20 seconds.
    - Send health reports every 6 hours.
    - Poll for email replies every 15 seconds.

### Directory Structure

ServiceSaver/
├── src/
│ ├── index.js
│ ├── models/
│ │ ├── alertModel.js
│ │ └── serviceModel.js
│ ├── services/
│ │ ├── alertService.js
│ │ ├── emailPollingService.js
│ │ ├── emailService.js
│ │ ├── healthService.js
│ └── utils/
│ └── database.js
├── .env
├── package.json
└── README.md


### Code Explanation

#### index.js

The entry point of the application. It connects to the database and starts the scheduled tasks.

#### models/serviceModel.js

Defines the Service model using Sequelize for MySQL.

#### models/alertModel.js

Defines the Alert model using Sequelize for MySQL.

#### services/alertService.js

Contains logic to send alerts.

#### services/emailPollingService.js

Handles email polling to check for replies and update service statuses.

#### services/emailService.js

Handles sending emails and processing email replies.

#### services/healthService.js

Contains the logic for performing health checks and scheduling tasks.

#### utils/database.js

Configures and connects to the MySQL database using Sequelize.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### License

This project is licensed under POC.
