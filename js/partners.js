import { db, collection, getDocs, query, orderBy } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const partnersTrack = document.getElementById('partners-track');
    
    if(!partnersTrack) return;

    try {
        const q = query(collection(db, "partners"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            partnersTrack.innerHTML = '<p style="color:var(--text-light);">Our premium partners will be listed here soon.</p>';
            partnersTrack.style.animation = 'none';
            return;
        }
        
        let html = '';
        
        // Build the partner items
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="partner-item" style="display: inline-flex; align-items: center; justify-content: center; padding: 0 2rem;">
                    <img src="${data.imageUrl}" alt="${data.name}" style="height: 60px; object-fit: contain; filter: grayscale(100%); transition: all 0.3s ease; opacity: 0.7;">
                </div>
            `;
        });
        
        // Duplicate the items for the infinite scrolling marquee effect
        partnersTrack.innerHTML = html + html + html;
        
        // Add hover effect
        document.querySelectorAll('.partner-item img').forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.filter = 'grayscale(0%)';
                img.style.opacity = '1';
                partnersTrack.style.animationPlayState = 'paused';
            });
            img.addEventListener('mouseleave', () => {
                img.style.filter = 'grayscale(100%)';
                img.style.opacity = '0.7';
                partnersTrack.style.animationPlayState = 'running';
            });
        });

    } catch (error) {
        console.error("Error fetching partners:", error);
        partnersTrack.innerHTML = '<p style="color:red;">Error loading partners.</p>';
        partnersTrack.style.animation = 'none';
    }
});
