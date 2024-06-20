const nodemailer = require('nodemailer');

function generateTableRows(services) {
  let rows = '';

  Object.keys(services).forEach(serviceName => {
    services[serviceName].forEach(service => {
      const healthClass = service.healthStatus.toLowerCase();
      rows += `
        <tr class="${healthClass}">
          <td>${service.id}</td>
          <td>${service.name}</td>
          <td><a href="${service.url}" target="_blank">${service.url}</a></td>
          <td>${service.environment.name}</td>
          <td>${service.healthStatus}</td>
        </tr>
      `;
    });
  });

  return rows;
}

function generateHtmlReport(services) {
  const tableRows = generateTableRows(services);
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
            }
            .green {
                background-color: #d4edda;
            }
            .yellow {
                background-color: #fff3cd;
            }
            .red {
                background-color: #f8d7da;
            }
        </style>
        <title>Service Health Report</title>
    </head>
    <body>
        <h2>Service Health Report</h2>
        <table>
            <thead>
                <tr>
                    <th>Service ID</th>
                    <th>Service Name</th>
                    <th>Service URL</th>
                    <th>Environment Name</th>
                    <th>Health Status</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    </body>
    </html>
  `;
}


async function sendReportEmailByName(services,name) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  for (const serviceName in services) {
    if (serviceName === name) {
    if (services.hasOwnProperty(serviceName)) {
      const stakeholdersSet = new Set();
      services[serviceName].forEach(service => {
        const stakeholders = service.stakeholders.split(',');
        stakeholders.forEach(email => stakeholdersSet.add(email.trim()));
      });

      const recipients = Array.from(stakeholdersSet).join(',');

      const htmlContent = generateHtmlReport({ [serviceName]: services[serviceName] });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients,
        subject: `Service Health Report for ${serviceName}`,
        html: htmlContent
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipients} for ${serviceName}`);
      } catch (error) {
        console.error(`Error sending email for ${serviceName}:`, error);
      }
    }
  }
  }
}

async function sendReportEmail(services) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  for (const serviceName in services) {
    if (services.hasOwnProperty(serviceName)) {
      const stakeholdersSet = new Set();
      services[serviceName].forEach(service => {
        const stakeholders = service.stakeholders.split(',');
        stakeholders.forEach(email => stakeholdersSet.add(email.trim()));
      });

      const recipients = Array.from(stakeholdersSet).join(',');

      const htmlContent = generateHtmlReport({ [serviceName]: services[serviceName] });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients,
        subject: `Service Health Report for ${serviceName}`,
        html: htmlContent
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipients} for ${serviceName}`);
      } catch (error) {
        console.error(`Error sending email for ${serviceName}:`, error);
      }
    }
  }
}

module.exports = { sendReportEmail , sendReportEmailByName };
