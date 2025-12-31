(function(){"use strict";console.log("worker alive"),self.onmessage=async e=>{console.log("worker onmessage:",e.data),self.postMessage(`db.worker --> storage: ${e.data}`)}})();
