export function getStoreData(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('StoryLabDB', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('store');
    };
    request.onsuccess = () => {
      const db = request.result;
      // In case the store wasn't created (e.g. version issue)
      if (!db.objectStoreNames.contains('store')) {
         db.close();
         indexedDB.deleteDatabase('StoryLabDB');
         return resolve(null);
      }
      const tx = db.transaction('store', 'readonly');
      const getReq = tx.objectStore('store').get(key);
      getReq.onsuccess = () => resolve(getReq.result);
      getReq.onerror = () => reject(getReq.error);
      tx.oncomplete = () => db.close();
    };
    request.onerror = () => reject(request.error);
  });
}

export function setStoreData(key, data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('StoryLabDB', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('store');
    };
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('store')) {
         db.close();
         indexedDB.deleteDatabase('StoryLabDB');
         return reject(new Error('Store missing'));
      }
      const tx = db.transaction('store', 'readwrite');
      const putReq = tx.objectStore('store').put(data, key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}
