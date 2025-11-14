export const storageService = {
    async get(key) {
      try {
        const result = await window.storage.get(key);
        return result ? JSON.parse(result.value) : null;
      } catch (err) {
        console.error('Storage get error:', err);
        return null;
      }
    },
  
    async set(key, value) {
      try {
        await window.storage.set(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.error('Storage set error:', err);
        return false;
      }
    },
  
    async delete(key) {
      try {
        await window.storage.delete(key);
        return true;
      } catch (err) {
        console.error('Storage delete error:', err);
        return false;
      }
    }
  };