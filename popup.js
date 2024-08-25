// Declare functions first
function toggleBackgroundControls() {
    const bgType = document.getElementById('bgType').value;
    document.getElementById('solidColorControl').style.display = bgType === 'solid' ? 'block' : 'none';
    document.getElementById('gradientControl').style.display = bgType === 'gradient' ? 'block' : 'none';
    document.getElementById('customGradientControl').style.display = 
      (bgType === 'gradient' && document.getElementById('gradientSelect').value === 'custom') ? 'block' : 'none';
    updateImage();
  }
  
  function updateImage() {
    const img = document.getElementById('capturedImage');
    const bgType = document.getElementById('bgType').value;
    const padding = document.getElementById('padding').value + 'px';
    
    if (bgType === 'solid') {
      const bgColor = document.getElementById('bgColor').value;
      img.style.background = bgColor;
    } else {
      const gradientType = document.getElementById('gradientSelect').value;
      let gradient;
      
      switch (gradientType) {
        case 'blue-purple':
          gradient = 'linear-gradient(to right, #4e54c8, #8f94fb)';
          break;
        case 'green-blue':
          gradient = 'linear-gradient(to right, #11998e, #38ef7d)';
          break;
        case 'orange-pink':
          gradient = 'linear-gradient(to right, #ff9966, #ff5e62)';
          break;
        case 'custom':
          const color1 = document.getElementById('gradientColor1').value;
          const color2 = document.getElementById('gradientColor2').value;
          gradient = `linear-gradient(to right, ${color1}, ${color2})`;
          break;
      }
      
      img.style.background = gradient;
    }
    
    img.style.padding = padding;
  }
  
  // Add event listeners after functions are declared
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
  
    document.getElementById('captureBtn').addEventListener('click', () => {
      console.log('Capture button clicked');
      chrome.runtime.sendMessage({action: "captureScreenshot"}, response => {
        console.log('Received response from background script:', response);
        if (response && response.imageDataUrl) {
          const img = document.getElementById('capturedImage');
          img.src = response.imageDataUrl;
          document.getElementById('editor').style.display = 'block';
          toggleBackgroundControls(); // Initialize controls
        } else {
          console.error('No image data received from background script');
        }
      });
    });
  
    document.getElementById('bgType').addEventListener('change', toggleBackgroundControls);
    document.getElementById('bgColor').addEventListener('input', updateImage);
    document.getElementById('gradientSelect').addEventListener('change', updateImage);
    document.getElementById('gradientColor1').addEventListener('input', updateImage);
    document.getElementById('gradientColor2').addEventListener('input', updateImage);
    document.getElementById('padding').addEventListener('input', updateImage);
  
    document.getElementById('gradientSelect').addEventListener('change', function() {
      document.getElementById('customGradientControl').style.display = 
        this.value === 'custom' ? 'block' : 'none';
      updateImage();
    });
  
    document.getElementById('saveBtn').addEventListener('click', () => {
      console.log('Save button clicked');
      const canvas = document.createElement('canvas');
      const img = document.getElementById('capturedImage');
      const padding = parseInt(document.getElementById('padding').value);
      
      // Set canvas size to match the actual image size plus padding
      canvas.width = img.naturalWidth + (padding * 2);
      canvas.height = img.naturalHeight + (padding * 2);
      
      const ctx = canvas.getContext('2d');
      
      const bgType = document.getElementById('bgType').value;
      if (bgType === 'solid') {
        ctx.fillStyle = document.getElementById('bgColor').value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const gradientType = document.getElementById('gradientSelect').value;
        let gradient;
        
        switch (gradientType) {
          case 'blue-purple':
            gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#4e54c8');
            gradient.addColorStop(1, '#8f94fb');
            break;
          case 'green-blue':
            gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#11998e');
            gradient.addColorStop(1, '#38ef7d');
            break;
          case 'orange-pink':
            gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#ff9966');
            gradient.addColorStop(1, '#ff5e62');
            break;
          case 'custom':
            gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, document.getElementById('gradientColor1').value);
            gradient.addColorStop(1, document.getElementById('gradientColor2').value);
            break;
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw the full image onto the canvas
      ctx.drawImage(img, padding, padding, img.naturalWidth, img.naturalHeight);
  
      const link = document.createElement('a');
      link.download = 'screenshot.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });