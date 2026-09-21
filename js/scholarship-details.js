import { db, doc, getDoc } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('sch-details-container');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        container.innerHTML = '<p style="text-align: center; color: red;">No scholarship ID provided.</p>';
        return;
    }

    try {
        const docRef = doc(db, "scholarships", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            container.innerHTML = '<p style="text-align: center; color: red;">Scholarship not found.</p>';
            return;
        }

        const data = docSnap.data();
        
        let imageHtml = '';
        if (data.imageUrl) {
            imageHtml = `<img src="${data.imageUrl}" alt="${data.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 2rem;">`;
        }
        
        // Share URLs
        const shareUrl = encodeURIComponent(window.location.href);
        const shareTitle = encodeURIComponent(`Check out this scholarship: ${data.title}`);
        
        const contentHtml = data.content ? `<div class="sch-section"><h3>Full Details</h3><div>${data.content}</div></div>` : '';
        const officialLinkHtml = data.link ? `<a href="${data.link}" target="_blank" class="apply-btn" style="background-color: transparent; border: 2px solid var(--primary-color); color: var(--primary-color);">Visit Official Website</a>` : '';

        // Format WhatsApp Enquiry Link
        let whatsappLink = '';
        if(data.whatsapp) {
            const cleanNumber = data.whatsapp.replace(/[^0-9]/g, '');
            whatsappLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent("Hello SD Travels, I am inquiring about the " + data.title + " scholarship.")}`;
        }

        container.innerHTML = `
            ${imageHtml}
            <div class="detail-card">
                <h1 style="margin-bottom: 1rem; color: var(--text-charcoal); font-size: 2.5rem;">${data.title}</h1>
                <div class="sch-meta">
                    <span class="meta-item" style="color: var(--primary-color);"><i class="fa-solid fa-tag"></i> ${data.category}</span>
                    <span class="meta-item" style="color: var(--danger-color);"><i class="fa-regular fa-clock"></i> Deadline: ${data.deadline}</span>
                    <span class="meta-item"><i class="fa-regular fa-calendar"></i> Posted: ${new Date(data.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                    <!-- Main Content Left -->
                    <div style="flex: 2; min-width: 250px;">
                        <div class="sch-section">
                            <h3>Eligibility</h3>
                            <p>${data.eligibility.replace(/\n/g, '<br>')}</p>
                        </div>
                        
                        <div class="sch-section">
                            <h3>Requirements</h3>
                            <p>${data.requirements.replace(/\n/g, '<br>')}</p>
                        </div>
                        
                        <div class="sch-section">
                            <h3>How to Apply</h3>
                            <p>${data.howToApply.replace(/\n/g, '<br>')}</p>
                        </div>
                        
                        ${contentHtml}
                    </div>
                    
                    <!-- Sidebar Right -->
                    <div style="flex: 1; min-width: 250px;">
                        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Actions</h3>
                            
                            ${whatsappLink ? `<a href="${whatsappLink}" target="_blank" class="apply-btn"><i class="fa-brands fa-whatsapp"></i> Chat with Us</a>` : ''}
                            
                            ${officialLinkHtml}
                            
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;">
                            
                            <h4 style="margin-bottom: 1rem; font-size: 1rem;">Share this opportunity</h4>
                            <div class="share-btns" style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <a href="https://wa.me/?text=${shareTitle}%20${shareUrl}" target="_blank" class="btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                                <a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" class="btn-twitter"><i class="fa-brands fa-x-twitter"></i> X (Twitter)</a>
                                <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" class="btn-facebook"><i class="fa-brands fa-facebook-f"></i> Facebook</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error("Error fetching scholarship details:", error);
        container.innerHTML = '<p style="text-align: center; color: red;">Failed to load scholarship details. Please try again later.</p>';
    }
});
