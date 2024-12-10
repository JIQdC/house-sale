const itemsDiv = document.getElementById('items');
const categoryButtonsDiv = document.getElementById('category-buttons');

// Track selected categories
const selectedCategories = new Set(); // Start with no categories selected

fetch(`https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/gviz/tq?tqx=out:json`)
    .then(response => response.text())
    .then(data => {
        try {
            const jsonData = JSON.parse(data.substr(47).slice(0, -2));
            const rows = jsonData.table.rows;
            rows.shift(); // Skip headers

            // Generate category buttons dynamically based on product data
            const categories = new Set(); // Use a set to avoid duplicates

            rows.forEach(row => {
                const itemName = row.c[0]?.v || 'Unnamed Item';
                const description = (row.c[1]?.v || 'No description available').replace(/\n/g, '<br>'); // Replace line breaks with <br>
                const price = row.c[2]?.v || 'Consultar';
                const availability = row.c[3]?.v || 'Inmediata';
                const referenceUrl = row.c[4]?.v;
                const imageUrls = row.c[5]?.v.split('\n') || []; // Split image URLs by line break
                const published = row.c[6]?.v;
                const category = row.c[7]?.v;

                
                const contactUrl = `${CONFIG.googleFormBaseUrl}${encodeURIComponent(itemName)}`;
                
                if (published) {
                    // Add categories to the set
                    if (category) {
                        category.split(',').forEach(cat => categories.add(cat.trim()));
                    }
                    const itemCard = document.createElement('div');
                    itemCard.className = 'item-card';
                    itemCard.setAttribute('data-category', category); // Add data-category attribute

                    // Create image container with navigation arrows
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'image-container';
                    imageContainer.innerHTML = `
                        ${imageUrls.length > 1 ? '<button class="prev-btn" onclick="prevImage(this)">&#10094;</button>' : ''}
                        <img src="${imageUrls[0]}" alt="${itemName}" data-urls="${imageUrls.join('|')}">
                        ${imageUrls.length > 1 ? '<button class="next-btn" onclick="nextImage(this)">&#10095;</button>' : ''}
                    `;

                    itemCard.innerHTML = `
                        ${imageContainer.outerHTML}
                        <h2>${itemName}</h2>
                        <p>${description}</p>
                        <p>Disponibilidad: ${availability}</p>
                        ${referenceUrl ? `<a href="${referenceUrl}" target="_blank" class="reference-link">Link referencia</a>` : ''}
                        <p class="price">${price}</p>
                        <a href="${contactUrl}" target="_blank" class="contact-link">Lo quiero!</a>
                    `;

                    itemsDiv.appendChild(itemCard);
                }
            });

            // Add all button
            const allButton = document.createElement('button');
            allButton.className = 'category-btn active';
            allButton.textContent = 'Todas';
            allButton.onclick = () => {
                selectedCategories.clear();
                updateCategoryButtons();
                filterItems();
            };
            categoryButtonsDiv.appendChild(allButton);

            // Generate category buttons
            categories.forEach(category => {
                const button = document.createElement('button');
                button.className = 'category-btn';
                button.textContent = category;
                button.onclick = () => {
                    toggleCategory(category);
                    updateCategoryButtons();
                };
                categoryButtonsDiv.appendChild(button);
            });
        } catch (error) {
            console.error('Error parsing data:', error);
        }
    });

// Function to switch to the previous image
function prevImage(button) {
    const imageContainer = button.parentElement;
    const img = imageContainer.querySelector('img');
    const imageUrls = img.getAttribute('data-urls').split('|');
    let currentIndex = imageUrls.indexOf(img.src);
    currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    img.src = imageUrls[currentIndex];
}

// Function to switch to the next image
function nextImage(button) {
    const imageContainer = button.parentElement;
    const img = imageContainer.querySelector('img');
    const imageUrls = img.getAttribute('data-urls').split('|');
    let currentIndex = imageUrls.indexOf(img.src);
    currentIndex = (currentIndex + 1) % imageUrls.length;
    img.src = imageUrls[currentIndex];
}

// Function to toggle category selection
function toggleCategory(category) {
    if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
    } else {
        selectedCategories.add(category);
    }
    filterItems();
}

// Function to update category button styles
function updateCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(button => {
        if (button.textContent === 'Todas') {
            button.classList.toggle('active', selectedCategories.size === 0);
        } else {
            button.classList.toggle('active', selectedCategories.has(button.textContent));
        }
    });
}

// Function to filter items based on selected categories
function filterItems() {
    const items = document.querySelectorAll('.item-card');
    items.forEach(item => {
        const itemCategories = item.getAttribute('data-category').split(',').map(cat => cat.trim());
        const isVisible = selectedCategories.size === 0 || Array.from(selectedCategories).some(cat => itemCategories.includes(cat));
        item.style.display = isVisible ? 'block' : 'none';
    });
}