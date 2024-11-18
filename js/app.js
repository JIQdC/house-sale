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
                const description = row.c[1]?.v || 'No description available';
                const price = row.c[2]?.v || 'Consultar';
                const availability = row.c[3]?.v || 'Inmediata';
                const referenceUrl = row.c[4]?.v;
                const imageUrl = row.c[5]?.v;
                const published = row.c[6]?.v;
                const category = row.c[7]?.v;

                // Add categories to the set
                if (category) {
                    category.split(',').forEach(cat => categories.add(cat.trim()));
                }

                const contactUrl = `${CONFIG.googleFormBaseUrl}${encodeURIComponent(itemName)}`;

                if (published) {
                    const itemCard = document.createElement('div');
                    itemCard.className = 'item-card';
                    itemCard.setAttribute('data-category', category); // Add data-category attribute
                    itemCard.innerHTML = `
                        ${imageUrl ? `<img src="${imageUrl}" alt="${itemName}">` : ''}
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

            // Create buttons outside the loop
            categoryButtonsDiv.innerHTML = `
                <button class="category-btn active" data-category="all">Todas</button>
                ${Array.from(categories)
                    .map(category => `<button class="category-btn" data-category="${category}">${category}</button>`)
                    .join('')}
            `;

            // Add event listeners to category buttons
            categoryButtonsDiv.addEventListener('click', e => {
                if (!e.target.classList.contains('category-btn')) return;

                const button = e.target;
                const category = button.getAttribute('data-category');

                // Handle "All Categories" logic
                if (category === 'all') {
                    selectedCategories.clear(); // Clear selected categories
                    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active'); // Only "All Categories" is active
                } else {
                    // Toggle the category button
                    button.classList.toggle('active');
                    if (button.classList.contains('active')) {
                        selectedCategories.add(category);
                    } else {
                        selectedCategories.delete(category);
                    }

                    // If no categories are selected, activate "All Categories"
                    if (selectedCategories.size === 0) {
                        document.querySelector('.category-btn[data-category="all"]').classList.add('active');
                    } else {
                        document.querySelector('.category-btn[data-category="all"]').classList.remove('active');
                    }
                }

                // Filter products
                filterProducts();
            });

        } catch (err) {
            console.error('Error parsing JSON or rendering items:', err);
        }
    })
    .catch(error => console.error('Error fetching data:', error));

// Filter products based on selected categories
function filterProducts() {
    const items = document.querySelectorAll('.item-card');
    items.forEach(item => {
        const itemCategories = item.getAttribute('data-category')?.split(',') || [];
        if (
            selectedCategories.size === 0 || // Show all if no category selected
            Array.from(selectedCategories).some(cat => itemCategories.includes(cat))
        ) {
            item.style.display = ''; // Show the item
        } else {
            item.style.display = 'none'; // Hide the item
        }
    });
}
