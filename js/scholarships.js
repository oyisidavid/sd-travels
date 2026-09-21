import { db, collection, getDocs, query, orderBy } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const feed = document.getElementById('scholarships-feed');
    
    try {
        const q = query(collection(db, "scholarships"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            feed.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No scholarships available right now. Check back soon!</p>';
            return;
        }
        
        feed.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Format deadline
            const deadlineText = data.deadline ? `<div style="color:var(--danger-color); font-weight:600; margin-bottom:1rem;"><i class="fa-regular fa-clock"></i> Deadline: ${data.deadline}</div>` : '';
            
            let imageHtml = '';
            if (data.imageUrl) {
                imageHtml = `<img src="${data.imageUrl}" alt="${data.title}" style="width: 100%; height: 200px; object-fit: cover; border-bottom: 1px solid #eee;">`;
            } else {
                imageHtml = `
                    <div style="height: 200px; background-color: var(--primary-color); display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #eee;">
                        <i class="fa-solid fa-graduation-cap fa-4x" style="color: var(--accent-color);"></i>
                    </div>
                `;
            }

            const articleHtml = `
                <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
                    ${imageHtml}
                    <div style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
                        <span class="badge" style="margin-bottom: 1rem; align-self: flex-start; background-color: #f0f7ff; color: var(--primary-color);">${data.category}</span>
                        <h3 style="font-size: 1.3rem; margin-bottom: 1rem;">${data.title}</h3>
                        ${deadlineText}
                        <p style="color: var(--text-light); margin-bottom: 1.5rem; flex-grow: 1; font-size: 0.9rem;">
                            <strong>Eligibility:</strong> ${data.eligibility.substring(0, 80)}...
                        </p>
                        <a href="scholarship-details.html?id=${doc.id}" class="read-more-btn" style="font-weight: 600; color: var(--accent-color);">View Details & Apply <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            
            feed.innerHTML += articleHtml;
        });
        
    } catch (error) {
        console.error("Error fetching scholarships:", error);
        feed.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Failed to load scholarships. Please try again later.</p>';
    }
});
