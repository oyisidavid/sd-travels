import { 
    auth, db, storage, 
    signInWithEmailAndPassword, onAuthStateChanged, signOut,
    collection, addDoc, getDocs, query, orderBy, deleteDoc, doc,
    ref, uploadBytesResumable, getDownloadURL
} from './firebase-config.js';

// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const newsForm = document.getElementById('news-form');
const publishBtn = document.getElementById('publish-btn');
const publishSuccess = document.getElementById('publish-success');
const articlesList = document.getElementById('articles-list');

// Authentication State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        authContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        loadArticles();
    } else {
        // User is signed out
        authContainer.classList.remove('hidden');
        dashboardContainer.classList.add('hidden');
    }
});

// Login Logic
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const btnText = loginBtn.querySelector('.btn-text');
    const loader = loginBtn.querySelector('.loader');
    
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';
    loginError.style.display = 'none';
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        loginError.style.display = 'block';
        loginError.textContent = error.message;
    } finally {
        btnText.style.display = 'inline-block';
        loader.style.display = 'none';
    }
});

// Logout Logic
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Publish News Logic
newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('news-title').value;
    const category = document.getElementById('news-category').value;
    const file = document.getElementById('news-image').files[0];
    
    // quill is global from admin.html
    const contentHtml = window.quill.root.innerHTML;
    
    if(contentHtml === '<p><br></p>') {
        alert("Please enter some article content.");
        return;
    }

    const btnText = publishBtn.querySelector('.btn-text');
    const loader = publishBtn.querySelector('.loader');
    
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';
    
    try {
        let imageUrl = null;
        
        // Upload image if exists
        if (file) {
            const storageRef = ref(storage, 'news_images/' + Date.now() + '_' + file.name);
            const uploadTask = await uploadBytesResumable(storageRef, file);
            imageUrl = await getDownloadURL(uploadTask.ref);
        }
        
        // Save to Firestore
        await addDoc(collection(db, "news"), {
            title: title,
            category: category,
            content: contentHtml,
            imageUrl: imageUrl,
            createdAt: new Date().toISOString()
        });
        
        // Reset form
        newsForm.reset();
        window.quill.setContents([{ insert: '\n' }]);
        
        publishSuccess.style.display = 'block';
        setTimeout(() => publishSuccess.style.display = 'none', 3000);
        
        loadArticles(); // Refresh list
        
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error publishing article: " + error.message);
    } finally {
        btnText.style.display = 'inline-block';
        loader.style.display = 'none';
    }
});

// Load Articles Logic
async function loadArticles() {
    try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        if(querySnapshot.empty) {
            articlesList.innerHTML = '<p style="color:#666;">No articles found. Publish your first one!</p>';
            return;
        }
        
        let html = '<table style="width:100%; border-collapse: collapse; text-align: left;">';
        html += '<tr style="border-bottom: 2px solid #eee;"> <th style="padding: 10px;">Date</th> <th style="padding: 10px;">Title</th> <th style="padding: 10px;">Category</th> <th style="padding: 10px;">Action</th> </tr>';
        
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const date = new Date(data.createdAt).toLocaleDateString();
            
            html += `<tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${date}</td>
                <td style="padding: 10px; font-weight: 500;">${data.title}</td>
                <td style="padding: 10px;"><span style="background: var(--bg-light); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${data.category}</span></td>
                <td style="padding: 10px;">
                    <button class="delete-btn" data-id="${docSnap.id}" style="background: none; border: none; color: var(--danger-color); cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
        
        html += '</table>';
        articlesList.innerHTML = html;
        
        // Attach delete listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if(confirm("Are you sure you want to delete this article?")) {
                    const id = e.currentTarget.getAttribute('data-id');
                    await deleteDoc(doc(db, "news", id));
                    loadArticles();
                }
            });
        });
        
    } catch (error) {
        console.error("Error loading articles: ", error);
        articlesList.innerHTML = '<p style="color:red;">Error loading articles.</p>';
    }
}
