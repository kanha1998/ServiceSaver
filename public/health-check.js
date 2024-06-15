const servers = [
    { name: 'Server 1', url: 'https://likeastore.com' },
    { name: 'Server 2', url: 'https://stage.likeastore.com' },
  ];
  

 
  

 

  const serversContainer = document.getElementById('servers');
  
  function createServerElement(server) {
    const serverElement = document.createElement('div');
    serverElement.className = 'server';
    
    const nameElement = document.createElement('span');
    nameElement.textContent = server.name;
    
    const statusElement = document.createElement('span');
    statusElement.className = 'status';
    statusElement.textContent = 'Checking...';
    statusElement.id = `status-${server.name}`;
    
    serverElement.appendChild(nameElement);
    serverElement.appendChild(statusElement);
    
    return serverElement;
  }
  
  function updateServerStatus(server, isHealthy) {
    const statusElement = document.getElementById(`status-${server.name}`);
    if (isHealthy) {
      statusElement.textContent = 'Healthy';
      statusElement.classList.add('healthy');
      statusElement.classList.remove('unhealthy');
    } else {
      statusElement.textContent = 'Unhealthy';
      statusElement.classList.add('unhealthy');
      statusElement.classList.remove('healthy');
    }
  }
  
  function checkServerHealth(server) {
    fetch(server.url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Server not healthy');
        }
      })
      .then(data => {
        if (data.status === 'ok') {
          updateServerStatus(server, true);
        } else {
          updateServerStatus(server, false);
        }
      })
      .catch(error => {
        updateServerStatus(server, false);
      });
  }
  
  // Initial setup: Create elements for each server
  servers.forEach(server => {
    const serverElement = createServerElement(server);
    serversContainer.appendChild(serverElement);
    checkServerHealth(server); // Initial check
  });
  
  // Check server health every 5 seconds
  setInterval(() => {
    servers.forEach(server => {
      checkServerHealth(server);
    });
  }, 5000);
  