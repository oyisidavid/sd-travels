import { db, collection, getDocs, query, orderBy } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const testFeed = document.getElementById('testimonials-feed');
    
    if(!testFeed) return;
    
    try {
        const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            testFeed.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-light);">No testimonials yet.</p>';
            return;
        }
        
        let htmlStr = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            htmlStr += `
                <div class="card" style="padding: 2rem;">
                    <div style="color: var(--accent-color); margin-bottom: 1rem; font-size: 1.1rem;">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                    </div>
                    <p style="font-style: italic; margin-bottom: 1.5rem; font-size: 1.05rem; color: var(--text-charcoal); line-height: 1.7;">"${data.content}"</p>
                    <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="font-weight: 700; color: var(--primary-color);">${data.name}</div>
                            <div style="color: var(--text-light); font-size: 0.9rem;">${data.location}</div>
                        </div>
                        <i class="fa-solid fa-quote-right" style="color: var(--accent-color); opacity: 0.5; font-size: 1.5rem;"></i>
                    </div>
                </div>
            `;
        });
        
        // For the infinite marquee effect, we must duplicate the exact set of children
        // The CSS animation moves -50%, so the second half seamlessly loops in.
        testFeed.innerHTML = htmlStr + htmlStr;
        
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        testFeed.innerHTML = '<p style="text-align: center; color: red;">Failed to load testimonials.</p>';
    }
});
