import { db, collection, getDocs, query, orderBy } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const eventsFeed = document.getElementById('events-feed');
    
    try {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            eventsFeed.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No events published yet. Check back soon!</p>';
            return;
        }
        
        eventsFeed.innerHTML = ''; // clear loading text
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = new Date(data.createdAt).toLocaleDateString();
            
            const eventHtml = `
                <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; border-radius: 12px; box-shadow: var(--shadow-md);">
                    <img src="${data.imageUrl}" alt="${data.title}" style="width: 100%; height: 250px; object-fit: cover; border-bottom: 1px solid #eee;">
                    <div style="padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1;">
                        <span style="color: var(--accent-color); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem;"><i class="fa-regular fa-calendar"></i> ${date}</span>
                        <h3 style="font-size: 1.3rem; margin-bottom: 1rem; font-family: 'Outfit', sans-serif;">${data.title}</h3>
                        <p style="color: var(--text-light); flex-grow: 1; line-height: 1.6;">${data.description}</p>
                    </div>
                </div>
            `;
            
            eventsFeed.innerHTML += eventHtml;
        });
        
    } catch (error) {
        console.error("Error fetching events:", error);
        eventsFeed.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Failed to load events. Please try again later.</p>';
    }
});
