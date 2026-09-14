import { db, collection, getDocs, query, orderBy } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const newsFeed = document.getElementById('news-feed');
    
    try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            newsFeed.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No news articles published yet. Check back soon!</p>';
            return;
        }
        
        newsFeed.innerHTML = ''; // clear loading text
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Format content to grab a snippet
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.content;
            const snippet = tempDiv.textContent.substring(0, 150) + '...';
            
            // Generate icon based on category
            let iconClass = 'fa-newspaper';
            if (data.category.includes('Visa')) iconClass = 'fa-passport';
            if (data.category.includes('Study')) iconClass = 'fa-book-open-reader';
            if (data.category.includes('Travel')) iconClass = 'fa-plane-departure';
            if (data.category.includes('Recruitment')) iconClass = 'fa-briefcase';
            
            // Image handling
            let imageHtml = '';
            if (data.imageUrl) {
                imageHtml = `<img src="${data.imageUrl}" alt="${data.title}" style="width: 100%; height: 200px; object-fit: cover; border-bottom: 1px solid #eee;">`;
            } else {
                imageHtml = `
                    <div style="height: 200px; background-color: var(--primary-color); display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #eee;">
                        <i class="fa-solid ${iconClass} fa-4x" style="color: var(--accent-color);"></i>
                    </div>
                `;
            }

            const articleHtml = `
                <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
                    ${imageHtml}
                    <div style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
                        <span class="badge" style="margin-bottom: 1rem; align-self: flex-start;">${data.category}</span>
                        <h3 style="font-size: 1.3rem; margin-bottom: 1rem;">${data.title}</h3>
                        <p style="color: var(--text-light); margin-bottom: 1.5rem; flex-grow: 1;">${snippet}</p>
                        <a href="#" class="read-more-btn" data-id="${doc.id}" style="font-weight: 600; color: var(--accent-color);">Read More <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            
            newsFeed.innerHTML += articleHtml;
        });
        
        // Modal logic could be added here for "Read More"
        // For now, it just alerts or expands
        document.querySelectorAll('.read-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Full article reading page coming soon! ID: ' + e.currentTarget.getAttribute('data-id'));
            });
        });
        
    } catch (error) {
        console.error("Error fetching news:", error);
        newsFeed.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Failed to load news articles. Please try again later.</p>';
    }
});
